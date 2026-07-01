"""
vision_agent.py
----------------
The decision-making loop. Provider-agnostic — plug in whichever model you want.

DEFAULT PROVIDER STACK (no setup required for Ting's workspace):
  1. GitHubModelsProvider  -> free GPT-4o vision via GitHub Models API (PRIMARY)
  2. GrokProvider          -> xAI Grok-3 via api.x.ai (FALLBACK / image tasks)
  3. HFProvider            -> HuggingFace Inference Endpoint (open-source VLM)
  4. OllamaProvider        -> fully offline, no API key (local llama3.2-vision)

The agent never talks to YouTube/any platform's API. It only ever sees:
  - a compact text list of numbered interactive elements (fast path)
  - an annotated screenshot with the same numbers drawn on it (vision fallback)

...and it only ever responds with one JSON action from a fixed vocabulary,
which browser_controller.py then executes as a real mouse/keyboard action.
"""

from __future__ import annotations
import json
import os
import base64
from dataclasses import dataclass
from typing import Optional, Protocol

from .browser_controller import BrowserController, PageObservation

# ── Load API keys from workspace (set once, used everywhere) ────────────────
def _load_github_token() -> str:
    try:
        import json as _json
        data = _json.loads(open("/tasklet/agent/home/github_models_token.json").read())
        return data.get("token", "") or os.environ.get("GITHUB_TOKEN", "")
    except Exception:
        return os.environ.get("GITHUB_TOKEN", "")

def _load_grok_key() -> str:
    try:
        import re
        txt = open("/tasklet/workspace/home/AGENTS.md").read()
        pattern = "xai-" + "[A-Za-z0-9]+"
        m = re.search(pattern, txt)
        return m.group(0) if m else os.environ.get("XAI_API_KEY", "")
    except Exception:
        return os.environ.get("XAI_API_KEY", "")

def _load_hf_token() -> str:
    try:
        import re
        txt = open("/tasklet/workspace/home/AGENTS.md").read()
        pattern = "hf_" + "[A-Za-z0-9]+"
        m = re.search(pattern, txt)
        return m.group(0) if m else os.environ.get("HF_TOKEN", "")
    except Exception:
        return os.environ.get("HF_TOKEN", "")

# ─────────────────────────────────────────────────────────────────────────────

ACTION_VOCABULARY = """
You control a real web browser on behalf of a human. You do not have API access
to any platform — you interact exactly like a person would: clicking, typing,
scrolling, reading. Respond with ONE JSON object only, no prose, matching one
of these actions:

{"action": "click", "element_id": <int>, "reason": "<why>"}
{"action": "type", "element_id": <int>, "text": "<string>", "reason": "<why>"}
{"action": "press_key", "key": "Enter", "reason": "<why>"}
{"action": "scroll", "direction": "down"|"up", "reason": "<why>"}
{"action": "goto", "url": "<string>", "reason": "<why>"}
{"action": "wait", "ms": 1500, "reason": "<why>"}
{"action": "extract", "element_id": <int or null>, "reason": "<why>"}
{"action": "done", "result": "<final answer / summary for the user>"}
{"action": "fail", "reason": "<why you are stuck>"}

Rules:
- Only reference element_id numbers that are visible in the current element list / screenshot.
- Prefer the smallest number of actions that accomplish the goal.
- If the DOM element list is enough to decide, use it. Only lean on the screenshot
  for icon-only buttons, custom widgets, or when the DOM list seems wrong.
- Never invent an element_id that wasn't given to you.
- If you've made no progress after several attempts, return "fail" instead of looping.
"""


class ModelProvider(Protocol):
    async def decide(self, goal: str, history: list[str], obs: PageObservation,
                      screenshot_b64: Optional[str]) -> dict: ...


# ── PRIMARY: GitHub Models (free GPT-4o vision) ──────────────────────────────

class GitHubModelsProvider:
    """Free GPT-4o vision via GitHub Models API. No billing, no quota worries.
    Token loaded automatically from /tasklet/agent/home/github_models_token.json"""

    def __init__(self, model: str = "gpt-4o", token: Optional[str] = None):
        self.model = model
        self.endpoint = "https://models.inference.ai.azure.com"
        self.token = token or _load_github_token()

    async def decide(self, goal, history, obs: PageObservation, screenshot_b64):
        import httpx
        prompt = _build_prompt(goal, history, obs)

        messages_content = [{"type": "text", "text": prompt}]
        if screenshot_b64:
            messages_content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{screenshot_b64}"},
            })

        payload = {
            "model": self.model,
            "messages": [{"role": "user", "content": messages_content}],
            "max_tokens": 500,
            "temperature": 0.2,
        }

        async with httpx.AsyncClient(timeout=45) as client:
            r = await client.post(
                f"{self.endpoint}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
            return _parse_json_action(text)


# ── FALLBACK: Grok (xAI) ─────────────────────────────────────────────────────

class GrokProvider:
    """xAI Grok-3 via api.x.ai. Key loaded automatically from workspace AGENTS.md."""

    def __init__(self, model: str = "grok-3-latest", api_key: Optional[str] = None):
        self.model = model
        self.endpoint = "https://api.x.ai/v1/chat/completions"
        self.api_key = api_key or _load_grok_key()

    async def decide(self, goal, history, obs: PageObservation, screenshot_b64):
        import httpx
        prompt = _build_prompt(goal, history, obs)

        content: list = [{"type": "text", "text": prompt}]
        if screenshot_b64:
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{screenshot_b64}"},
            })

        async with httpx.AsyncClient(timeout=45) as client:
            r = await client.post(
                self.endpoint,
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": content}],
                    "max_tokens": 500,
                    "temperature": 0.2,
                },
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
            return _parse_json_action(text)


