const { createCanvas } = require('canvas');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { product_name, price, category, description } = req.body || {};

    if (!product_name) {
      return res.status(400).json({ error: 'product_name is required' });
    }

    // Canvas dimensions — Facebook/Instagram ad format
    const WIDTH = 800;
    const HEIGHT = 600;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // ─── BACKGROUND ───────────────────────────────────────────────
    // Dark gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(0.5, '#16213e');
    bgGradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Subtle star dots
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * WIDTH;
      const y = Math.random() * HEIGHT;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ─── TOP URGENCY BANNER ───────────────────────────────────────
    const bannerGradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
    bannerGradient.addColorStop(0, '#e63946');
    bannerGradient.addColorStop(1, '#c1121f');
    ctx.fillStyle = bannerGradient;
    ctx.fillRect(0, 0, WIDTH, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔥  LIMITED TIME OFFER  🔥', WIDTH / 2, 40);

    // ─── DECORATIVE BORDER ────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 80, WIDTH - 40, HEIGHT - 100);

    // ─── CATEGORY BADGE ───────────────────────────────────────────
    if (category) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.beginPath();
      ctx.roundRect(WIDTH / 2 - 80, 95, 160, 32, 16);
      ctx.fill();

      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((category || '').toUpperCase(), WIDTH / 2, 117);
    }

    // ─── PRODUCT NAME ─────────────────────────────────────────────
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255,215,0,0.5)';
    ctx.shadowBlur = 15;

    // Word wrap for long product names
    const productWords = (product_name || 'Product').split(' ');
    const maxLineWidth = WIDTH - 80;
    let lines = [];
    let currentLine = '';
    for (const word of productWords) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxLineWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const nameY = category ? 195 : 175;
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, nameY + i * 50);
    });
    ctx.shadowBlur = 0;

    // ─── DESCRIPTION TEXT ─────────────────────────────────────────
    ctx.fillStyle = '#b0b8c8';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    const descText = description || '';
    const descWords = descText.split(' ');
    let descLines = [];
    let descLine = '';
    for (const word of descWords) {
      const testLine = descLine ? `${descLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxLineWidth - 40 && descLine) {
        descLines.push(descLine);
        descLine = word;
        if (descLines.length >= 2) break;
      } else {
        descLine = testLine;
      }
    }
    if (descLine && descLines.length < 2) descLines.push(descLine);

    const descY = nameY + (lines.length * 50) + 20;
    descLines.forEach((line, i) => {
      ctx.fillText(line, WIDTH / 2, descY + i * 26);
    });

    // ─── DIVIDER LINE ─────────────────────────────────────────────
    const dividerY = descY + (descLines.length * 26) + 30;
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, dividerY);
    ctx.lineTo(WIDTH - 80, dividerY);
    ctx.stroke();

    // ─── PRICE DISPLAY ────────────────────────────────────────────
    const priceY = dividerY + 50;

    // Strikethrough original price
    ctx.fillStyle = '#888888';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    const strikeText = '$19.99';
    ctx.fillText(strikeText, WIDTH / 2, priceY);
    const strikeWidth = ctx.measureText(strikeText).width;
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2 - strikeWidth / 2, priceY - 6);
    ctx.lineTo(WIDTH / 2 + strikeWidth / 2, priceY - 6);
    ctx.stroke();

    // Actual price in green
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(74,222,128,0.4)';
    ctx.shadowBlur = 12;
    ctx.fillText(price || '$14.99', WIDTH / 2, priceY + 55);
    ctx.shadowBlur = 0;

    // ─── CTA BUTTON ───────────────────────────────────────────────
    const btnY = priceY + 90;
    const btnW = 360;
    const btnH = 56;
    const btnX = (WIDTH - btnW) / 2;

    const btnGradient = ctx.createLinearGradient(btnX, 0, btnX + btnW, 0);
    btnGradient.addColorStop(0, '#e63946');
    btnGradient.addColorStop(1, '#c1121f');
    ctx.fillStyle = btnGradient;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 28);
    ctx.fill();

    // Button glow
    ctx.shadowColor = 'rgba(230,57,70,0.6)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 28);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GET INSTANT ACCESS →', WIDTH / 2, btnY + 36);

    // ─── BOTTOM WEBSITE TEXT ──────────────────────────────────────
    ctx.fillStyle = 'rgba(255,215,0,0.7)';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('artistrystore.com', WIDTH / 2, HEIGHT - 18);

    // ─── EXPORT AS BASE64 ─────────────────────────────────────────
    const buffer = canvas.toBuffer('image/png');
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

    return res.status(200).json({
      image_base64: base64,
      width: WIDTH,
      height: HEIGHT,
      product_name: product_name,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ad generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate ad image',
      details: error.message
    });
  }
};
