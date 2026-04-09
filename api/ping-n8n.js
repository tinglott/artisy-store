export default async function handler(req, res) {
  try {
    const n8nUrl = 'https://n8n-railway-custom-production-fdfe.up.railway.app/healthz';
    const response = await fetch(n8nUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    });
    res.status(200).json({ 
      status: 'ok', 
      n8n: response.ok ? 'alive' : 'unreachable',
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(200).json({ status: 'ok', n8n: 'timeout', error: e.message });
  }
}
