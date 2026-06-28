import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

export function getDb(): Client {
  if (_client) return _client
  const config = useRuntimeConfig()
  if (!config.tursoUrl) throw new Error('TURSO_DATABASE_URL is not set')
  _client = createClient({
    url: config.tursoUrl,
    authToken: config.tursoToken || undefined,
  })
  return _client
}

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  display_name TEXT NOT NULL,
  joined_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS sticker_states (
  participant_id TEXT NOT NULL REFERENCES participants(id),
  sticker_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('missing', 'owned', 'duplicate')),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (participant_id, sticker_id)
);
`

export async function ensureSchema() {
  const db = getDb()
  for (const stmt of SCHEMA.split(';').map(s => s.trim()).filter(Boolean)) {
    await db.execute(stmt)
  }
}
