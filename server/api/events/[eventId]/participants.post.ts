import { getDb } from '../../../utils/db'

function randomId(len: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  if (!eventId) throw createError({ statusCode: 400, message: 'eventId required' })

  const body = await readBody(event) as { displayName?: string; participantId?: string }
  if (!body.displayName?.trim()) throw createError({ statusCode: 400, message: 'displayName required' })

  const db = getDb()

  // Check event exists
  const evRow = await db.execute({ sql: 'SELECT id FROM events WHERE id = ?', args: [eventId] })
  if (evRow.rows.length === 0) throw createError({ statusCode: 404, message: 'Event not found' })

  // Upsert participant (re-join with same ID restores session)
  const id = body.participantId ?? randomId(16)
  await db.execute({
    sql: `INSERT INTO participants (id, event_id, display_name)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name`,
    args: [id, eventId, body.displayName.trim()],
  })

  return { id, displayName: body.displayName.trim(), eventId }
})
