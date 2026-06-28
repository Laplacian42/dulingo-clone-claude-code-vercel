import { getDb } from '../../../utils/db'
import { computeTrades, type ParticipantData } from '../../../utils/matching'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'eventId')
  const query = getQuery(event) as { participantId?: string }
  if (!eventId) throw createError({ statusCode: 400, message: 'eventId required' })

  const db = getDb()

  // Load all participants in this event
  const partRows = await db.execute({
    sql: 'SELECT id, display_name FROM participants WHERE event_id = ?',
    args: [eventId],
  })

  // Load all sticker states for this event
  const stateRows = await db.execute({
    sql: `SELECT ss.participant_id, ss.sticker_id, ss.state
          FROM sticker_states ss
          JOIN participants p ON p.id = ss.participant_id
          WHERE p.event_id = ?`,
    args: [eventId],
  })

  // Build ParticipantData[]
  const participants: ParticipantData[] = partRows.rows.map(r => ({
    id: r.id as string,
    displayName: r.display_name as string,
    missing: new Set<string>(),
    duplicates: new Set<string>(),
  }))

  for (const r of stateRows.rows) {
    const p = participants.find(x => x.id === r.participant_id)
    if (!p) continue
    if (r.state === 'missing') p.missing.add(r.sticker_id as string)
    else if (r.state === 'duplicate') p.duplicates.add(r.sticker_id as string)
  }

  const result = computeTrades(participants, query.participantId)

  // Serialize Sets before returning (JSON doesn't handle Set)
  return {
    directTrades: result.directTrades,
    donations: result.donations,
    chains: result.chains,
  }
})
