import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  if (!eventId) throw createError({ statusCode: 400, message: 'eventId required' })

  const db = getDb()
  const rows = await db.execute({
    sql: 'SELECT id, display_name, joined_at FROM participants WHERE event_id = ? ORDER BY joined_at',
    args: [eventId],
  })

  return rows.rows.map(r => ({ id: r.id, displayName: r.display_name, joinedAt: r.joined_at }))
})
