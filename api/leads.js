// Sacred Cycles API — Admin Leads View
// Deployed as Vercel Serverless Function
// GET /api/leads  (requires x-admin-key header)

const SUPABASE_URL = "https://lltlbjmurwhnotjegjrz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdGxiam11cndobm90amVnanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTA0MTEsImV4cCI6MjA5MDQyNjQxMX0.0GTC6Wf6hdyrWt68NuAJ4EclKZsfji1Fm0getKPo7As";

async function sbRequest(method, endpoint, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}${params ? `?${params}` : ""}`;
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
  const res = await fetch(url, { method, headers });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : {} };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const adminKey = req.headers["x-admin-key"];
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return res.status(401).json({ ok: false, error: "Unauthorized." });
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize, 10) || 50));
  const offset = (page - 1) * pageSize;

  try {
    const [rows, countResult] = await Promise.all([
      sbRequest("GET", "sacred_cycles_leads",
        `select=id,email,source,placement,created_at,confirmed,unsubscribed&order=created_at.desc&limit=${pageSize}&offset=${offset}`),
      sbRequest("GET", "sacred_cycles_leads", "select=count"),
    ]);

    const total = countResult.body?.[0]?.count ?? 0;
    return res.json({ ok: true, page, pageSize, total, leads: rows.body });
  } catch (err) {
    console.error("[leads] Error:", err.message);
    return res.status(500).json({ ok: false, error: "Internal server error." });
  }
};
