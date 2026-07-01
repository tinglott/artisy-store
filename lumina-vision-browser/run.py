"""
run.py — LUMINA Vision Browser CLI
------------------------------------
Freeform task (GitHub Models / free by default):
    python run.py task "Go to youtube.com, search for lofi beats, click the first video"

    # explicit provider:
    python run.py task "..." --provider grok
    python run.py task "..." --provider hf
    python run.py task "..." --provider ollama

Run a YAML workflow:
    python run.py workflow workflows/youtube_channel_research.yaml \
        --var channel_url=https://www.youtube.com/@tingsterlott

Stay logged in across runs (session cookie file):
    python run.py task "check my notifications" --session ./sessions/youtube.json
    # First run: log in manually with --headless=false; session saved automatically
"""

import argparse
import asyncio
import json
import sys

from core.browser_controller import BrowserController
from core.vision_agent import VisionAgent, GitHubModelsProvider, GrokProvider, HFProvider, OllamaProvider
from core.workflow_engine import WorkflowEngine


def build_provider(name: str):
    """
    Provider priority:
      github  -> free GPT-4o vision (DEFAULT)
      grok    -> xAI Grok-3 (fallback, paid)
      hf      -> HuggingFace endpoint (open-source VLM)
      ollama  -> fully local, zero cost, zero API
    """
    if name in ("github", "github_models"):
        return GitHubModelsProvider()
    if name == "grok":
        return GrokProvider()
    if name == "hf":
        return HFProvider()
    if name == "ollama":
        return OllamaProvider()
    raise ValueError(f"Unknown provider: {name}. Choose: github, grok, hf, ollama")


async def run_task(args):
    ctrl = BrowserController(
        headless=args.headless,
        screenshots_dir="./screenshots",
        downloads_dir="./downloads",
    )
    await ctrl.start(storage_state=args.session)
    try:
        provider = build_provider(args.provider)
        agent = VisionAgent(ctrl, provider, max_steps=args.max_steps)
        result = await agent.run(goal=args.goal, start_url=args.start_url)
        print(json.dumps({
            "success": result.success,
            "result": result.result,
            "steps_taken": result.steps_taken,
            "history": result.history,
        }, indent=2))
        if args.session:
            await ctrl.save_session(args.session)
    finally:
        await ctrl.close()


async def run_workflow(args):
    ctrl = BrowserController(
        headless=args.headless,
        screenshots_dir="./screenshots",
        downloads_dir="./downloads",
    )
    await ctrl.start(storage_state=args.session)
    try:
        provider = build_provider(args.provider)
        agent = VisionAgent(ctrl, provider, max_steps=args.max_steps)
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
        if args.session:
            await ctrl.save_session(args.session)
    finally:
        await ctrl.close()


def main():
    parser = argparse.ArgumentParser(
        description="LUMINA Vision Browser — AI-driven browser automation, no platform API required."
    )
    parser.add_argument(
        "--provider", default="github",
        choices=["github", "grok", "hf", "ollama"],
        help="AI provider. Default: github (free GPT-4o). Use grok for xAI fallback.",
    )
    parser.add_argument("--headless", type=lambda s: s.lower() != "false", default=True)
    parser.add_argument("--max-steps", dest="max_steps", type=int, default=25)
    parser.add_argument("--session", default=None, help="Path to save/load login session cookies")

    sub = parser.add_subparsers(dest="command", required=True)

    p_task = sub.add_parser("task", help="Run a freeform natural-language task")
    p_task.add_argument("goal")
    p_task.add_argument("--start-url", dest="start_url", default=None)

    p_wf = sub.add_parser("workflow", help="Run a YAML workflow file")
    p_wf.add_argument("workflow_path")
    p_wf.add_argument("--var", action="append", help="key=value variable (repeatable)")

    args = parser.parse_args()

    if args.command == "task":
        asyncio.run(run_task(args))
    elif args.command == "workflow":
        asyncio.run(run_workflow(args))


if __name__ == "__main__":
    main()
