"""
workflow_engine.py
-------------------
Lets you define repeatable, multi-step automations as YAML instead of writing
Python for every task. Two kinds of steps:

  - "goto" / "click" / "type" / "wait" -> deterministic, fast, cheap, no LLM call
  - "ai_task" -> hands a natural-language sub-goal to VisionAgent

Mix scripted steps for anything stable, AI steps for anything that changes.
"""

from __future__ import annotations
import yaml
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from .browser_controller import BrowserController
from .vision_agent import VisionAgent, AgentResult


@dataclass
class WorkflowRunResult:
    workflow_name: str
    success: bool
    step_results: list[dict] = field(default_factory=list)
    variables: dict = field(default_factory=dict)


class WorkflowEngine:
    def __init__(self, controller: BrowserController, agent: VisionAgent):
        self.controller = controller
        self.agent = agent

    @staticmethod
    def load(path: str) -> dict:
        return yaml.safe_load(Path(path).read_text())

    async def run(self, workflow_path: str, variables: Optional[dict] = None) -> WorkflowRunResult:
        wf = self.load(workflow_path)
        variables = {**wf.get("variables", {}), **(variables or {})}
        result = WorkflowRunResult(workflow_name=wf.get("name", workflow_path), success=True, variables=variables)

        for i, step in enumerate(wf.get("steps", [])):
            step = {k: (self._sub(v, variables) if isinstance(v, str) else v) for k, v in step.items()}
            step_type = step.get("type")
            try:
                output = await self._run_step(step_type, step)
                result.step_results.append({"step": i, "type": step_type, "ok": True, "output": output})
                if step.get("save_as") and output is not None:
                    variables[step["save_as"]] = output
            except Exception as e:
                result.step_results.append({"step": i, "type": step_type, "ok": False, "error": str(e)})
                if not step.get("continue_on_error", False):
                    result.success = False
                    break

        return result

    async def _run_step(self, step_type: str, step: dict):
        c = self.controller

        if step_type == "goto":
            await c.goto(step["url"])
            return None

        if step_type == "wait":
            await c.wait(step.get("ms", 1000))
            return None

        if step_type == "click_text":
            obs = await c.observe(annotate=False)
            match = next((e for e in obs.elements if step["text"].lower() in e.get("text", "").lower()), None)
            if not match:
                raise ValueError(f"No element found containing text: {step['text']}")
            await c.click(match["id"])
            return None

        if step_type == "type_into":
            obs = await c.observe(annotate=False)
            match = next((e for e in obs.elements
                          if step["target"].lower() in (e.get("text", "") + e.get("role", "")).lower()), None)
            if not match:
                raise ValueError(f"No input found matching: {step['target']}")
            await c.type_text(match["id"], step["text"])
            return None

        if step_type == "press_key":
            await c.press_key(step["key"])
            return None

        if step_type == "scroll":
            await c.scroll(step.get("direction", "down"), step.get("amount", 800))
            return None

        if step_type == "extract":
            return await c.extract_text()

        if step_type == "ai_task":
            res: AgentResult = await self.agent.run(goal=step["goal"], start_url=step.get("start_url"))
            if not res.success:
                raise RuntimeError(f"ai_task failed: {res.result}")
            return res.result

        raise ValueError(f"Unknown step type: {step_type}")

    @staticmethod
    def _sub(value: str, variables: dict) -> str:
        for k, v in variables.items():
            value = value.replace("{{" + k + "}}", str(v))
        return value
