/**
 * Thin REST client over the Transcript IQ Next.js API.
 *
 * All tools in this MCP server call this client rather than hitting
 * Payload or the DB directly — keeping the MCP server as a clean,
 * deployable-anywhere side-car process.
 *
 * Configuration (env vars):
 *   TIQ_API_URL    Base URL for the Next.js app (default: http://localhost:3000;
 *                  production: https://www.transcript-iq.com)
 *   TIQ_API_KEY    Your personal MCP API key from /admin/account (admin/editor users) —
 *                  used for admin routes and write tools. Not PAYLOAD_SECRET.
 */
export const BASE_URL = (process.env.TIQ_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const API_KEY = process.env.TIQ_API_KEY ?? '';
// ── Generic fetcher ────────────────────────────────────────────────────────────
const sameSite = (a, b) => a.replace(/^www\./, '') === b.replace(/^www\./, '');
/**
 * fetch() drops the Authorization header when a redirect changes origin, and
 * transcript-iq.com permanently redirects to www.transcript-iq.com — so calls against the
 * apex arrived without the key and got 401. Follow same-site redirects ourselves so the
 * key survives.
 */
async function request(url, init, adminAuth) {
    if (!adminAuth || !API_KEY)
        return fetch(url, init);
    const headers = { ...init.headers, Authorization: `users API-Key ${API_KEY}` };
    const res = await fetch(url, { ...init, headers, redirect: 'manual' });
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
        const next = new URL(location, url);
        if (sameSite(new URL(url).hostname, next.hostname)) {
            return fetch(next, { ...init, headers, redirect: 'manual' });
        }
    }
    return res;
}
export async function apiGet(path, params, adminAuth = false) {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await request(url.toString(), {}, adminAuth);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json();
}
export async function apiPost(path, body, adminAuth = false) {
    const res = await request(`${BASE_URL}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, adminAuth);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json();
}
/**
 * Build a Payload REST query string from an object of where conditions.
 * e.g. buildWhere({ _status: 'published', tier: 'elite' }) →
 *   "where[_status][equals]=published&where[tier][equals]=elite"
 */
export function buildPayloadQuery(where, extra) {
    const params = {};
    for (const [field, value] of Object.entries(where)) {
        params[`where[${field}][equals]`] = value;
    }
    if (extra)
        Object.assign(params, extra);
    return params;
}
export async function payloadCreate(collection, data) {
    return apiPost('/api/payload-write', { collection, operation: 'create', data }, true);
}
export async function payloadPatch(collection, id, data) {
    return apiPost('/api/payload-write', { collection, operation: 'patch', id, data }, true);
}
export function textToLexical(text) {
    const paragraphs = text.split(/\n{2,}/).filter(Boolean);
    return {
        root: {
            type: 'root',
            children: paragraphs.map((para) => ({
                type: 'paragraph',
                version: 1,
                indent: 0,
                format: '',
                direction: 'ltr',
                children: [{ type: 'text', text: para.trim(), format: 0, mode: 'normal', style: '', version: 1 }],
            })),
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
        },
    };
}
//# sourceMappingURL=api-client.js.map