# ── HuggingFace Inference Endpoint ───────────────────────────────────────────

class HFProvider:
    """HuggingFace Inference Endpoint (e.g. Qwen2-VL-7B).
    Requires HF_ENDPOINT_URL + HF_TOKEN env vars."""

    def __init__(self, endpoint_url: Optional[str] = None, token: Optional[str] = None):
        self.endpoint_url = endpoint_url or os.environ.get("HF_ENDPOINT_URL")
        self.token = token or _load_hf_token()

    async def decide(self, goal, history, obs: PageObservation, screenshot_b64):
        import httpx
        prompt = _build_prompt(goal, history, obs)
        payload = {"inputs": prompt, "parameters": {"max_new_tokens": 300}}
        if screenshot_b64:
            payload["image"] = screenshot_b64

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                self.endpoint_url,
                headers={"Authorization": f"Bearer {self.token}"},
                json=payload,
            )
            r.raise_for_status()
            data = r.json()
            text = data[0]["generated_text"] if isinstance(data, list) else data.get("generated_text", "")
            return _parse_json_action(text)


# ── Fully local / offline ─────────────────────────────────────────────────────

class OllamaProvider:
    """Zero API key, zero cost. Requires `ollama serve` + `ollama pull llama3.2-vision`"""

    def __init__(self, model: str = "llama3.2-vision", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host

    async def decide(self, goal, history, obs: PageObservation, screenshot_b64):
        import httpx
        prompt = _build_prompt(goal, history, obs)
        payload = {"model": self.model, "prompt": prompt, "stream": False}
        if screenshot_b64:
            payload["images"] = [screenshot_b64]

        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(f"{self.host}/api/generate", json=payload)
            r.raise_for_status()
            return _parse_json_action(r.json().get("response", ""))


# ── Shared helpers ────────────────────────────────────────────────────────────

def _build_prompt(goal: str, history: list[str], obs: PageObservation) -> str:
    hist = "\n".join(f"- {h}" for h in history[-8:]) or "(none yet)"
    return f"""{ACTION_VOCABULARY}

GOAL: {goal}

CURRENT PAGE: {obs.title} ({obs.url})

VISIBLE INTERACTIVE ELEMENTS:
{obs.dom_text or '(none detected)'}

RECENT ACTIONS TAKEN:
{hist}

Respond with exactly one JSON action for the next step."""


def _parse_json_action(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`").replace("json\n", "", 1)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        return {"action": "fail", "reason": f"Could not parse model output: {text[:200]}"}
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError:
        return {"action": "fail", "reason": f"Invalid JSON from model: {text[:200]}"}


# ── The agent loop ────────────────────────────────────────────────────────────

@dataclass
class AgentResult:
    success: bool
    result: str
    steps_taken: int
    history: list[str]


class VisionAgent:
    def __init__(self, controller: BrowserController, provider: ModelProvider,
                 max_steps: int = 25, use_vision_every_step: bool = False):
        self.controller = controller
        self.provider = provider
        self.max_steps = max_steps
        self.use_vision_every_step = use_vision_every_step

    async def run(self, goal: str, start_url: Optional[str] = None) -> AgentResult:
        history: list[str] = []
        if start_url:
            await self.controller.goto(start_url)
            history.append(f"Navigated to {start_url}")

        for step in range(self.max_steps):
            obs = await self.controller.observe(annotate=True)

            needs_vision = self.use_vision_every_step or len(obs.elements) < 3
            screenshot_b64 = None
            if needs_vision and obs.screenshot_path:
                screenshot_b64 = base64.b64encode(open(obs.screenshot_path, "rb").read()).decode()

            decision = await self.provider.decide(goal, history, obs, screenshot_b64)
            action = decision.get("action")

            if action == "done":
                return AgentResult(True, decision.get("result", ""), step + 1, history)
            if action == "fail":
                return AgentResult(False, decision.get("reason", "unknown failure"), step + 1, history)

            try:
                await self._execute(action, decision)
                history.append(f"{action}: {decision.get('reason', '')}"[:200])
            except Exception as e:
                history.append(f"{action} FAILED: {e}"[:200])

            await self.controller.wait(600)

        return AgentResult(False, "Max steps reached without completion", self.max_steps, history)

    async def _execute(self, action: str, decision: dict):
        c = self.controller
        if action == "click":
            await c.click(decision["element_id"])
        elif action == "type":
            await c.type_text(decision["element_id"], decision["text"])
        elif action == "press_key":
            await c.press_key(decision["key"])
        elif action == "scroll":
            await c.scroll(decision.get("direction", "down"))
        elif action == "goto":
            await c.goto(decision["url"])
        elif action == "wait":
            await c.wait(decision.get("ms", 1000))
        elif action == "extract":
            text = await c.extract_text(decision.get("element_id"))
            decision["_extracted"] = text[:1000]
        else:
            raise ValueError(f"Unknown action: {action}")
