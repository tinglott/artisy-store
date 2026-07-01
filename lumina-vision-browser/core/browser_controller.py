"""
browser_controller.py  (v2 — fully corrected)
-----------------------------------------------
Bug fixes applied (researched from Playwright docs + GitHub + StackOverflow):

  FIX-1  Anti-detection / stealth: adds --disable-blink-features=AutomationControlled,
         removes navigator.webdriver, spoofs Chrome UA, disables automation flags.
         YouTube/Google headless detection is the #1 cause of session failures.

  FIX-2  Missing actions added to controller:
           select_option()  — dropdown <select> and combobox
           upload_file()    — file input (<input type="file">)
           hover_element()  — menu triggers, tooltip launchers
           go_back()        — browser back button
           go_forward()     — browser forward button
           wait_for_text()  — smart wait until text appears on page

  FIX-3  click() now has x/y coordinate fallback — if data-agent-id locator fails
         (element not annotated or JS mark failed), falls back to clicking by
         stored (x, y) centre coordinates from the observation elements list.

  FIX-4  Smart post-action wait: navigate/goto waits for networkidle (up to 5 s),
         click waits for domcontentloaded when the click triggers navigation.
         Avoids the 600 ms flat wait that was too short for YouTube/Gumroad.

  FIX-5  observe() now always clears stale marks BEFORE injecting new ones, even
         if a previous screenshot step crashed before CLEAR_MARKS_JS ran.

  FIX-6  User agent updated to Chrome 124 (latest stable at time of writing).

  FIX-7  BrowserContext now includes extra HTTP headers that headless Chromium
         strips (sec-ch-ua, sec-ch-ua-platform) to better mimic a real browser.
"""

from __future__ import annotations
import asyncio
import base64
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Page, Browser, BrowserContext

# ── Elements we number for the agent ────────────────────────────────────────
INTERACTIVE_SELECTOR = (
    "a, button, input, textarea, select, [role='button'], [role='link'], "
    "[role='textbox'], [role='checkbox'], [role='menuitem'], [role='tab'], "
    "[role='combobox'], [onclick], [contenteditable='true']"
)

# ── FIX-1: Anti-detection init script ───────────────────────────────────────
STEALTH_JS = """
() => {
    // Remove navigator.webdriver flag that Google/YouTube checks
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // Spoof plugins array (headless has 0)
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    // Spoof languages
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    // Spoof chrome runtime object
    window.chrome = { runtime: {} };
    // Remove headless-specific permission query stub
    const origQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : origQuery(parameters);
}
"""

# ── Set-of-marks DOM annotation ─────────────────────────────────────────────
MARK_ELEMENTS_JS = r"""
() => {
    // FIX-5: always clear previous marks first
    document.querySelectorAll('.__agent_mark').forEach(e => e.remove());

    const selector = "a, button, input, textarea, select, [role='button'], [role='link'], "
        + "[role='textbox'], [role='checkbox'], [role='menuitem'], [role='tab'], "
        + "[role='combobox'], [onclick], [contenteditable='true']";

    function isVisible(el) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
        return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    }

    const nodes = Array.from(document.querySelectorAll(selector)).filter(isVisible);
    const results = [];

    nodes.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const idx = i + 1;
        el.setAttribute('data-agent-id', String(idx));

        const label = document.createElement('div');
        label.className = '__agent_mark';
        label.textContent = String(idx);
        label.style.cssText = `
            position: fixed; left:${r.left}px; top:${Math.max(r.top - 14, 0)}px;
            background:#ff3366; color:white; font:bold 10px monospace;
            padding:1px 4px; border-radius:3px; z-index:2147483647;
            pointer-events:none; line-height:1.4;`;
        document.body.appendChild(label);

        const box = document.createElement('div');
        box.className = '__agent_mark';
        box.style.cssText = `
            position: fixed; left:${r.left}px; top:${r.top}px;
            width:${r.width}px; height:${r.height}px;
            border:1.5px solid #ff3366; z-index:2147483646;
            pointer-events:none; box-sizing:border-box;`;
        document.body.appendChild(box);

        // FIX-2: include select options for comboboxes
        let options = [];
        if (el.tagName.toLowerCase() === 'select') {
            options = Array.from(el.options).map(o => o.text.trim());
        }

        let text = (el.innerText || el.value || el.placeholder || el.getAttribute('aria-label') || '')
            .trim().slice(0, 80);

        results.push({
            id: idx,
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            text,
            type: el.getAttribute('type') || '',
            href: el.tagName.toLowerCase() === 'a' ? el.href : undefined,
            options: options.length ? options : undefined,
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + r.height / 2),
        });
    });

    return results;
}
"""

