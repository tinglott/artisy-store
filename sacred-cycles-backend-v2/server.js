/**
 * Sacred Cycles Renewal — Lead Capture API v2
 * =============================================
 * Backend for Sacred Cycles email capture landing page.
 *
 * UPGRADE v2: SQLite → Supabase PostgreSQL
 *   - No more local file dependencies
 *   - Works on any serverless platform (Vercel, Netlify, etc.)
 *   - Rate limiting, CORS, helmet security
 *   - Email welcome via Emailit API
 *
 * Endpoints:
 *   GET  /api/health      — Health check
 *   POST /api/subscribe   — Capture email lead
 *   POST /api/unsubscribe — Remove lead
 *   GET  /api/leads       — Admin: list leads (requires x-admin-key)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Supabase config ────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || "https://lltlbjmurwhnotjegjrz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const ADMIN_KEY    = process.env.ADMIN_API_KEY;
const EMAILIT_KEY  = process.env.EMAILIT_API_KEY;

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
}));

app.use("/api/subscribe", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Please try again in a few minutes." },
}));

// ── Supabase helper ────────────────────────────────────────────────────────
async function sbRequest(method, endpoint, body = null, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? `?${params}` : ""}`;
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();
  return {
    status: res.status,
    body: text ? JSON.parse(text) : {},
  };
}

// ── Email helper (Emailit) ─────────────────────────────────────────────────
async function sendWelcomeEmail(email) {
  if (!EMAILIT_KEY) {
    console.log(`[mailer] No Emailit key — skipping welcome email to ${email}`);
    return;
  }
  try {
    const res = await fetch("https://api.emailit.com/v1/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${EMAILIT_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ting Lott <no-reply@artistrystore.com>",
        to: email,
        subject: "You're in — Sacred Cycles Renewal 🌙",
        html: `
          <h2>Welcome to Sacred Cycles Renewal</h2>
          <p>Thank you for joining! You're officially on the list.</p>
          <p>Your Sacred Cycles Renewal Workbook details and first steps will follow shortly.</p>
          <p>In the meantime, explore more at <a href="https://shop.artistrystore.com/store.html">shop.artistrystore.com</a>.</p>
          <p>With love,<br/>Ting Lott, RN</p>
        `,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[mailer] Emailit error: ${err}`);
    }
  } catch (err) {
    console.error(`[mailer] Failed: ${err.message}`);
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Sacred Cycles Lead API v2",
    database: "Supabase PostgreSQL",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/subscribe", async (req, res) => {
  const { email, placement } = req.body || {};

  if (!email || typeof email !== "string" || !validator.isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if already exists
    const existing = await sbRequest(
      "GET", "sacred_cycles_leads",
      null, `email=eq.${encodeURIComponent(normalizedEmail)}&select=id,unsubscribed`
    );

    if (existing.status === 200 && existing.body.length > 0) {
      const row = existing.body[0];
      if (row.unsubscribed) {
        // Re-subscribe
        await sbRequest("PATCH", "sacred_cycles_leads",
          { unsubscribed: false },
          `id=eq.${row.id}`
        );
        return res.json({ ok: true, message: "Welcome back — you're resubscribed." });
      }
      return res.json({ ok: true, message: "You're already on the list." });
    }

    // Insert new lead
    const insert = await sbRequest("POST", "sacred_cycles_leads", {
      email: normalizedEmail,
      source: "landing_page",
      placement: placement || null,
    });

    if (insert.status !== 201) {
      console.error("[subscribe] Insert failed:", insert);
      return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
    }

    // Fire welcome email (non-blocking)
    sendWelcomeEmail(normalizedEmail).catch(() => {});

    return res.status(201).json({ ok: true, message: "You're on the list." });

  } catch (err) {
    console.error("[subscribe] Error:", err.message);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

app.post("/api/unsubscribe", async (req, res) => {
  const { email } = req.body || {};
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  }
  const normalizedEmail = email.trim().toLowerCase();

  const result = await sbRequest("PATCH", "sacred_cycles_leads",
    { unsubscribed: true },
    `email=eq.${encodeURIComponent(normalizedEmail)}`
  );

  if (result.status === 200 && result.body.length === 0) {
    return res.status(404).json({ ok: false, error: "Email not found." });
  }
  return res.json({ ok: true, message: "You've been unsubscribed." });
});

app.get("/api/leads", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize, 10) || 50));
  const offset = (page - 1) * pageSize;

  const [rows, countResult] = await Promise.all([
    sbRequest("GET", "sacred_cycles_leads", null,
      `select=id,email,source,placement,created_at,confirmed,unsubscribed&order=created_at.desc&limit=${pageSize}&offset=${offset}`
    ),
    sbRequest("GET", "sacred_cycles_leads", null, "select=count"),
  ]);

  const total = countResult.body?.[0]?.count ?? 0;
  return res.json({ ok: true, page, pageSize, total, leads: rows.body });
});

// ── 404 + error handling ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ ok: false, error: "Not found." }));

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ ok: false, error: "Origin not allowed." });
  }
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ ok: false, error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`✅ Sacred Cycles API v2 running on port ${PORT}`);
  console.log(`   Database: Supabase (${SUPABASE_URL})`);
});
