/**
 * ARTISY Poster — TikTok code exchange endpoint (Vercel serverless function).
 *
 * POST /api/tiktok/exchange
 *   Header: x-artisy-guard: <GUARD_SECRET>     (or "guard" in the JSON body)
 *   Body:   { "code": "<authorization code from the Login Kit callback>" }
 *   -> 200  TikTok's token JSON, passed through verbatim:
 *           { access_token, expires_in, refresh_token, refresh_expires_in,
 *             open_id, scope, token_type }
 *   -> 4xx  TikTok's error JSON, passed through with TikTok's status
 *   -> 400  { ok: false, error: "bad_request" }   (missing/invalid code)
 *   -> 403  { ok: false, error: "forbidden" }     (guard missing/wrong)
 *   -> 405  { ok: false, error: "method" }        (not a POST)
 *   -> 500  { ok: false, error: "not_configured" }(env not set yet)
 *   -> 502  { ok: false, error: "upstream" }      (TikTok unreachable)
 *
 * The client secret is read from the TIKTOK_CLIENT_SECRET environment
 * variable only — never committed, never logged, never sent to the caller.
 * The authorization code is single-use and lives ~5 minutes: exchange it
 * immediately after the consent redirect. The redirect_uri sent here must
 * EXACTLY match the one used in the authorization request.
 */

const crypto = require('crypto');

const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const CLIENT_KEY_FALLBACK = 'awe7nu45pzbwc0ms'; // public identifier
const REDIRECT_URI = 'https://shop.artistrystore.com/tiktok-callback.html';
const MAX_BODY_BYTES = 16384;
const UPSTREAM_TIMEOUT_MS = 15000;

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

// Fail closed: no GUARD_SECRET in env -> nothing is authorized.
function checkGuard(req, body) {
  const expected = process.env.GUARD_SECRET;
  if (!expected) return { status: 500, error: 'not_configured' };
  const given = req.headers['x-artisy-guard'] || (body && body.guard);
  if (!given || typeof given !== 'string') return { status: 403, error: 'forbidden' };
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { status: 403, error: 'forbidden' };
  }
  return null; // null = guard passed
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('bad_json'));
      }
    });
    req.on('error', reject);
  });
}

async function tokenCall(fields) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const resp = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields).toString(),
      signal: controller.signal,
    });
    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { ok: false, error: 'upstream_non_json', raw: text.slice(0, 300) };
    }
    return { status: resp.status, json };
  } finally {
    clearTimeout(timer);
  }
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { ok: false, error: 'method' });
  }
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'bad_request' });
  }
  const guardFailure = checkGuard(req, body);
  if (guardFailure) {
    return sendJson(res, guardFailure.status, { ok: false, error: guardFailure.error });
  }
  if (!body || typeof body.code !== 'string' || !body.code.trim()) {
    return sendJson(res, 400, { ok: false, error: 'bad_request' });
  }
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientSecret) {
    return sendJson(res, 500, { ok: false, error: 'not_configured' });
  }
  // TikTok requires the URL-decoded code; the callback page shows the raw
  // value, so decode defensively (a no-op when there is nothing to decode).
  let code = body.code.trim();
  try {
    code = decodeURIComponent(code);
  } catch {
    /* keep the raw value */
  }
  let result;
  try {
    result = await tokenCall({
      client_key: process.env.TIKTOK_CLIENT_KEY || CLIENT_KEY_FALLBACK,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });
  } catch {
    return sendJson(res, 502, { ok: false, error: 'upstream' });
  }
  return sendJson(res, result.status, result.json);
}

module.exports = handler;
