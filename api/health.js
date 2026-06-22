// Sacred Cycles API — Health Check
// Deployed as Vercel Serverless Function
// GET /api/health

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    status: "ok",
    service: "Sacred Cycles Lead API v2",
    database: "Supabase PostgreSQL",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || "unknown",
  });
};
