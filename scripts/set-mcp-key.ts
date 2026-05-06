/**
 * One-time backfill: set mcpApiKey on the first admin user who doesn't have one.
 * Matches the key already in claude_desktop_config.json so the MCP connects immediately.
 *
 * Run: npx tsx --env-file=.env.local scripts/set-mcp-key.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Must match the value in %APPDATA%\Claude\claude_desktop_config.json → TIQ_API_KEY
const DESIRED_KEY = '774c7bca-e731-46ec-9592-7858c265c347'

async function main() {
  const payload = await getPayload({ config: await config })

  // Find all admin/editor users
  const result = await payload.find({
    collection: 'users',
    where: { role: { in: ['admin', 'editor'] } },
    overrideAccess: true,
    limit: 50,
  })

  if (result.docs.length === 0) {
    console.log('No admin/editor users found.')
    process.exit(0)
  }

  for (const user of result.docs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = (user as any).mcpApiKey
    if (existing) {
      console.log(`User ${user.email}: already has mcpApiKey = ${existing}`)
      continue
    }

    await payload.update({
      collection: 'users',
      id: String(user.id),
      data: { mcpApiKey: DESIRED_KEY } as never,
      overrideAccess: true,
    })
    console.log(`✅  User ${user.email}: mcpApiKey set to ${DESIRED_KEY}`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
