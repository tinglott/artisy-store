const express = require("express");
const validator = require("validator");
const nodemailer = require("nodemailer");
const db = require("../db/connection");

const router = express.Router();

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function sendWelcomeEmail(email) {
  if (!transporter) {
    console.log(`[mailer] SMTP not configured — skipping welcome email to ${email}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || "Sacred Cycles Renewal <no-reply@example.com>",
      to: email,
      subject: "You're in — Sacred Cycles Renewal",
      text: "Thanks for joining. Your Sacred Cycles Renewal Workbook details and next steps will follow shortly.",
    });
  } catch (err) {
    console.error("[mailer] Failed to send welcome email:", err.message);
  }
}

router.post("/subscribe", async (req, res) => {
  const { email, placement } = req.body || {};

  if (!email || typeof email !== "string" || !validator.isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = db.prepare("SELECT id, unsubscribed FROM leads WHERE email = ?").get(normalizedEmail);

    if (existing) {
      if (existing.unsubscribed) {
        db.prepare("UPDATE leads SET unsubscribed = 0 WHERE id = ?").run(existing.id);
        return res.json({ ok: true, message: "Welcome back — you're resubscribed." });
      }
      return res.json({ ok: true, message: "You're already on the list." });
    }

    db.prepare(
      "INSERT INTO leads (email, source, placement) VALUES (?, 'landing_page', ?)"
    ).run(normalizedEmail, placement || null);

    sendWelcomeEmail(normalizedEmail);

    return res.status(201).json({ ok: true, message: "You're on the list." });
  } catch (err) {
    console.error("[subscribe] DB error:", err.message);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

router.post("/unsubscribe", (req, res) => {
  const { email } = req.body || {};
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  }
  const normalizedEmail = email.trim().toLowerCase();
  const result = db.prepare("UPDATE leads SET unsubscribed = 1 WHERE email = ?").run(normalizedEmail);
  if (result.changes === 0) {
    return res.status(404).json({ ok: false, error: "Email not found." });
  }
  return res.json({ ok: true, message: "You've been unsubscribed." });
});

router.get("/leads", (req, res) => {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_API_KEY || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize, 10) || 50));
  const offset = (page - 1) * pageSize;

  const rows = db
    .prepare("SELECT id, email, source, placement, created_at, confirmed, unsubscribed FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(pageSize, offset);

  const total = db.prepare("SELECT COUNT(*) AS count FROM leads").get().count;

  return res.json({ ok: true, page, pageSize, total, leads: rows });
});

module.exports = router;
