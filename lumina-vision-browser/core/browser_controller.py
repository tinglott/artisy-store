"""
browser_controller.py
----------------------
Drives a real Chromium browser via Playwright. No platform API keys required —
this controls the browser exactly the way a human would (click, type, scroll).

Two ways it "sees" a page, used together (hybrid approach):
  1. DOM/accessibility extraction -> fast, cheap, precise (used first)
  2. Set-of-marks screenshot -> numbered boxes drawn over every interactive
     element, sent to a vision model when the DOM read is ambiguous
     (icon-only buttons, canvas UI, custom widgets, etc.)

This module has zero dependency on any specific AI provider. It just exposes
`observe()` (get the current state) and `act()` (perform an action). The
decision of *what* action to take lives in vision_agent.py.
"""

from __future__ import annotations
import asyncio
import base64
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from playwright.async_api import async_playwright, Page, Browser, BrowserContext

# Elements we consider "interactive" / worth numbering for the agent
INTERACTIVE_SELECTOR = (
    "a, button, input, textarea, select, [role='button'], [role='link'], "
    "[role='textbox'], [role='checkbox'], [role='menuitem'], [role='tab'], "
    "[onclick], [contenteditable='true']"
)

MARK_ELEMENTS_JS = r"""
() => {
    function isVisible(el) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
        return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    }

    document.querySelectorAll('.__agent_mark').forEach(e => e.remove());

    const selector = "a, button, input, textarea, select, [role='button'], [role='link'], "
        + "[role='textbox'], [role='checkbox'], [role='menuitem'], [role='tab'], "
        + "[onclick], [contenteditable='true']";

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

        let text = (el.innerText || el.value || el.placeholder || el.getAttribute('aria-label') || '')
            .trim().slice(0, 80);

        results.push({
            id: idx,
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            text,
            type: el.getAttribute('type') || '',
            href: el.tagName.toLowerCase() === 'a' ? el.href : undefined,
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
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
            lines.append(f"[{el['id']}] <{el['tag']}{' ' + el['role'] if el['role'] else ''}> {desc}")
        return "\n".join(lines)


class BrowserController:
    """Thin async wrapper around Playwright. No API keys, no platform SDKs."""

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

    async def start(self, storage_state: Optional[str] = None):
        self._pw = await async_playwright().start()
        self.browser = await self._pw.chromium.launch(headless=self.headless)
        self.context = await self.browser.new_context(
            viewport=self.viewport,
            accept_downloads=True,
            storage_state=storage_state if storage_state and Path(storage_state).exists() else None,
            user_agent=("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                        "(KHTML, like Gecko) Chrome/125.0 Safari/537.36"),
        )
        self.page = await self.context.new_page()
        return self

    async def save_session(self, path: str):
        await self.context.storage_state(path=path)

    async def close(self):
        if self.browser:
            await self.browser.close()
        if self._pw:
            await self._pw.stop()

    async def observe(self, annotate: bool = True) -> PageObservation:
        await self.page.wait_for_load_state("domcontentloaded")
        try:
            await self.page.wait_for_load_state("networkidle", timeout=3000)
        except Exception:
            pass

        elements = await self.page.evaluate(MARK_ELEMENTS_JS)

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

    async def goto(self, url: str):
        await self.page.goto(url, wait_until="domcontentloaded")

    async def click(self, element_id: int):
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        await el.scroll_into_view_if_needed()
        await el.click(timeout=5000)

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

    async def extract_text(self, element_id: Optional[int] = None) -> str:
        if element_id is None:
            return await self.page.inner_text("body")
        el = self.page.locator(f"[data-agent-id='{element_id}']")
        return await el.inner_text()

    async def wait(self, ms: int = 1000):
        await self.page.wait_for_timeout(ms)
