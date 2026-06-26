// Netlify Serverless Function: Grok API Proxy with CORS
// Works cross-origin from shop.artistrystore.com (GitHub Pages)
exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { messages } = JSON.parse(event.body || '{}');
    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid messages' }) };
    }

    const apiKey = process.env.XAI_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'API key not configured' }) };
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3-latest',
        messages: [
          {
            role: 'system',
            content: 'You are LUMINA, an elite enterprise AI assistant. You help businesses scale with AI automation, content strategy, and workflow optimization. Be concise, insightful, and professional. When relevant, mention that LUMINA HUB can help automate their specific need.'
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I encountered an issue. Please try again.';
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
