// Sacred Cycles API — Email Subscribe
// Deployed as Vercel Serverless Function
// POST /api/subscribe

const SUPABASE_URL = "https://lltlbjmurwhnotjegjrz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdGxiam11cndobm90amVnanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTA0MTEsImV4cCI6MjA5MDQyNjQxMX0.0GTC6Wf6hdyrWt68NuAJ4EclKZsfji1Fm0getKPo7As";

const ALLOWED_ORIGINS = [
  "https://shop.artistrystore.com",
  "https://tlott12.gumroad.com",
  "https://artisy-store.netlify.app",
  "https://artisy-store-v2.netlify.app",
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

async function sbRequest(method, endpoint, body = null, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? `?${params}` : ""}`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : {} };
}

async function sendWelcomeEmail(email) {
  const key = process.env.EMAILIT_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.emailit.com/v1/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ting Lott <no-reply@artistrystore.com>",
        to: email,
        subject: "You're in — Sacred Cycles Renewal 🌙",
        html: `
          <h2 style="color:#7c3aed">Welcome to Sacred Cycles Renewal</h2>
          <p>Thank you for joining! You're officially on the list.</p>
          <p>Your Sacred Cycles Renewal Workbook details and next steps will follow shortly.</p>
          <p>Explore more wellness tools at <a href="https://shop.artistrystore.com/store.html">shop.artistrystore.com</a>.</p>
          <p>With love,<br/>Ting Lott, RN</p>
        `,
      }),
    });
  } catch (err) {
    console.error("[mailer]", err.message);
  }
}

module.exports = async function handler(req, res) {
  // CORS
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, placement } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check existing
    const existing = await sbRequest(
      "GET", "sacred_cycles_leads", null,
      `email=eq.${encodeURIComponent(normalizedEmail)}&select=id,unsubscribed`
    );

    if (existing.status === 200 && existing.body.length > 0) {
      const row = existing.body[0];
      if (row.unsubscribed) {
        await sbRequest("PATCH", "sacred_cycles_leads",
          { unsubscribed: false }, `id=eq.${row.id}`);
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
      console.error("[subscribe] Insert failed:", insert.status, insert.body);
      return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
    }

    // Fire welcome email (non-blocking)
    sendWelcomeEmail(normalizedEmail).catch(() => {});

    return res.status(201).json({ ok: true, message: "You're on the list." });

  } catch (err) {
    console.error("[subscribe] Error:", err.message);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
};
