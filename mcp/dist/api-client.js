/**
 * Thin REST client over the Transcript IQ Next.js API.
 *
 * All tools in this MCP server call this client rather than hitting
 * Payload or the DB directly — keeping the MCP server as a clean,
 * deployable-anywhere side-car process.
 *
 * Configuration (env vars):
 *   TIQ_API_URL    Base URL for the Next.js app (default: http://localhost:3000)
 *   TIQ_API_KEY    Your personal MCP API key from /admin/account — used for admin routes and write tools
 */
export const BASE_URL = (process.env.TIQ_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const API_KEY = process.env.TIQ_API_KEY ?? '';
// ── Generic fetcher ────────────────────────────────────────────────────────────
export async function apiGet(path, params) {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}: ${text}`);
    }
    return res.json();
}
export async function apiPost(path, body, adminAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (adminAuth && API_KEY) {
        headers['Authorization'] = `users API-Key ${API_KEY}`;
    }
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
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