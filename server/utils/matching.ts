export interface ParticipantData {
  id: string
  displayName: string
  missing: Set<string>
  duplicates: Set<string>
}

export interface DirectTrade {
  type: 'direct'
  participantA: { id: string; name: string }
  participantB: { id: string; name: string }
  aGivesB: string[]
  bGivesA: string[]
}

export interface Donation {
  type: 'donation'
  from: { id: string; name: string }
  to: { id: string; name: string }
  stickers: string[]
}

export interface TradeChain {
  type: 'chain'
  steps: { from: { id: string; name: string }; to: { id: string; name: string }; sticker: string }[]
}

export interface TradeResult {
  directTrades: DirectTrade[]
  donations: Donation[]
  chains: TradeChain[]
}

export function computeTrades(participants: ParticipantData[], focusId?: string): TradeResult {
  // Build edge map: gives[A][B] = stickers A (duplicate) can give B (missing)
  const gives = new Map<string, Map<string, string[]>>()
  for (const a of participants) {
    gives.set(a.id, new Map())
    for (const b of participants) {
      if (a.id === b.id) continue
      const canGive = [...a.duplicates].filter(s => b.missing.has(s))
      if (canGive.length > 0) gives.get(a.id)!.set(b.id, canGive)
    }
  }

  const directTrades = findDirectTrades(participants, gives, focusId)
  const donations = findDonations(participants, gives, focusId)
  const chains = findChains(participants, gives, focusId)

  return { directTrades, donations, chains }
}

function findDirectTrades(
  participants: ParticipantData[],
  gives: Map<string, Map<string, string[]>>,
  focusId?: string,
): DirectTrade[] {
  const trades: DirectTrade[] = []
  const seen = new Set<string>()

  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const a = participants[i]
      const b = participants[j]

      if (focusId && a.id !== focusId && b.id !== focusId) continue

      const aGivesB = gives.get(a.id)?.get(b.id) ?? []
      const bGivesA = gives.get(b.id)?.get(a.id) ?? []

      if (aGivesB.length > 0 && bGivesA.length > 0) {
        const key = [a.id, b.id].sort().join('|')
        if (!seen.has(key)) {
          seen.add(key)
          trades.push({
            type: 'direct',
            participantA: { id: a.id, name: a.displayName },
            participantB: { id: b.id, name: b.displayName },
            aGivesB,
            bGivesA,
          })
        }
      }
    }
  }

  return trades
}

function findDonations(
  participants: ParticipantData[],
  gives: Map<string, Map<string, string[]>>,
  focusId?: string,
): Donation[] {
  if (!focusId) return []
  const me = participants.find(p => p.id === focusId)
  if (!me) return []

  const donations: Donation[] = []
  for (const other of participants) {
    if (other.id === focusId) continue
    const iCanGive = gives.get(me.id)?.get(other.id) ?? []
    const theyCanGive = gives.get(other.id)?.get(me.id) ?? []
    if (iCanGive.length > 0 && theyCanGive.length === 0) {
      donations.push({
        type: 'donation',
        from: { id: me.id, name: me.displayName },
        to: { id: other.id, name: other.displayName },
        stickers: iCanGive,
      })
    }
  }
  return donations
}

function findChains(
  participants: ParticipantData[],
  gives: Map<string, Map<string, string[]>>,
  focusId?: string,
  maxLen = 4,
): TradeChain[] {
  const chains: TradeChain[] = []
  const seenKeys = new Set<string>()

  // Only start cycles from focusId if specified
  const startIds = focusId ? [focusId] : participants.map(p => p.id)

  for (const startId of startIds) {
    // Skip if this participant has no outgoing edges
    if (!gives.has(startId) || gives.get(startId)!.size === 0) continue

    // DFS looking for cycles back to startId
    const dfs = (path: string[]) => {
      if (path.length > maxLen) return
      const current = path[path.length - 1]
      const neighbors = gives.get(current)

      if (!neighbors) return

      for (const [nextId, stickers] of neighbors) {
        // Close the cycle back to start (min length 3)
        if (nextId === startId && path.length >= 3) {
          const cycleKey = [...path].sort().join('|')
          if (!seenKeys.has(cycleKey)) {
            seenKeys.add(cycleKey)
            const steps = path.map((id, i) => {
              const toId = i === path.length - 1 ? startId : path[i + 1]
              const giver = participants.find(p => p.id === id)!
              const receiver = participants.find(p => p.id === toId)!
              const sticker = gives.get(id)!.get(toId)![0]
              return {
                from: { id, name: giver.displayName },
                to: { id: toId, name: receiver.displayName },
                sticker,
              }
            })
            chains.push({ type: 'chain', steps })
          }
          continue
        }

        // Don't revisit within this path (except closing back to start)
        if (path.includes(nextId)) continue

        path.push(nextId)
        dfs(path)
        path.pop()
      }
    }

    dfs([startId])
  }

  // Sort by chain length (shorter = better)
  return chains.sort((a, b) => a.steps.length - b.steps.length).slice(0, 20)
}
