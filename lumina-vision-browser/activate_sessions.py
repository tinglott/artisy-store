"""
activate_sessions.py  (v2 — fully corrected)
----------------------------------------------
CRITICAL FIX: v1 used JavaScript document.cookie to extract cookies.
This is WRONG — JavaScript cannot read httpOnly cookies (by browser design).
YouTube, Google, Gumroad all mark their session cookies as httpOnly.

CORRECT APPROACH (Playwright docs + GitHub issues research):
  Playwright's context.storage_state(path=...) runs at the BROWSER ENGINE
  level (not JavaScript). It captures ALL cookies including httpOnly ones,
  plus localStorage and IndexedDB. This is the only correct way to persist
  authenticated sessions.

  Workflow:
    1. Launch Chromium with headless=False (so you can see and interact)
    2. Navigate to the login page
    3. User logs in manually
    4. Call context.storage_state(path=...) — captures everything
    5. Future runs: new_context(storage_state=path) restores the full session

Usage:
  python activate_sessions.py youtube     → saves sessions/youtube.json
  python activate_sessions.py gumroad     → saves sessions/gumroad.json
  python activate_sessions.py all         → runs both in sequence
  python activate_sessions.py <any url>   → generic site login
"""

import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

SESSIONS_DIR = Path(__file__).parent / "sessions"

KNOWN_SITES = {
    "youtube": {
        "login_url": "https://accounts.google.com/signin",
        "session_file": "youtube.json",
        "verify_url": "https://studio.youtube.com",
        "verify_text": "Your channel",
        "notes": "Log in with Google. After you see YouTube Studio dashboard, press ENTER.",
    },
    "gumroad": {
        "login_url": "https://app.gumroad.com/login",
        "session_file": "gumroad.json",
        "verify_url": "https://app.gumroad.com/dashboard",
        "verify_text": "Dashboard",
        "notes": "Log in with tinglott@gmail.com. After you see the dashboard, press ENTER.",
    },
}

# FIX-1: stealth Chrome args (same as browser_controller.py)
STEALTH_ARGS = [
    "--disable-blink-features=AutomationControlled",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-extensions",
    "--disable-infobars",
    "--window-size=1280,900",
]

STEALTH_JS = """
() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    window.chrome = { runtime: {} };
}
"""


async def activate_site(name: str, config: dict):
    SESSIONS_DIR.mkdir(exist_ok=True)
    session_path = str(SESSIONS_DIR / config["session_file"])

    print(f"\n{'='*60}")
    print(f"  Activating session for: {name.upper()}")
    print(f"  Login URL : {config['login_url']}")
    print(f"  Session   : {session_path}")
    print(f"\n  📋 Instructions: {config['notes']}")
    print(f"{'='*60}\n")

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=False,      # MUST be headed for user login
            args=STEALTH_ARGS,
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        await context.add_init_script(STEALTH_JS)
        page = await context.new_page()

        await page.goto(config["login_url"], wait_until="domcontentloaded")
        print(f"  Browser opened. Please log in now...\n")

        # Wait for user input
        try:
            input("  [Press ENTER after you have fully logged in] ")
        except EOFError:
            print("  Non-interactive mode — waiting 60 seconds for login...")
            await asyncio.sleep(60)

        # CORRECT: use Playwright's storage_state — captures httpOnly cookies
        await context.storage_state(path=session_path)

        # Verify the session works
        print(f"\n  Verifying session at {config['verify_url']}...")
        await page.goto(config["verify_url"], wait_until="domcontentloaded")
        await asyncio.sleep(3)

        title = await page.title()
        current_url = page.url

        if config["verify_text"].lower() in title.lower() or config["verify_text"].lower() in current_url.lower():
            print(f"  ✅ Session verified! Title: {title}")
        else:
            print(f"  ⚠️  Could not auto-verify (title: {title}, url: {current_url})")
            print(f"     Session was still saved — it may work on next run.")

        await browser.close()

    print(f"\n  💾 Session saved to: {session_path}")
    print(f"     Run future tasks with: --session {session_path}\n")


async def activate_generic(url: str):
    """Generic login for any site not in KNOWN_SITES."""
    from urllib.parse import urlparse
    domain = urlparse(url if url.startswith("http") else f"https://{url}").netloc
    slug = domain.replace("www.", "").split(".")[0]
    SESSIONS_DIR.mkdir(exist_ok=True)
    session_path = str(SESSIONS_DIR / f"{slug}.json")

    print(f"\n  Opening {url} — log in, then press ENTER...\n")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, args=STEALTH_ARGS)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        await context.add_init_script(STEALTH_JS)
        page = await context.new_page()
        await page.goto(url if url.startswith("http") else f"https://{url}")
        try:
            input("  [Press ENTER after login] ")
        except EOFError:
            await asyncio.sleep(60)
        await context.storage_state(path=session_path)
        await browser.close()
    print(f"  ✅ Session saved to {session_path}")


async def main():
    target = sys.argv[1].lower() if len(sys.argv) > 1 else "all"

    if target == "all":
        for name, config in KNOWN_SITES.items():
            await activate_site(name, config)
        print("\n🎉 All sessions activated! LUMINA Vision Browser is ready.")

    elif target in KNOWN_SITES:
        await activate_site(target, KNOWN_SITES[target])

    else:
        # treat as URL
        await activate_generic(target)


if __name__ == "__main__":
    asyncio.run(main())
