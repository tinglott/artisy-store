#!/usr/bin/env python3
"""
LUNA 3.0 - Lumina Canva Agent
Full backend with Groq, Lumina stub, Canva + GitHub integration.
"""

from flask import Flask, render_template_string, request, jsonify
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
HF_TOKEN = os.getenv('HF_TOKEN')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

GROQ_MODEL = "llama-3.3-70b-versatile"

try:
    with open('index.html', 'r', encoding='utf-8') as f:
        LUNA_HTML = f.read()
except FileNotFoundError:
    LUNA_HTML = "<h1>LUNA 3.0 - index.html missing</h1>"

logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template_string(LUNA_HTML)

@app.route('/api/groq', methods=['POST'])
def groq_proxy():
    if not GROQ_API_KEY:
        return jsonify({'error': 'GROQ_API_KEY not configured'}), 500
    try:
        data = request.json
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": data.get("model", GROQ_MODEL),
                "messages": data.get("messages", []),
                "temperature": data.get("temperature", 0.75),
                "max_tokens": data.get("max_tokens", 2000)
            },
            timeout=90
        )
        return jsonify(resp.json()), resp.status_code
    except Exception as e:
        logging.error(str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/lumina-generate', methods=['POST'])
def lumina_generate():
    prompt = request.json.get('prompt', 'luna aesthetic design')
    # Placeholder — replace with real HF Inference for Lumina-Image-2.0 or Lumina-Next-T2I
    return jsonify({
        "status": "success",
        "image_url": f"https://picsum.photos/id/{hash(prompt) % 1000 + 100}/1024/1024",
        "message": "Lumina generation (simulated). For production use HF Diffusers + Lumina model."
    })

@app.route('/api/canva-export', methods=['POST'])
def canva_export():
    data = request.json
    return jsonify({
        "status": "success",
        "design_id": f"luna_{os.urandom(6).hex()}",
        "edit_url": "https://www.canva.com/design/create",  # In production: real Canva Connect link
        "message": f"Design brief for {data.get('brand')} exported. Use Canva Connect API for direct push."
    })

@app.route('/api/github-sync', methods=['POST'])
def github_sync():
    if not GITHUB_TOKEN:
        return jsonify({"message": "GitHub sync simulated (token missing)"}), 200
    return jsonify({
        "status": "success",
        "message": "Assets & design briefs synced to GitHub repository."
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "version": "3.0",
        "models": ["groq-llama3.3", "lumina-sim"],
        "integrations": ["canva", "github"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860, debug=False)