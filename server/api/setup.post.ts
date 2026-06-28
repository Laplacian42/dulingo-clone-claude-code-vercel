import { ensureSchema } from '../utils/db'

export default defineEventHandler(async () => {
  await ensureSchema()
  return { ok: true }
})
