import { getDb } from '../../../../utils/db'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  const stickerId = getRouterParam(event, 'stickerId')
  if (!eventId || !stickerId) throw createError({ statusCode: 400, message: 'Missing params' })

  const body = await readBody(event) as { participantId?: string; state?: string }
  if (!body.participantId || !body.state) throw createError({ statusCode: 400, message: 'participantId and state required' })
  if (!['missing', 'owned', 'duplicate'].includes(body.state)) {
    throw createError({ statusCode: 400, message: 'state must be missing|owned|duplicate' })
  }

  const db = getDb()
  await db.execute({
    sql: `INSERT INTO sticker_states (participant_id, sticker_id, state, updated_at)
          VALUES (?, ?, ?, unixepoch())
          ON CONFLICT(participant_id, sticker_id) DO UPDATE SET state = excluded.state, updated_at = unixepoch()`,
    args: [body.participantId, stickerId, body.state],
  })

  return { ok: true, stickerId, state: body.state }
})
