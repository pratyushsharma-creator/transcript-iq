# Transcript IQ MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes Transcript IQ's content as tools for Claude (or any MCP-compatible AI).

## Setup

### 1. Install dependencies

```bash
cd mcp
npm install
npm run build
```

### 2. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "transcript-iq": {
      "command": "node",
      "args": ["/absolute/path/to/Transcript IQ (Claude Build)/mcp/dist/index.js"],
      "env": {
        "TIQ_API_URL": "https://transcript-iq.com",
        "TIQ_API_KEY": "<your PAYLOAD_SECRET value>"
      }
    }
  }
}
```

For local development (Next.js running on port 3000):

```json
{
  "mcpServers": {
    "transcript-iq-local": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/dist/index.js"],
      "env": {
        "TIQ_API_URL": "http://localhost:3000",
        "TIQ_API_KEY": "<your PAYLOAD_SECRET from .env.local>"
      }
    }
  }
}
```

### 3. For Claude Code (claude-code MCP)

Add to your `.claude/settings.json`:

```json
{
  "mcpServers": {
    "transcript-iq": {
      "command": "node",
      "args": ["./mcp/dist/index.js"],
      "env": {
        "TIQ_API_URL": "http://localhost:3000",
        "TIQ_API_KEY": "<PAYLOAD_SECRET>"
      }
    }
  }
}
```

## Available Tools

### Content queries (no auth needed)

| Tool | Description |
|------|-------------|
| `list_transcripts` | List published expert transcripts. Filter by sector, tier, geography. |
| `get_transcript` | Get details for a transcript by slug. |
| `list_earnings` | List earnings analyses. Filter by ticker, quarter, fiscal year. |
| `get_earnings` | Get details for an earnings analysis by slug. |
| `list_blog_posts` | List blog posts. Filter by content type. |
| `get_blog_post` | Get details for a blog post by slug. |

### Admin tools (require `TIQ_API_KEY`)

| Tool | Description |
|------|-------------|
| `list_orders` | List customer orders. Filter by status or email. |
| `draft_content` | Draft blog, transcript summary, or earnings summary from a brief using Claude. |
| `generate_meta` | Generate SEO title + meta description for content using Claude. |
| `suggest_tags` | Suggest industry and category tags using Claude. |

## Example usage in Claude

```
# List all Elite tier transcripts in Technology
list_transcripts with tier=elite, sector=technology-saas

# Get a specific transcript
get_transcript with slug=apple-q4-2024-cfo-supply-chain

# Draft a blog post
draft_content with type=blog, brief="We want to explain what expert call transcripts are and why institutional investors use them for primary research, targeting PE analysts as the audience"

# Check recent orders
list_orders with status=paid, limit=10
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TIQ_API_URL` | No | Base URL (default: `http://localhost:3000`) |
| `TIQ_API_KEY` | Admin tools only | Value of `PAYLOAD_SECRET` from `.env.local` |
