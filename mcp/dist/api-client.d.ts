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
export declare const BASE_URL: string;
export interface Transcript {
    id: string;
    slug: string;
    title: string;
    tier?: 'standard' | 'premium' | 'elite';
    priceUsd?: number;
    executiveSummaryPreview?: string;
    sectors?: Array<{
        name: string;
        slug: string;
    }>;
    reportDate?: string;
    expertFormerTitle?: string;
    geography?: string;
}
export interface EarningsAnalysis {
    id: string;
    slug: string;
    title: string;
    ticker?: string;
    companyName?: string;
    quarter?: string;
    fiscalYear?: number;
    priceUsd?: number;
    summary?: string;
    sectors?: Array<{
        name: string;
        slug: string;
    }>;
    reportDate?: string;
}
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    contentType?: string;
    publishedAt?: string;
    readTime?: number;
    author?: {
        name?: string;
    };
}
export interface Order {
    id: string;
    orderRef?: string;
    customerEmail: string;
    customerName?: string;
    organisation?: string;
    totalUsd: number;
    status: string;
    createdAt: string;
}
export declare function apiGet<T>(path: string, params?: Record<string, string>): Promise<T>;
export declare function apiPost<T>(path: string, body: unknown, adminAuth?: boolean): Promise<T>;
export interface PayloadList<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
}
/**
 * Build a Payload REST query string from an object of where conditions.
 * e.g. buildWhere({ _status: 'published', tier: 'elite' }) →
 *   "where[_status][equals]=published&where[tier][equals]=elite"
 */
export declare function buildPayloadQuery(where: Record<string, string>, extra?: Record<string, string>): Record<string, string>;
export declare function payloadCreate<T>(collection: string, data: Record<string, unknown>): Promise<T>;
export declare function payloadPatch<T>(collection: string, id: string, data: Record<string, unknown>): Promise<T>;
export declare function textToLexical(text: string): object;
//# sourceMappingURL=api-client.d.ts.map