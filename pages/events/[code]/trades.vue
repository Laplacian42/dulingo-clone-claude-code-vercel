<script setup lang="ts">
import type { DirectTrade, Donation, TradeChain } from '~/server/utils/matching'

const route = useRoute()
const router = useRouter()
const code = computed(() => (route.params.code as string).toUpperCase())

const loading = ref(true)
const event = ref<{ id: string; name: string } | null>(null)
const participantId = ref<string | null>(null)
const displayName = ref<string | null>(null)
const trades = ref<{ directTrades: DirectTrade[]; donations: Donation[]; chains: TradeChain[] } | null>(null)
const error = ref('')

async function loadTrades() {
  if (!event.value || !participantId.value) return
  try {
    trades.value = await $fetch<{ directTrades: DirectTrade[]; donations: Donation[]; chains: TradeChain[] }>(
      `/api/events/${event.value.id}/trades?participantId=${participantId.value}`,
    )
  } catch {
    error.value = 'Failed to load trades'
  }
}

onMounted(async () => {
  try {
    event.value = await $fetch<{ id: string; name: string }>(`/api/events/${code.value}`)
    const all = JSON.parse(localStorage.getItem('ssm_participants') ?? '{}')
    const p = all[event.value.id]
    if (!p) { router.push(`/events/${code.value}`); return }
    participantId.value = p.id
    displayName.value = p.displayName
    await loadTrades()
  } catch {
    error.value = 'Failed to load'
  } finally {
    loading.value = false
  }
})

usePolling(loadTrades, 7000)

function otherName(trade: DirectTrade) {
  return trade.participantA.id === participantId.value
    ? trade.participantB.name
    : trade.participantA.name
}

function iGive(trade: DirectTrade) {
  return trade.participantA.id === participantId.value ? trade.aGivesB : trade.bGivesA
}

function iGet(trade: DirectTrade) {
  return trade.participantA.id === participantId.value ? trade.bGivesA : trade.aGivesB
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button class="text-blue-600 font-medium text-sm" @click="router.push(`/events/${code}`)">← Event</button>
        <div class="flex-1 text-center font-bold text-gray-900 text-sm">Trade Suggestions</div>
        <NuxtLink :to="`/events/${code}/collection`" class="text-blue-600 text-sm font-medium">Collection</NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">Finding trades…</div>
    <div v-else-if="error" class="text-center py-16 text-red-500">{{ error }}</div>

    <template v-else-if="trades">
      <div class="px-4 py-3 max-w-lg mx-auto space-y-5">

        <!-- Direct trades -->
        <section>
          <h2 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span class="text-lg">↔️</span> Direct Trades
            <span class="ml-auto text-xs text-gray-400 font-normal">{{ trades.directTrades.length }}</span>
          </h2>
          <div v-if="trades.directTrades.length === 0" class="text-gray-400 text-sm text-center py-4 bg-white rounded-2xl border border-gray-100">
            No direct trades yet — add your sticker states
          </div>
          <div v-for="trade in trades.directTrades" :key="`${trade.participantA.id}-${trade.participantB.id}`"
            class="bg-white rounded-2xl border border-gray-100 p-4 mb-2">
            <div class="flex items-center justify-between font-semibold text-gray-900 mb-3">
              <span>{{ trade.participantA.name }}</span>
              <span class="text-blue-500 text-xl">⇄</span>
              <span>{{ trade.participantB.name }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="bg-blue-50 rounded-xl p-2">
                <p class="text-xs text-gray-500 mb-1">{{ trade.participantA.name }} gives:</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in trade.aGivesB" :key="s"
                    class="bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 font-mono text-xs">{{ s }}</span>
                </div>
              </div>
              <div class="bg-green-50 rounded-xl p-2">
                <p class="text-xs text-gray-500 mb-1">{{ trade.participantB.name }} gives:</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="s in trade.bGivesA" :key="s"
                    class="bg-green-100 text-green-800 rounded px-1.5 py-0.5 font-mono text-xs">{{ s }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Donations -->
        <section v-if="trades.donations.length > 0">
          <h2 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span class="text-lg">🤝</span> You Can Help
            <span class="ml-auto text-xs text-gray-400 font-normal">{{ trades.donations.length }}</span>
          </h2>
          <div v-for="d in trades.donations" :key="d.to.id"
            class="bg-white rounded-2xl border border-yellow-100 p-4 mb-2">
            <p class="font-semibold text-gray-900 mb-2">You can give <span class="text-yellow-700">{{ d.to.name }}</span>:</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="s in d.stickers" :key="s"
                class="bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 font-mono text-xs">{{ s }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-2">They have nothing you need right now — but you could still help them!</p>
          </div>
        </section>

        <!-- Trade chains -->
        <section v-if="trades.chains.length > 0">
          <h2 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span class="text-lg">🔗</span> Trade Chains
            <span class="ml-auto text-xs text-gray-400 font-normal">{{ trades.chains.length }}</span>
          </h2>
          <div v-for="(chain, ci) in trades.chains" :key="ci"
            class="bg-white rounded-2xl border border-purple-100 p-4 mb-2">
            <div class="flex flex-wrap items-center gap-1 text-sm font-medium text-gray-800 mb-3">
              <template v-for="(step, si) in chain.steps" :key="si">
                <span>{{ step.from.name }}</span>
                <span class="text-purple-400 text-xs">→</span>
              </template>
              <span>{{ chain.steps[0].from.name }}</span>
            </div>
            <div class="space-y-1">
              <div v-for="(step, si) in chain.steps" :key="si" class="flex items-center gap-2 text-xs">
                <span class="font-semibold text-gray-700">{{ step.from.name }}</span>
                <span class="text-gray-400">gives</span>
                <span class="bg-purple-100 text-purple-800 rounded px-1.5 font-mono">{{ step.sticker }}</span>
                <span class="text-gray-400">to</span>
                <span class="font-semibold text-gray-700">{{ step.to.name }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Empty state -->
        <div v-if="trades.directTrades.length === 0 && trades.donations.length === 0 && trades.chains.length === 0"
          class="text-center py-12">
          <div class="text-5xl mb-3">🔍</div>
          <p class="text-gray-700 font-semibold">No trades found yet</p>
          <p class="text-gray-500 text-sm mt-1">Add your sticker states and wait for others to join</p>
        </div>

        <p class="text-xs text-gray-400 text-center pb-2">Auto-refreshes every 7 seconds</p>
      </div>
    </template>
  </div>
</template>
