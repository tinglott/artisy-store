// Netlify Serverless Function: Grok API Proxy
// xAI key is stored as Netlify env var XAI_KEY — never in code

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };

  const apiKey = process.env.XAI_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "AI service not configured" }) };

  try {
    const { messages, systemPrompt } = JSON.parse(event.body || "{}");

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-latest",
        messages: [
          {
            role: "system",
            content:
              systemPrompt ||
              "You are LUMINA, an elite enterprise AI assistant. Help businesses automate, scale, and create. Be concise, professional, and insightful. Keep answers under 150 words unless asked for more.",
          },
          ...(Array.isArray(messages) ? messages : [{ role: "user", content: "Hello" }]),
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "LUMINA is thinking…";

    return { statusCode: 200, headers, body: JSON.stringify({ reply, model: "grok-3-latest" }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
