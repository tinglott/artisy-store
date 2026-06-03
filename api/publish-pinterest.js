// Vercel Serverless Function — Pinterest v5 pin publishing
const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { title, description, link, boardId, imageUrl, accessToken } = req.body;
  
  if (!accessToken) return res.status(400).json({ success: false, error: 'Pinterest access token required' });
  if (!boardId) return res.status(400).json({ success: false, error: 'Board ID required' });
  if (!imageUrl) return res.status(400).json({ success: false, error: 'Image URL required' });

  try {
    const axios_module = require('axios');
    const payload = {
      board_id: boardId,
      title: (title || '').slice(0, 100),
      description: (description || '').slice(0, 500),
      link: link || 'https://whop.com/tlott12',
      media_source: { source_type: 'image_url', url: imageUrl }
    };

    const r = await axios_module.post('https://api.pinterest.com/v5/pins', payload, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json' 
      }
    });

    res.json({ 
      success: true, 
      pinId: r.data.id, 
      url: `https://pinterest.com/pin/${r.data.id}`,
      data: r.data
    });
  } catch (e) {
    const errMsg = e.response?.data?.message || e.message;
    res.status(400).json({ success: false, error: errMsg });
  }
};
