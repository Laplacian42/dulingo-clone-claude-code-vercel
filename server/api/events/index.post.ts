import { getDb, ensureSchema } from '../../utils/db'

function randomId(len: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { name?: string }
  if (!body.name?.trim()) throw createError({ statusCode: 400, message: 'Event name is required' })

  await ensureSchema()
  const db = getDb()
  const id = randomId(16)
  const code = randomId(6)

  await db.execute({
    sql: 'INSERT INTO events (id, code, name) VALUES (?, ?, ?)',
    args: [id, code, body.name.trim()],
  })

  return { id, code, name: body.name.trim() }
})
