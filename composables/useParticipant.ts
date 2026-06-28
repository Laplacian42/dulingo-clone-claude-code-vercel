export interface StoredParticipant {
  id: string
  displayName: string
  eventId: string
}

const STORAGE_KEY = 'ssm_participants'

function load(): Record<string, StoredParticipant> {
  if (import.meta.server) return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(data: Record<string, StoredParticipant>) {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useParticipant(eventId: string) {
  const stored = computed<StoredParticipant | null>(() => {
    if (import.meta.server) return null
    const all = load()
    return all[eventId] ?? null
  })

  function persist(p: StoredParticipant) {
    const all = load()
    all[p.eventId] = p
    save(all)
  }

  async function join(displayName: string): Promise<StoredParticipant> {
    const existing = load()[eventId]
    const res = await $fetch<{ id: string; displayName: string; eventId: string }>(
      `/api/events/${eventId}/participants`,
      {
        method: 'POST',
        body: { displayName, participantId: existing?.id },
      },
    )
    const p: StoredParticipant = { id: res.id, displayName: res.displayName, eventId }
    persist(p)
    return p
  }

  return { stored, join, persist }
}
