import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: config } = await import('../src/payload.config.ts')

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'users', limit: 100, depth: 0 })

if (docs.length === 0) {
  console.log('No users found.')
  process.exit(0)
}

console.log(`Found ${docs.length} user(s):`)
for (const user of docs) {
  const email = user.email
  const currentRole = (user as { role?: string }).role ?? '(none)'
  console.log(`  - ${email} (current role: ${currentRole})`)
}

console.log('\nPromoting all to admin...')
for (const user of docs) {
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { role: 'admin' },
  })
  console.log(`  ✓ ${user.email} → admin`)
}

console.log('\nDone. Refresh /admin and log in again.')
process.exit(0)
