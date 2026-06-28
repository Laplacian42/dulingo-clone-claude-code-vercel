import { getDb, ensureSchema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')?.toUpperCase()
  if (!code) throw createError({ statusCode: 400, message: 'Code required' })

  await ensureSchema()
  const db = getDb()

  const row = await db.execute({
    sql: 'SELECT id, code, name FROM events WHERE code = ?',
    args: [code],
  })
  if (row.rows.length === 0) throw createError({ statusCode: 404, message: 'Event not found' })

  const ev = row.rows[0]
  const countRow = await db.execute({
    sql: 'SELECT COUNT(*) as n FROM participants WHERE event_id = ?',
    args: [ev.id as string],
  })

  return {
    id: ev.id,
    code: ev.code,
    name: ev.name,
    participantCount: Number(countRow.rows[0].n),
  }
})
