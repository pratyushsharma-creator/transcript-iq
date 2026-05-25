#!/usr/bin/env node
/**
 * Transcript IQ MCP Server
 *
 * A Model Context Protocol server that exposes Transcript IQ's content
 * as tools for Claude (or any MCP-compatible AI client).
 *
 * Transport: stdio (default for Claude Desktop / Claude Code MCP)
 *
 * Configuration:
 *   TIQ_API_URL   Base URL for the running Next.js app (default: http://localhost:3000)
 *   TIQ_API_KEY   PAYLOAD_SECRET value — required for admin-only tools
 *
 * Setup:
 *   1. Install: cd mcp && npm install
 *   2. Build:   cd mcp && npm run build
 *   3. Add to claude_desktop_config.json:
 *      {
 *        "mcpServers": {
 *          "transcript-iq": {
 *            "command": "node",
 *            "args": ["/path/to/mcp/dist/index.js"],
 *            "env": {
 *              "TIQ_API_URL": "https://transcript-iq.com",
 *              "TIQ_API_KEY": "<PAYLOAD_SECRET>"
 *            }
 *          }
 *        }
 *      }
 *
 * Available tools:
 *   Content queries (no auth needed):
 *     list_transcripts, get_transcript
 *     list_earnings,    get_earnings
 *     list_blog_posts,  get_blog_post
 *
 *   Admin tools (require TIQ_API_KEY):
 *     list_orders
 *     draft_content      → Claude drafts blog/transcript/earnings content
 *     generate_meta      → Claude generates SEO title + description
 *     suggest_tags       → Claude suggests industries + categories
 */
export {};
//# sourceMappingURL=index.d.ts.map