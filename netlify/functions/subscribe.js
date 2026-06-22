// Sacred Cycles — Email Capture (Netlify Function)
// Endpoint: POST https://shop.artistrystore.com/.netlify/functions/subscribe
// OR with redirect: POST https://shop.artistrystore.com/api/subscribe

const SUPABASE_URL = "https://lltlbjmurwhnotjegjrz.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdGxiam11cndobm90amVnanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTA0MTEsImV4cCI6MjA5MDQyNjQxMX0.0GTC6Wf6hdyrWt68NuAJ4EclKZsfji1Fm0getKPo7As";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());
}

async function sbRequest(method, endpoint, body, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? `?${params}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: false, error: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: false, error: "Invalid JSON body" }),
    };
  }

  const { email, placement } = body;

  if (!email || !isValidEmail(email)) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: false, error: "Please provide a valid email address." }),
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if already subscribed
  const existing = await sbRequest(
    "GET", "sacred_cycles_leads", null,
    `email=eq.${encodeURIComponent(normalizedEmail)}&select=id,unsubscribed`
  );

  if (existing.status === 200 && existing.body.length > 0) {
    const row = existing.body[0];
    if (row.unsubscribed) {
      await sbRequest("PATCH", "sacred_cycles_leads",
        { unsubscribed: false }, `id=eq.${row.id}`);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ ok: true, message: "Welcome back — you're resubscribed." }),
      };
    }
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, message: "You're already on the list!" }),
    };
  }

  // Insert new lead
  const insert = await sbRequest("POST", "sacred_cycles_leads", {
    email: normalizedEmail,
    source: "landing_page",
    placement: placement || null,
  });

  if (insert.status !== 201) {
    console.error("Insert failed:", insert.status, insert.body);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: false, error: "Something went wrong. Please try again." }),
    };
  }

  return {
    statusCode: 201,
    headers: CORS_HEADERS,
    body: JSON.stringify({ ok: true, message: "You're on the list! 🌙" }),
  };
};
