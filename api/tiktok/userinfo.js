/**
 * ARTISY Poster — TikTok user-info verification endpoint (Vercel function).
 *
 * GET /api/tiktok/userinfo?access_token=<access token>
 *   Header: x-artisy-guard: <GUARD_SECRET>     (or ?guard= as a fallback)
 *   -> 200  TikTok's response for GET /v2/user/info/, passed through:
 *           { data: { user: { open_id, display_name, username, ... } },
 *             error: { code: "ok", ... } }
 *   -> 4xx  TikTok's error JSON, passed through with TikTok's status
 *   -> 400  { ok: false, error: "bad_request" }   (no access_token)
 *   -> 403  { ok: false, error: "forbidden" }     (guard missing/wrong)
 *   -> 500  { ok: false, error: "not_configured" }(GUARD_SECRET unset)
 *   -> 502  { ok: false, error: "upstream" }      (TikTok unreachable)
 *
 * This is the smoke test for the whole chain: a 200 with error.code "ok"
 * and the @tlott12 profile proves the consent, the exchange and the token
 * all work. The access token is supplied by the caller per request — this
 * function stores nothing.
 */

const crypto = require('crypto');

const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/';
const FIELDS = [
  'open_id',
  'union_id',
  'avatar_url',
  'display_name',
  'username',
  'bio_description',
  'profile_deep_link',
  'is_verified',
  'follower_count',
  'following_count',
  'likes_count',
  'video_count',
].join(',');
const UPSTREAM_TIMEOUT_MS = 15000;

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

// Fail closed: no GUARD_SECRET in env -> nothing is authorized.
function checkGuard(req, query) {
  const expected = process.env.GUARD_SECRET;
  if (!expected) return { status: 500, error: 'not_configured' };
  const given = req.headers['x-artisy-guard'] || query.guard;
  if (!given || typeof given !== 'string') return { status: 403, error: 'forbidden' };
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { status: 403, error: 'forbidden' };
  }
  return null; // null = guard passed
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { ok: false, error: 'method' });
  }
  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams.entries());
  const guardFailure = checkGuard(req, query);
  if (guardFailure) {
    return sendJson(res, guardFailure.status, { ok: false, error: guardFailure.error });
  }
  const accessToken = query.access_token;
  if (!accessToken || typeof accessToken !== 'string' || !accessToken.trim()) {
    return sendJson(res, 400, { ok: false, error: 'bad_request' });
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const resp = await fetch(`${USER_INFO_URL}?fields=${encodeURIComponent(FIELDS)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken.trim()}` },
      signal: controller.signal,
    });
    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { ok: false, error: 'upstream_non_json', raw: text.slice(0, 300) };
    }
    return sendJson(res, resp.status, json);
  } catch {
    return sendJson(res, 502, { ok: false, error: 'upstream' });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = handler;
