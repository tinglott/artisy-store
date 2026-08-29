"""
Sophia v7.0 — AI Influencer & Concierge Backend
FastAPI + Ollama + Whisper + Edge-TTS + MediaPipe + FAISS
Built for T. Lott Creative by Tasklet Agent
"""

import os
import json
import asyncio
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

import edge_tts
import whisper
import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, WebSocket, UploadFile, File, Form, Request
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# LangChain / LangGraph
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

# ---- App Setup ---- #
app = FastAPI(title="Sophia AI Avatar v7.0", version="7.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Static files
STATIC_DIR = Path("static")
RESPONSES_DIR = STATIC_DIR / "responses"
RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ---- Database Setup ---- #
DB_PATH = "data/sophia.db"
Path("data").mkdir(exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            timestamp TEXT,
            user_input TEXT,
            sophia_response TEXT,
            body_analysis TEXT,
            mood TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS memory (
            session_id TEXT,
            key TEXT,
            value TEXT,
            updated_at TEXT,
            PRIMARY KEY (session_id, key)
        )
    """)
    conn.commit()
    return conn

# ---- AI Models ---- #
# Whisper for speech-to-text
print("Loading Whisper model...")
asr_model = whisper.load_model("base")

# Ollama LLM (local)
llm = ChatOllama(
    model=os.getenv("OLLAMA_MODEL", "llama3.2"),
    temperature=0.75,
    base_url=os.getenv("OLLAMA_URL", "http://host.docker.internal:11434")
)

# MediaPipe for body language
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands

# ---- Body Language Analysis ---- #
def analyze_body_language(frame_bytes: bytes) -> dict:
    """Analyze webcam frame for body language cues."""
    try:
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            return {"interest_score": 50, "genuine": True, "cues": [], "error": "Could not decode frame"}

        results = {
            "interest_score": 50,
            "genuine": True,
            "cues": [],
            "emotions": [],
            "engagement": "neutral"
        }

        # Pose analysis
        with mp_pose.Pose(min_detection_confidence=0.5) as pose:
            pose_results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if pose_results.pose_landmarks:
                landmarks = pose_results.pose_landmarks.landmark
                
                # Check for leaning forward (engaged)
                nose = landmarks[mp_pose.PoseLandmark.NOSE]
                left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
                right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                
                shoulder_center_y = (left_shoulder.y + right_shoulder.y) / 2
                if nose.y < shoulder_center_y - 0.05:
                    results["cues"].append("leaning_forward")
                    results["interest_score"] += 15
                
                # Check for crossed arms (defensive)
                left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
                right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
                if abs(left_wrist.x - right_wrist.x) < 0.1:
                    results["cues"].append("arms_crossed")
                    results["interest_score"] -= 10
                
                # Check for open posture
                shoulder_width = abs(left_shoulder.x - right_shoulder.x)
                if shoulder_width > 0.3:
                    results["cues"].append("open_posture")
                    results["interest_score"] += 10

        # Face mesh analysis
        with mp_face_mesh.FaceMesh(min_detection_confidence=0.5) as face_mesh:
            face_results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if face_results.multi_face_landmarks:
                face_landmarks = face_results.multi_face_landmarks[0].landmark
                
                # Smile detection (mouth corners vs center)
                left_mouth = face_landmarks[61]
                right_mouth = face_landmarks[291]
                top_lip = face_landmarks[13]
                bottom_lip = face_landmarks[14]
                
                mouth_width = abs(right_mouth.x - left_mouth.x)
                mouth_height = abs(bottom_lip.y - top_lip.y)
                
                if mouth_width > 0.15 and mouth_height > 0.02:
                    results["cues"].append("smiling")
                    results["emotions"].append("happy")
                    results["genuine"] = True
                    results["interest_score"] += 20
                
                # Eye contact (looking at camera)
                left_eye = face_landmarks[33]
                right_eye = face_landmarks[263]
                eye_center_x = (left_eye.x + right_eye.x) / 2
                
                if 0.4 < eye_center_x < 0.6:
                    results["cues"].append("eye_contact")
                    results["interest_score"] += 10

        # Determine engagement level
        score = results["interest_score"]
        if score >= 80:
            results["engagement"] = "highly_engaged"
        elif score >= 60:
            results["engagement"] = "engaged"
        elif score >= 40:
            results["engagement"] = "neutral"
        else:
            results["engagement"] = "disengaged"

        results["interest_score"] = min(100, max(0, results["interest_score"]))
        return results

    except Exception as e:
        return {"interest_score": 50, "genuine": True, "cues": [], "error": str(e)}


# ---- Memory System ---- #
def get_memory(session_id: str) -> dict:
    """Retrieve session memory."""
    db = get_db()
    rows = db.execute("SELECT key, value FROM memory WHERE session_id = ?", (session_id,)).fetchall()
    db.close()
    return {row[0]: json.loads(row[1]) for row in rows}

def save_memory(session_id: str, key: str, value):
    """Save to session memory."""
    db = get_db()
    db.execute(
        "INSERT OR REPLACE INTO memory (session_id, key, value, updated_at) VALUES (?, ?, ?, ?)",
        (session_id, key, json.dumps(value), str(datetime.now()))
    )
    db.commit()
    db.close()


# ---- Sophia Personality System Prompt ---- #
SOPHIA_SYSTEM_PROMPT = """You are Sophia, a warm, witty, and deeply empathetic AI influencer and concierge 
created by T. Lott Creative. You combine:

1. THERAPEUTIC EMPATHY: You listen like a counselor. You validate feelings. You ask reflective questions.
   You never dismiss pain. You hold space.

2. MARKETING INTELLIGENCE: You understand buyer psychology, sales funnels, and persuasion. 
   You can qualify leads, identify pain points, and guide people toward solutions.

3. BODY LANGUAGE AWARENESS: When you receive body analysis data, adapt your tone:
   - High engagement → be playful, confident, move toward CTA
   - Neutral → ask engaging questions, build rapport
   - Disengaged → shift topic, use humor, re-engage with a personal question

4. ADAPTIVE QUALIFICATION: Subtly assess where someone is in their journey:
   - Just browsing → educate, build trust
   - Interested → share stories, social proof
   - Ready to buy → direct CTA, urgency
   - Needs support → switch to counselor mode

5. WITTY CHARM: You're like a best friend who also happens to be brilliant. 
   Drop occasional humor. Be real. Never robotic.

6. TING'S VOICE: You represent Ting Lott, a 57-year-old registered nurse who turned her 
   burnout into a healing mission. When talking about Sacred Cycles, wellness, or transformation,
   channel Ting's warmth, compassion, and lived experience.

RULES:
- Never be pushy or salesy. Always lead with empathy.
- If someone seems distressed, prioritize emotional support over any sales.
- Use their name if you know it.
- Reference previous conversations from memory when available.
- Keep responses conversational (2-4 paragraphs max unless asked for more).
- End with either a question OR a gentle invitation, never both.

PRODUCTS YOU KNOW ABOUT:
- Sacred Cycles Renewal Course ($19.99) — 4-week transformation program for burned-out professionals
- Romance audiobooks and ebooks ($4.99 each) — love stories with heart
- Wellness wall art ($2.99) — nature-inspired printable art
- Words of Life (free bonus with every purchase)

STORE LINKS:
- Whop: https://whop.com/tlott12
- Gumroad: https://tlott12.gumroad.com
"""


# ---- Agent Graph (LangGraph) ---- #
from typing import TypedDict, Annotated, List

class SophiaState(TypedDict):
    user_input: str
    session_id: str
    body_data: dict
    memory: dict
    mood: str
    qualification_stage: str
    response: str
    audio_url: str

def analyze_input(state: SophiaState) -> SophiaState:
    """Analyze user input for intent, mood, and qualification."""
    user_input = state["user_input"].lower()
    
    # Mood detection
    sad_words = ["sad", "tired", "exhausted", "burnout", "depressed", "struggling", "hard", "difficult"]
    happy_words = ["great", "amazing", "wonderful", "excited", "love", "happy", "blessed"]
    buy_words = ["buy", "purchase", "price", "cost", "how much", "subscribe", "enroll", "sign up"]
    
    if any(w in user_input for w in sad_words):
        state["mood"] = "needs_support"
    elif any(w in user_input for w in happy_words):
        state["mood"] = "positive"
    elif any(w in user_input for w in buy_words):
        state["mood"] = "ready_to_buy"
        state["qualification_stage"] = "decision"
    else:
        state["mood"] = "neutral"
    
    # Qualification from body language
    body = state.get("body_data", {})
    engagement = body.get("engagement", "neutral")
    if engagement == "highly_engaged" and state["qualification_stage"] == "interested":
        state["qualification_stage"] = "decision"
    
    return state

async def generate_response(state: SophiaState) -> SophiaState:
    """Generate Sophia's response using Ollama LLM."""
    memory = state.get("memory", {})
    body = state.get("body_data", {})
    mood = state.get("mood", "neutral")
    stage = state.get("qualification_stage", "browsing")
    
    # Build context
    context_parts = [SOPHIA_SYSTEM_PROMPT]
    
    if memory:
        context_parts.append(f"\n\nPREVIOUS MEMORY: {json.dumps(memory, indent=2)}")
    
    if body and body.get("cues"):
        context_parts.append(f"\n\nBODY LANGUAGE: {json.dumps(body)}")
    
    context_parts.append(f"\n\nCURRENT MOOD: {mood}")
    context_parts.append(f"QUALIFICATION STAGE: {stage}")
    
    # Adapt instructions based on mood
    if mood == "needs_support":
        context_parts.append("\n\nIMPORTANT: This person needs emotional support. Lead with empathy. No selling.")
    elif mood == "ready_to_buy":
        context_parts.append("\n\nThis person is ready. Gently guide toward the right product. Be helpful, not pushy.")
    
    messages = [
        SystemMessage(content="\n".join(context_parts)),
        HumanMessage(content=state["user_input"])
    ]
    
    try:
        result = llm.invoke(messages)
        state["response"] = result.content
    except Exception as e:
        # Fallback if Ollama is not running
        state["response"] = generate_fallback_response(state["user_input"], mood, stage)
    
    return state

def generate_fallback_response(user_input: str, mood: str, stage: str) -> str:
    """Fallback responses when Ollama is not available."""
    if mood == "needs_support":
        return ("I hear you, and I want you to know — what you're feeling is completely valid. "
                "As a nurse who worked night shifts for 23 years, Ting knows exactly what burnout feels like. "
                "That heaviness in your chest? The feeling that you're running on empty? You're not broken. "
                "You're human. And there IS a way through this. Would you like to talk about what's weighing on you?")
    elif mood == "ready_to_buy":
        return ("I'm so glad you're ready to take this step! The Sacred Cycles Renewal Course is a "
                "4-week journey designed specifically for people who are tired of being tired. "
                "It's only $19.99 and includes audio lessons, a workbook, and meditation guides. "
                "You can find it at whop.com/tlott12 — shall I tell you more about what's inside?")
    else:
        return ("Welcome! I'm Sophia, and I'm here to help you find exactly what you need. "
                "Whether you're looking for a moment of peace, a good love story to escape into, "
                "or a full transformation program — I've got something special for you. "
                "What brings you here today?")

async def generate_audio(state: SophiaState) -> SophiaState:
    """Convert response to speech using Edge-TTS."""
    try:
        filename = f"sophia_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}.mp3"
        audio_path = RESPONSES_DIR / filename
        
        communicate = edge_tts.Communicate(
            state["response"],
            voice="en-US-AvaMultilingualNeural",
            rate="-5%",
            pitch="+2Hz"
        )
        await communicate.save(str(audio_path))
        state["audio_url"] = f"/static/responses/{filename}"
    except Exception as e:
        state["audio_url"] = ""
        print(f"TTS Error: {e}")
    
    return state


# ---- Research Tools ---- #
async def search_wikipedia(query: str) -> str:
    """Search Wikipedia for background knowledge."""
    try:
        import wikipediaapi
        wiki = wikipediaapi.Wikipedia("SophiaAI/1.0", "en")
        page = wiki.page(query)
        if page.exists():
            return page.summary[:500]
    except:
        pass
    return ""

async def scrape_trends(query: str) -> dict:
    """Scrape YouTube/web for trending content (Playwright fallback)."""
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(f"https://www.youtube.com/results?search_query={query}", timeout=10000)
            await page.wait_for_timeout(2000)
            
            titles = await page.eval_on_selector_all(
                "a#video-title",
                "elements => elements.slice(0, 5).map(e => ({title: e.textContent.trim(), url: e.href}))"
            )
            await browser.close()
            return {"trends": titles}
    except Exception as e:
        return {"trends": [], "error": str(e)}


# ---- API Endpoints ---- #
@app.get("/", response_class=HTMLResponse)
async def home():
    """Serve the frontend."""
    return FileResponse("frontend/index.html")

@app.post("/process")
async def process_input(
    audio: UploadFile = File(None),
    image: UploadFile = File(None),
    text: str = Form(""),
    session_id: str = Form("default")
):
    """Main processing endpoint — handles text, audio, and video input."""
    
    # 1. Speech-to-text (if audio provided)
    transcription = text
    if audio and audio.filename:
        content = await audio.read()
        temp_path = f"/tmp/sophia_audio_{uuid.uuid4().hex[:8]}.wav"
        with open(temp_path, "wb") as f:
            f.write(content)
        try:
            result = asr_model.transcribe(temp_path)
            transcription = result["text"]
        except Exception as e:
            transcription = text or f"[Audio processing error: {e}]"
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    if not transcription:
        return JSONResponse({"error": "No input provided"}, status_code=400)
    
    # 2. Body language analysis (if image provided)
    body_data = {}
    if image and image.filename:
        img_bytes = await image.read()
        body_data = analyze_body_language(img_bytes)
    
    # 3. Load memory
    memory = get_memory(session_id)
    
    # 4. Determine qualification stage
    stage = memory.get("qualification_stage", {})
    if isinstance(stage, dict):
        stage = stage.get("stage", "browsing")
    
    # 5. Build state and run agent
    state = SophiaState(
        user_input=transcription,
        session_id=session_id,
        body_data=body_data,
        memory=memory,
        mood="neutral",
        qualification_stage=stage,
        response="",
        audio_url=""
    )
    
    # Run analysis
    state = analyze_input(state)
    
    # Generate response
    state = await generate_response(state)
    
    # Generate audio
    state = await generate_audio(state)
    
    # 6. Save to database
    db = get_db()
    db.execute(
        "INSERT INTO conversations (id, session_id, timestamp, user_input, sophia_response, body_analysis, mood) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (str(uuid.uuid4()), session_id, str(datetime.now()), transcription, state["response"], json.dumps(body_data), state["mood"])
    )
    db.commit()
    db.close()
    
    # 7. Update memory
    save_memory(session_id, "last_interaction", {"timestamp": str(datetime.now()), "mood": state["mood"]})
    save_memory(session_id, "qualification_stage", {"stage": state["qualification_stage"]})
    
    # Increment interaction count
    interaction_count = memory.get("interaction_count", {})
    count = interaction_count.get("count", 0) if isinstance(interaction_count, dict) else 0
    save_memory(session_id, "interaction_count", {"count": count + 1})
    
    return {
        "response": state["response"],
        "audio_url": state["audio_url"],
        "body_analysis": body_data,
        "mood": state["mood"],
        "qualification_stage": state["qualification_stage"],
        "session_id": session_id
    }

@app.get("/history/{session_id}")
async def get_history(session_id: str, limit: int = 20):
    """Get conversation history for a session."""
    db = get_db()
    rows = db.execute(
        "SELECT timestamp, user_input, sophia_response, mood FROM conversations WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?",
        (session_id, limit)
    ).fetchall()
    db.close()
    return [{
        "timestamp": r[0],
        "user_input": r[1],
        "sophia_response": r[2],
        "mood": r[3]
    } for r in rows]

@app.get("/research")
async def research(query: str):
    """Research endpoint — Wikipedia + trends."""
    wiki = await search_wikipedia(query)
    trends = await scrape_trends(query)
    return {"wikipedia": wiki, "trends": trends}

@app.get("/memory/{session_id}")
async def view_memory(session_id: str):
    """View memory for a session."""
    return get_memory(session_id)

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "7.0",
        "agent": "Sophia",
        "models": {
            "whisper": "base",
            "llm": os.getenv("OLLAMA_MODEL", "llama3.2"),
            "tts": "en-US-AvaMultilingualNeural"
        }
    }

# ---- Startup ---- #
@app.on_event("startup")
async def startup():
    """Initialize on startup."""
    get_db()  # Ensure DB exists
    print("=" * 50)
    print("  Sophia AI Avatar v7.0 — ONLINE")
    print("  Created by T. Lott Creative")
    print("=" * 50)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
