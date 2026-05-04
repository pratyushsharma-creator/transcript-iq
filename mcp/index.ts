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

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

import {
  listTranscripts, listTranscriptsSchema,
  getTranscript,   getTranscriptSchema,
} from './tools/transcripts.js'

import {
  listEarnings, listEarningsSchema,
  getEarnings,  getEarningsSchema,
} from './tools/earnings.js'

import {
  listBlogPosts, listBlogPostsSchema,
  getBlogPost,   getBlogPostSchema,
} from './tools/blog.js'

import {
  listOrders,    listOrdersSchema,
  draftContent,  draftContentSchema,
  generateMeta,  generateMetaSchema,
  suggestTags,   suggestTagsSchema,
} from './tools/admin.js'

import { BASE_URL } from './api-client.js'

// ── Server declaration ─────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'transcript-iq',
    version: '1.0.0',
  },
  {
    capabilities: { tools: {} },
  },
)

// ── Tool registry ──────────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'list_transcripts',
    description: 'List published expert call transcripts. Supports filtering by sector, tier, and geography.',
    inputSchema: listTranscriptsSchema,
  },
  {
    name: 'get_transcript',
    description: 'Get full details of a single expert transcript by its slug.',
    inputSchema: getTranscriptSchema,
  },
  {
    name: 'list_earnings',
    description: 'List published earnings analysis briefs. Supports filtering by ticker, quarter, and fiscal year.',
    inputSchema: listEarningsSchema,
  },
  {
    name: 'get_earnings',
    description: 'Get full details of a single earnings analysis by its slug.',
    inputSchema: getEarningsSchema,
  },
  {
    name: 'list_blog_posts',
    description: 'List published blog posts and research guides.',
    inputSchema: listBlogPostsSchema,
  },
  {
    name: 'get_blog_post',
    description: 'Get full details of a single blog post by its slug.',
    inputSchema: getBlogPostSchema,
  },
  {
    name: 'list_orders',
    description: '[ADMIN] List customer orders. Requires TIQ_API_KEY env var.',
    inputSchema: listOrdersSchema,
  },
  {
    name: 'draft_content',
    description: '[ADMIN] Draft blog, transcript summary, or earnings summary from a brief using Claude. Requires TIQ_API_KEY.',
    inputSchema: draftContentSchema,
  },
  {
    name: 'generate_meta',
    description: '[ADMIN] Generate SEO title and meta description for content using Claude. Requires TIQ_API_KEY.',
    inputSchema: generateMetaSchema,
  },
  {
    name: 'suggest_tags',
    description: '[ADMIN] Suggest industry and category tags for content using Claude. Requires TIQ_API_KEY.',
    inputSchema: suggestTagsSchema,
  },
] as const

// ── Handler: list tools ────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        Object.entries(t.inputSchema.shape).map(([key, schema]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = schema as any
          return [
            key,
            {
              type: s._def?.typeName?.replace('Zod', '').toLowerCase() ?? 'string',
              description: s.description,
              ...(s._def?.defaultValue !== undefined ? { default: s._def.defaultValue() } : {}),
            },
          ]
        }),
      ),
    },
  })),
}))

// ── Handler: call tool ─────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    let result: string

    switch (name) {
      case 'list_transcripts':
        result = await listTranscripts(listTranscriptsSchema.parse(args))
        break
      case 'get_transcript':
        result = await getTranscript(getTranscriptSchema.parse(args))
        break
      case 'list_earnings':
        result = await listEarnings(listEarningsSchema.parse(args))
        break
      case 'get_earnings':
        result = await getEarnings(getEarningsSchema.parse(args))
        break
      case 'list_blog_posts':
        result = await listBlogPosts(listBlogPostsSchema.parse(args))
        break
      case 'get_blog_post':
        result = await getBlogPost(getBlogPostSchema.parse(args))
        break
      case 'list_orders':
        result = await listOrders(listOrdersSchema.parse(args))
        break
      case 'draft_content':
        result = await draftContent(draftContentSchema.parse(args))
        break
      case 'generate_meta':
        result = await generateMeta(generateMetaSchema.parse(args))
        break
      case 'suggest_tags':
        result = await suggestTags(suggestTagsSchema.parse(args))
        break
      default:
        return {
          content: [{ type: 'text' as const, text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }

    return {
      content: [{ type: 'text' as const, text: result }],
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      content: [{ type: 'text' as const, text: `Error: ${message}` }],
      isError: true,
    }
  }
})

// ── Start ──────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
await server.connect(transport)

console.error(`[transcript-iq MCP] Server started — connected to ${BASE_URL}`)
