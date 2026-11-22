#!/usr/bin/env python3
"""
Free open-source AI Email Auto-Responder
Uses IMAP/SMTP + Hugging Face (Inference API or local transformers)

Inspired by open-source projects on GitHub and Hugging Face models.
"""

import os
import time
import imaplib
import smtplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import decode_header
from email.utils import parseaddr
from datetime import datetime
import json
from pathlib import Path

from dotenv import load_dotenv
import requests

load_dotenv()

# ────────────────────────────────────────────────
# Configuration
# ────────────────────────────────────────────────
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
IMAP_SERVER = os.getenv("IMAP_SERVER", "imap.gmail.com")
IMAP_PORT = int(os.getenv("IMAP_PORT", 993))
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "google/flan-t5-large")
USE_LOCAL = os.getenv("USE_LOCAL", "false").lower() == "true"

# Safety settings
POLL_INTERVAL = 60          # seconds
MAX_REPLY_LENGTH = 400
SEND_REPLIES = False        # True = actually send, False = only create drafts / print
BLACKLIST = ["noreply@", "no-reply@", "mailer-daemon@", "newsletter@"]
PROCESSED_FILE = Path("processed_emails.json")

# ────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────
def load_processed():
    if PROCESSED_FILE.exists():
        with open(PROCESSED_FILE) as f:
            return set(json.load(f))
    return set()

def save_processed(processed):
    with open(PROCESSED_FILE, "w") as f:
        json.dump(list(processed), f)

def decode_str(s):
    if not s:
        return ""
    decoded, charset = decode_header(s)[0]
    if isinstance(decoded, bytes):
        return decoded.decode(charset or "utf-8", errors="ignore")
    return str(decoded)

def get_body(msg):
    """Extract plain-text body from email message."""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            if content_type == "text/plain" and "attachment" not in content_disposition:
                try:
                    return part.get_payload(decode=True).decode(errors="ignore")
                except Exception:
                    pass
    else:
        try:
            return msg.get_payload(decode=True).decode(errors="ignore")
        except Exception:
            pass
    return ""

# ────────────────────────────────────────────────
# Hugging Face reply generation
# ────────────────────────────────────────────────
def generate_reply_hf_api(subject: str, body: str, sender: str) -> str:
    """Free Hugging Face Inference API (serverless)."""
    prompt = f"""You are a helpful professional email assistant.
Write a concise, polite, and useful reply to the following email.
Do not invent facts. Keep the reply under 150 words.
Output ONLY the reply body (no subject, no signature).

From: {sender}
Subject: {subject}

Email:
{body[:2000]}

Reply:"""

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": MAX_REPLY_LENGTH,
            "temperature": 0.6,
            "return_full_text": False,
        },
    }

    url = f"https://router.huggingface.co/hf-inference/models/{HF_MODEL}"
    response = requests.post(url, headers=headers, json=payload, timeout=60)

    if response.status_code != 200:
        print(f"HF API error {response.status_code}: {response.text}")
        return "Thank you for your email. I will get back to you soon."

    result = response.json()
    if isinstance(result, list) and result:
        text = result[0].get("generated_text", "").strip()
    else:
        text = str(result).strip()

    # Clean up common artifacts
    text = text.replace(prompt, "").strip()
    if "Reply:" in text:
        text = text.split("Reply:")[-1].strip()
    return text[:MAX_REPLY_LENGTH] or "Thank you for your email. I will get back to you soon."

def generate_reply_local(subject: str, body: str, sender: str) -> str:
    """Fully local inference with transformers (requires GPU or patience)."""
    from transformers import pipeline

    generator = pipeline(
        "text-generation",
        model=HF_MODEL,
        token=HF_TOKEN,
        device_map="auto",
    )
    prompt = f"""Write a short professional reply to this email.

Subject: {subject}
From: {sender}
Body: {body[:1500]}

Reply:"""
    out = generator(
        prompt,
        max_new_tokens=MAX_REPLY_LENGTH,
        temperature=0.6,
        do_sample=True,
        return_full_text=False,
    )
    return out[0]["generated_text"].strip()

def generate_reply(subject, body, sender):
    if USE_LOCAL:
        return generate_reply_local(subject, body, sender)
    return generate_reply_hf_api(subject, body, sender)

# ────────────────────────────────────────────────
# Email actions
# ────────────────────────────────────────────────
def send_reply(to_addr, subject, body, original_msg_id=None):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_addr
    msg["Subject"] = f"Re: {subject}" if not subject.lower().startswith("re:") else subject
    if original_msg_id:
        msg["In-Reply-To"] = original_msg_id
        msg["References"] = original_msg_id

    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
    print(f"→ Sent reply to {to_addr}")

def create_draft(to_addr, subject, body):
    """Simple local draft (or you can use Gmail API for real drafts)."""
    draft_dir = Path("drafts")
    draft_dir.mkdir(exist_ok=True)
    filename = draft_dir / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{to_addr.replace('@', '_at_')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"To: {to_addr}\nSubject: Re: {subject}\n\n{body}")
    print(f"→ Draft saved: {filename}")

# ────────────────────────────────────────────────
# Main loop
# ────────────────────────────────────────────────
def process_inbox():
    processed = load_processed()
    print(f"[{datetime.now()}] Checking inbox…")

    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        mail.select("INBOX")

        # Search for unread emails
        status, messages = mail.search(None, "UNSEEN")
        if status != "OK":
            return

        email_ids = messages[0].split()
        print(f"Found {len(email_ids)} unread email(s)")

        for eid in email_ids:
            eid_str = eid.decode()
            if eid_str in processed:
                continue

            status, data = mail.fetch(eid, "(RFC822)")
            if status != "OK":
                continue

            raw = data[0][1]
            msg = email.message_from_bytes(raw)

            # Basic filters
            from_header = msg.get("From", "")
            sender_name, sender_email = parseaddr(from_header)
            sender_email = sender_email.lower()

            if any(b in sender_email for b in BLACKLIST):
                print(f"Skipping blacklisted: {sender_email}")
                processed.add(eid_str)
                continue

            subject = decode_str(msg.get("Subject", ""))
            body = get_body(msg)
            msg_id = msg.get("Message-ID")

            print(f"\nProcessing: {subject} from {sender_email}")

            # Generate AI reply
            reply_text = generate_reply(subject, body, sender_email)
            print(f"Generated reply:\n{reply_text}\n")

            if SEND_REPLIES:
                send_reply(sender_email, subject, reply_text, msg_id)
            else:
                create_draft(sender_email, subject, reply_text)

            # Mark as processed (and optionally mark as read/seen)
            processed.add(eid_str)
            # mail.store(eid, "+FLAGS", "\\Seen")  # uncomment to mark as read

        save_processed(processed)
        mail.logout()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("Starting free AI Email Auto-Responder…")
    print(f"Model: {HF_MODEL} | Local: {USE_LOCAL} | Send: {SEND_REPLIES}")
    print("Press Ctrl+C to stop.\n")

    while True:
        process_inbox()
        time.sleep(POLL_INTERVAL)
