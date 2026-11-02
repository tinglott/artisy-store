/**
 * ARTISY Poster — TikTok token refresh endpoint (Vercel serverless function).
 *
 * POST /api/tiktok/refresh
 *   Header: x-artisy-guard: <GUARD_SECRET>     (or "guard" in the JSON body)
 *   Body:   { "refresh_token": "<current refresh token>" }
 *   -> 200  TikTok's token JSON, passed through verbatim — INCLUDING the
 *           NEW refresh_token. Refresh tokens ROTATE: the token you sent
 *           dies the moment this call succeeds, and the returned one is
 *           the only valid one. Whoever calls this must store the new
 *           refresh_token immediately (see README.md "Rotation discipline").
 *   -> 4xx  TikTok's error JSON, passed through with TikTok's status
 *           (an invalid_grant here usually means the stored refresh token
 *           was already rotated away, or the 180-day window has closed —
 *           either way Ting must re-consent; see README.md).
 *   -> 400  { ok: false, error: "bad_request" }
 *   -> 403  { ok: false, error: "forbidden" }
 *   -> 405  { ok: false, error: "method" }
 *   -> 500  { ok: false, error: "not_configured" }
 *   -> 502  { ok: false, error: "upstream" }
 *
 * The client secret is read from the TIKTOK_CLIENT_SECRET environment
 * variable only — never committed, never logged, never sent to the caller.
 */

const crypto = require('crypto');

const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const CLIENT_KEY_FALLBACK = 'awe7nu45pzbwc0ms'; // public identifier
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
  if (!body || typeof body.refresh_token !== 'string' || !body.refresh_token.trim()) {
    return sendJson(res, 400, { ok: false, error: 'bad_request' });
  }
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientSecret) {
    return sendJson(res, 500, { ok: false, error: 'not_configured' });
  }
  let result;
  try {
    result = await tokenCall({
      client_key: process.env.TIKTOK_CLIENT_KEY || CLIENT_KEY_FALLBACK,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: body.refresh_token.trim(),
    });
  } catch {
    return sendJson(res, 502, { ok: false, error: 'upstream' });
  }
  return sendJson(res, result.status, result.json);
}

module.exports = handler;
