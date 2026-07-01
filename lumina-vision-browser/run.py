"""
run.py — LUMINA Vision Browser CLI  (v2 — fully corrected)
------------------------------------------------------------
Bug fixes applied:

  FIX-1  Session saved in `finally` block — even if task throws an exception,
         the session is persisted. v1 only saved on success, losing auth on errors.

  FIX-2  Auto-session-path inference: if --session not given, a path is
         automatically derived from the start URL domain
         (e.g., youtube.com → sessions/youtube.json). Keeps logins persistent
         with zero extra flags for the user.

  FIX-3  Grok auto-fallback wired in: VisionAgent now receives GrokProvider as
         fallback_provider so GitHub Models failures auto-retry with Grok.

  FIX-4  Workflow --session also saved in `finally`.

Usage:
  python run.py task "Open YouTube Studio and check my video list"
  python run.py task "Upload a product to Gumroad" --session sessions/gumroad.json
  python run.py --provider grok task "..."
  python run.py workflow workflows/youtube_studio_upload.yaml --var video_path=/path/to/video.mp4
  python run.py login youtube.com   # first-time login — opens browser, saves session
"""

import argparse
import asyncio
import json
import os
import sys
from typing import Optional
from urllib.parse import urlparse

from core.browser_controller import BrowserController
from core.vision_agent import VisionAgent, GitHubModelsProvider, GrokProvider, HFProvider, OllamaProvider
from core.workflow_engine import WorkflowEngine


def build_provider(name: str):
    if name in ("github", "github_models"):
        return GitHubModelsProvider()
    if name == "grok":
        return GrokProvider()
    if name == "hf":
        return HFProvider()
    if name == "ollama":
        return OllamaProvider()
    raise ValueError(f"Unknown provider: {name}. Choose: github, grok, hf, ollama")


def _infer_session_path(start_url: Optional[str], explicit: Optional[str]) -> Optional[str]:
    """FIX-2: derive a session file path from the target URL if none given."""
    if explicit:
        return explicit
    if not start_url:
        return None
    try:
        domain = urlparse(start_url).netloc.replace("www.", "").split(".")[0]
        return f"./sessions/{domain}.json"
    except Exception:
        return None


async def run_task(args):
    session_path = _infer_session_path(args.start_url, args.session)   # FIX-2
    ctrl = BrowserController(
        headless=args.headless,
        screenshots_dir="./screenshots",
        downloads_dir="./downloads",
    )
    await ctrl.start(storage_state=session_path)
    try:
        primary   = build_provider(args.provider)
        fallback  = GrokProvider() if args.provider != "grok" else None  # FIX-3
        agent = VisionAgent(ctrl, primary, max_steps=args.max_steps, fallback_provider=fallback)
        result = await agent.run(goal=args.goal, start_url=args.start_url)
        print(json.dumps({
            "success": result.success,
            "result": result.result,
            "steps_taken": result.steps_taken,
            "history": result.history,
        }, indent=2))
    finally:
        # FIX-1: always save session, even on failure
        if session_path:
            try:
                await ctrl.save_session(session_path)
            except Exception:
                pass
        await ctrl.close()


async def run_workflow(args):
    session_path = args.session   # workflows usually specify session explicitly
    ctrl = BrowserController(
        headless=args.headless,
        screenshots_dir="./screenshots",
        downloads_dir="./downloads",
    )
    await ctrl.start(storage_state=session_path)
    try:
        primary   = build_provider(args.provider)
        fallback  = GrokProvider() if args.provider != "grok" else None  # FIX-3
        agent = VisionAgent(ctrl, primary, max_steps=args.max_steps, fallback_provider=fallback)
        engine = WorkflowEngine(ctrl, agent)

        variables = {}
        for kv in args.var or []:
            k, _, v = kv.partition("=")
            variables[k] = v

        result = await engine.run(args.workflow_path, variables=variables)
        print(json.dumps({
            "workflow": result.workflow_name,
            "success": result.success,
            "steps": result.step_results,
            "variables": result.variables,
        }, indent=2, default=str))
    finally:
        # FIX-4: always save session
        if session_path:
            try:
                await ctrl.save_session(session_path)
            except Exception:
                pass
        await ctrl.close()


async def run_login(args):
    """First-time login helper: opens browser visibly, waits for user to log in,
    then saves the full session (including httpOnly cookies) via storage_state."""
    domain = args.domain.replace("https://", "").replace("http://", "").split("/")[0]
    session_path = f"./sessions/{domain.replace('www.', '').split('.')[0]}.json"
    os.makedirs("./sessions", exist_ok=True)

    print(f"\n🌐  Opening {domain} in headed browser...")
    print(f"📝  Log in manually, then press ENTER in this terminal to save your session.")
    print(f"💾  Session will be saved to: {session_path}\n")

    ctrl = BrowserController(headless=False)
    await ctrl.start()
    await ctrl.goto(f"https://{domain}")

    try:
        input("  [Press ENTER after you've logged in] ")
    except EOFError:
        await asyncio.sleep(30)   # non-interactive mode: wait 30s

    await ctrl.save_session(session_path)
    print(f"\n✅  Session saved to {session_path}")
    print(f"    Use --session {session_path} on future runs, or it will be auto-detected.\n")
    await ctrl.close()


def main():
    parser = argparse.ArgumentParser(
        description="LUMINA Vision Browser — AI-driven browser automation, no platform API required."
    )
    parser.add_argument(
        "--provider", default="github",
        choices=["github", "grok", "hf", "ollama"],
        help="AI provider. Default: github (free GPT-4o). Grok auto-used as fallback.",
    )
    parser.add_argument("--headless", type=lambda s: s.lower() != "false", default=True)
    parser.add_argument("--max-steps", dest="max_steps", type=int, default=25)
    parser.add_argument("--session", default=None,
                        help="Path to session file. Auto-inferred from URL if omitted.")

    sub = parser.add_subparsers(dest="command", required=True)

    p_task = sub.add_parser("task", help="Run a freeform natural-language task")
    p_task.add_argument("goal")
    p_task.add_argument("--start-url", dest="start_url", default=None)

    p_wf = sub.add_parser("workflow", help="Run a YAML workflow file")
    p_wf.add_argument("workflow_path")
    p_wf.add_argument("--var", action="append", help="key=value variable (repeatable)")

    p_login = sub.add_parser("login", help="First-time login: opens browser, saves session")
    p_login.add_argument("domain", help="e.g. youtube.com or gumroad.com")

    args = parser.parse_args()

    if args.command == "task":
        asyncio.run(run_task(args))
    elif args.command == "workflow":
        asyncio.run(run_workflow(args))
    elif args.command == "login":
        asyncio.run(run_login(args))


if __name__ == "__main__":
    main()