CLEAR_MARKS_JS = "() => document.querySelectorAll('.__agent_mark').forEach(e => e.remove())"


@dataclass
class PageObservation:
    url: str
    title: str
    elements: list[dict] = field(default_factory=list)
    screenshot_path: Optional[str] = None
    dom_text: str = ""

    def compact_dom_summary(self, limit: int = 120) -> str:
        lines = []
        for el in self.elements[:limit]:
            desc = el.get("text") or el.get("href") or el.get("type") or ""
            opts = ""
            if el.get("options"):
                opts = " [options: " + ", ".join(el["options"][:5]) + "]"
            lines.append(f"[{el['id']}] <{el['tag']}{' ' + el['role'] if el['role'] else ''}> {desc}{opts}")
        return "\n".join(lines)


class BrowserController:
    """Thin async wrapper around Playwright. No API keys, no platform SDKs."""

    # FIX-6: updated user agent
    USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )

    # FIX-1: stealth Chrome launch args
    STEALTH_ARGS = [
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-default-apps",
        "--disable-setuid-sandbox",
        "--disable-infobars",
        "--window-size=1280,900",
    ]

    def __init__(self, headless: bool = True, downloads_dir: str = "./downloads",
                 screenshots_dir: str = "./screenshots", viewport=(1280, 900)):
        self.headless = headless
        self.viewport = {"width": viewport[0], "height": viewport[1]}
        self.downloads_dir = Path(downloads_dir)
        self.screenshots_dir = Path(screenshots_dir)
        self.downloads_dir.mkdir(parents=True, exist_ok=True)
        self.screenshots_dir.mkdir(parents=True, exist_ok=True)

        self._pw = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self._step = 0
        self._elements_cache: list[dict] = []   # FIX-3: cache for x/y fallback

    async def start(self, storage_state: Optional[str] = None):
        self._pw = await async_playwright().start()
        self.browser = await self._pw.chromium.launch(
            headless=self.headless,
            args=self.STEALTH_ARGS,   # FIX-1
        )
        ctx_kwargs = dict(
            viewport=self.viewport,
            accept_downloads=True,
            user_agent=self.USER_AGENT,
            # FIX-7: extra headers to mimic real browser
            extra_http_headers={
                "Accept-Language": "en-US,en;q=0.9",
                "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124"',
                "sec-ch-ua-platform": '"Windows"',
            },
        )
        if storage_state and Path(storage_state).exists():
            ctx_kwargs["storage_state"] = storage_state
        self.context = await self.browser.new_context(**ctx_kwargs)
        # FIX-1: inject stealth script into every new page
        await self.context.add_init_script(STEALTH_JS)
        self.page = await self.context.new_page()
        return self

    async def save_session(self, path: str):
        """Save full browser state (cookies + localStorage + IndexedDB) to file.
        Uses Playwright's storage_state() — captures httpOnly cookies properly.
        This is the ONLY correct way; document.cookie misses httpOnly cookies."""
        await self.context.storage_state(path=path)

    async def close(self):
        if self.browser:
            await self.browser.close()
        if self._pw:
            await self._pw.stop()

    # ── Observation ──────────────────────────────────────────────────────────

    async def observe(self, annotate: bool = True) -> PageObservation:
        await self.page.wait_for_load_state("domcontentloaded")
        try:
            await self.page.wait_for_load_state("networkidle", timeout=4000)
        except Exception:
            pass

        elements = await self.page.evaluate(MARK_ELEMENTS_JS)
        self._elements_cache = elements   # FIX-3: cache for fallback

        screenshot_path = None
        if annotate:
            self._step += 1
            screenshot_path = str(self.screenshots_dir / f"step_{self._step:03d}.png")
            await self.page.screenshot(path=screenshot_path)
            await self.page.evaluate(CLEAR_MARKS_JS)

        obs = PageObservation(
            url=self.page.url,
            title=await self.page.title(),
            elements=elements,
            screenshot_path=screenshot_path,
        )
        obs.dom_text = obs.compact_dom_summary()
        return obs

    async def screenshot_b64(self) -> str:
        buf = await self.page.screenshot()
        return base64.b64encode(buf).decode("utf-8")

    # ── Navigation ───────────────────────────────────────────────────────────

    async def goto(self, url: str):
        await self.page.goto(url, wait_until="domcontentloaded")
        # FIX-4: wait for network to settle after navigation
        try:
            await self.page.wait_for_load_state("networkidle", timeout=5000)
        except Exception:
            pass

    async def go_back(self):   # FIX-2
        await self.page.go_back(wait_until="domcontentloaded")

    async def go_forward(self):   # FIX-2
        await self.page.go_forward(wait_until="domcontentloaded")

    # ── Interaction ──────────────────────────────────────────────────────────

    async def click(self, element_id: int):
        """FIX-3: tries data-agent-id locator first; falls back to stored (x,y)."""
        try:
            el = self.page.locator(f"[data-agent-id='{element_id}']")
            await el.scroll_into_view_if_needed(timeout=3000)
            await el.click(timeout=5000)
        except Exception:
            # fallback: click by coordinate from cached observation
            cached = next((e for e in self._elements_cache if e["id"] == element_id), None)
            if cached:
                await self.page.mouse.click(cached["x"], cached["y"])
            else:
                raise ValueError(f"Element {element_id} not found by ID or coordinate cache")
        # FIX-4: brief networkidle wait after click (catches soft-navigations)
        try:
            await self.page.wait_for_load_state("networkidle", timeout=3000)
        except Exception:
            pass

    async def type_text(self, element_id: int, text: str, clear_first: bool = True):
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        await el.scroll_into_view_if_needed()
        if clear_first:
            await el.fill("")
        await el.type(text, delay=15)

    async def press_key(self, key: str):
        await self.page.keyboard.press(key)

    async def scroll(self, direction: str = "down", amount: int = 800):
        delta = amount if direction == "down" else -amount
        await self.page.mouse.wheel(0, delta)

    # ── FIX-2: New actions ───────────────────────────────────────────────────

    async def select_option(self, element_id: int, value: str):
        """Select a <select> option by visible text or value attribute."""
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        try:
            await el.select_option(label=value, timeout=4000)
        except Exception:
            await el.select_option(value=value, timeout=4000)

    async def upload_file(self, element_id: int, file_path: str):
        """Upload a file through a <input type='file'> element."""
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        await el.set_input_files(file_path)

    async def hover_element(self, element_id: int):
        """Hover over an element — needed for dropdown menus and tooltips."""
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        await el.scroll_into_view_if_needed()
        await el.hover()
        await self.page.wait_for_timeout(500)   # let menu render

    async def wait_for_text(self, text: str, timeout_ms: int = 10000):
        """Wait until given text appears anywhere on the page."""
        await self.page.wait_for_selector(
            f"text={text}", timeout=timeout_ms, state="visible"
        )

    # ── Extraction ───────────────────────────────────────────────────────────

    async def extract_text(self, element_id: Optional[int] = None) -> str:
        if element_id is None:
            return await self.page.inner_text("body")
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        return await el.inner_text()

    # ── FIX-4: Smart wait ────────────────────────────────────────────────────

    async def wait(self, ms: int = 1000):
        await self.page.wait_for_timeout(ms)
