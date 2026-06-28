import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  const query = getQuery(event) as { participantId?: string }
  if (!eventId || !query.participantId) {
    throw createError({ statusCode: 400, message: 'eventId and participantId required' })
  }

  const db = getDb()
  const rows = await db.execute({
    sql: 'SELECT sticker_id, state FROM sticker_states WHERE participant_id = ?',
    args: [query.participantId],
  })

  const states: Record<string, string> = {}
  for (const r of rows.rows) {
    states[r.sticker_id as string] = r.state as string
  }
  return states
})
