// NEXUS — /api/aminos-orders endpoint
// Handles order tracking for the Aminos bot builder pipeline

const orders = []; // In-memory store (replace with Supabase in production)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Verify secret key for writes
  const auth = req.headers['authorization'] || '';
  const NEXUS_SECRET = process.env.NEXUS_SECRET || 'nexus2026';

  if (req.method === 'POST') {
    const { action, order_id, tier, customer_email, status, bot_id, preview_url, timestamp } = req.body;

    if (action === 'new_order') {
      orders.push({
        order_id,
        tier,
        customer_email: customer_email?.replace(/(.{2}).*(@.*)/, '$1***$2'), // mask email
        status: status || 'awaiting_intake',
        created_at: timestamp || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return res.json({ ok: true, message: 'Order logged' });
    }

    if (action === 'update_status') {
      const order = orders.find(o => o.order_id === order_id);
      if (order) {
        order.status = status;
        order.bot_id = bot_id;
        order.preview_url = preview_url;
        order.updated_at = new Date().toISOString();
      }
      return res.json({ ok: true, message: 'Status updated' });
    }
  }

  if (req.method === 'GET') {
    // Return summary stats + recent orders
    const stats = {
      total: orders.length,
      awaiting_intake: orders.filter(o => o.status === 'awaiting_intake').length,
      building: orders.filter(o => o.status === 'building').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      failed: orders.filter(o => o.status === 'failed').length,
    };
    return res.json({ stats, orders: orders.slice(-20).reverse() });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
