import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const connStr = process.env.DATABASE_URI
if (!connStr) {
  console.error('DATABASE_URI not set in .env.local')
  process.exit(1)
}

const pool = new Pool({ connectionString: connStr })

async function main() {
  console.log('Connecting to Neon and dropping public schema…')
  const client = await pool.connect()
  try {
    await client.query('DROP SCHEMA IF EXISTS public CASCADE')
    await client.query('CREATE SCHEMA public')
    await client.query('GRANT ALL ON SCHEMA public TO public')
    console.log('✓ public schema dropped and recreated.')
    console.log('Next: restart `pnpm dev`. Payload will rebuild all tables from the new collection schemas.')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Reset failed:', err)
  process.exit(1)
})
