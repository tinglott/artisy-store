// Vercel Serverless Function: /api/luna-chat.js
// Handles Luna chat requests securely with HuggingFace API key stored server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        headers: { Authorization: `Bearer ${HF_API_KEY}` },
        method: 'POST',
        body: JSON.stringify({
          inputs: `Luna is a warm, caring wellness guide for TLott12 Digital Products. Keep responses under 150 words. User: ${message}\n\nLuna:`,
          parameters: { max_new_tokens: 150 }
        })
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ 
        reply: "Luna is thinking... Please try again in a moment!" 
      });
    }

    const aiText = result[0]?.generated_text?.split('Luna:')[1]?.trim() 
      || "I'm here to help with wellness, productivity, and living your best life! What would you like to know?";

    return res.status(200).json({ 
      reply: aiText.substring(0, 300).trim() 
    });
  } catch (error) {
    console.error('Luna API error:', error);
    return res.status(500).json({ 
      reply: "I'm having trouble connecting right now. Please try again shortly!" 
    });
  }
}
