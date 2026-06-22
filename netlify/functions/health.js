// Sacred Cycles API — Health Check (Netlify Function)
// Endpoint: GET https://shop.artistrystore.com/.netlify/functions/health

exports.handler = async function (event) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "ok",
      service: "Sacred Cycles Lead API v2 (Netlify)",
      database: "Supabase PostgreSQL",
      timestamp: new Date().toISOString(),
    }),
  };
};
