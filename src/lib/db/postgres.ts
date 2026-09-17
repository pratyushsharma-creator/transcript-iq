import type { PostgresAdapter } from '@payloadcms/db-postgres'
import pg, { type PoolClient } from 'pg'
import type { DatabaseAdapterObj } from 'payload'

/**
 * Neon suspends the production compute when it is idle. The first connections after it
 * wakes can fail with ECONNRESET, "Authentication timed out", a TLS disconnect or
 * "Connection terminated unexpectedly". Payload opens its first connection exactly once
 * at startup, so each of these used to fail the request.
 */
const TRANSIENT_ERROR_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EPIPE',
  '08P01', // protocol_violation: how Neon reports "Authentication timed out"
  '08006', // connection_failure
  '57P03', // cannot_connect_now
])

const TRANSIENT_ERROR_MESSAGE =
  /Connection terminated|socket disconnected before secure TLS connection|timeout exceeded when trying to connect|Authentication timed out/i

const RETRY_DELAYS_MS = [300, 1_000, 2_500]

export function isTransientConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const code = (err as { code?: unknown }).code
  return (typeof code === 'string' && TRANSIENT_ERROR_CODES.has(code)) || TRANSIENT_ERROR_MESSAGE.test(err.message)
}

type ConnectCallback = (
  err: Error | undefined,
  client: PoolClient | undefined,
  done: (release?: unknown) => void,
) => void

/** A pg Pool that retries transient connection errors with a short backoff. */
class ResilientPool extends pg.Pool {
  connect(): Promise<PoolClient>
  connect(callback: ConnectCallback): void
  connect(callback?: ConnectCallback): Promise<PoolClient> | void {
    const connectWithRetry = async (): Promise<PoolClient> => {
      for (let attempt = 0; ; attempt++) {
        try {
          return await super.connect()
        } catch (err) {
          if (attempt >= RETRY_DELAYS_MS.length || !isTransientConnectionError(err)) throw err
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
        }
      }
    }

    if (!callback) return connectWithRetry()
    // pg-pool's own query() uses the callback form.
    connectWithRetry().then(
      (client) => callback(undefined, client, (release) => client.release(release as boolean | Error | undefined)),
      (err: Error) => callback(err, undefined, () => {}),
    )
  }
}

/** `pg` with a Pool that retries transient connection errors. Pass as `postgresAdapter({ pg })`. */
export const resilientPg = { ...pg, Pool: ResilientPool } as typeof pg

/**
 * pg logs a SECURITY WARNING on every new connection that `sslmode=require` is treated as
 * `verify-full`. Spell out `verify-full`: identical behaviour, no warning.
 */
export const withExplicitSslMode = (connectionString: string): string =>
  connectionString.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/, '$1verify-full')

/**
 * If Payload's first database connection fails, the postgres adapter rejects its internal
 * `initializing` promise with no reason and nothing awaiting it. Node treats that as an
 * unhandled rejection and kills the whole function instance ("Unhandled Rejection:
 * undefined", exit 128), failing every request it is serving. The connection error still
 * reaches the caller; this only stops the crash.
 */
export function withoutInitCrash(adapter: DatabaseAdapterObj<PostgresAdapter>): DatabaseAdapterObj<PostgresAdapter> {
  return {
    ...adapter,
    init: (args) => {
      const db = adapter.init(args)
      db.initializing.catch(() => {})
      return db
    },
  }
}
