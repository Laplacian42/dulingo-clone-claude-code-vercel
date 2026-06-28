<script setup lang="ts">
import { TEAMS } from '~/server/utils/catalog'

const route = useRoute()
const router = useRouter()
const code = computed(() => (route.params.code as string).toUpperCase())

const loading = ref(true)
const saving = ref<string | null>(null)
const searchQuery = ref('')
const event = ref<{ id: string; name: string } | null>(null)
const participantId = ref<string | null>(null)
const displayName = ref<string | null>(null)
const stateMap = ref<Record<string, string>>({})
const error = ref('')

type StickerState = 'missing' | 'owned' | 'duplicate'
const STATE_CYCLE: Record<string, StickerState> = {
  missing: 'owned',
  owned: 'duplicate',
  duplicate: 'missing',
}

onMounted(async () => {
  try {
    event.value = await $fetch<{ id: string; name: string }>(`/api/events/${code.value}`)
    const all = JSON.parse(localStorage.getItem('ssm_participants') ?? '{}')
    const p = all[event.value.id]
    if (!p) { router.push(`/events/${code.value}`); return }
    participantId.value = p.id
    displayName.value = p.displayName
    stateMap.value = await $fetch<Record<string, string>>(
      `/api/events/${event.value.id}/stickers?participantId=${p.id}`,
    )
  } catch {
    error.value = 'Failed to load collection'
  } finally {
    loading.value = false
  }
})

async function toggle(stickerId: string) {
  if (!event.value || !participantId.value) return
  const current = (stateMap.value[stickerId] ?? 'missing') as StickerState
  const next = STATE_CYCLE[current]
  stateMap.value[stickerId] = next
  saving.value = stickerId
  try {
    await $fetch(`/api/events/${event.value.id}/stickers/${stickerId}`, {
      method: 'PUT',
      body: { participantId: participantId.value, state: next },
    })
  } catch {
    stateMap.value[stickerId] = current
  } finally {
    saving.value = null
  }
}

const stateIcon: Record<string, string> = { missing: '○', owned: '●', duplicate: '★' }
const stateColor: Record<string, string> = {
  missing: 'bg-gray-100 text-gray-400',
  owned: 'bg-blue-100 text-blue-700',
  duplicate: 'bg-yellow-100 text-yellow-700',
}

const filteredTeams = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return TEAMS
  return TEAMS.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
})

const stats = computed(() => {
  const vals = Object.values(stateMap.value)
  return {
    owned: vals.filter(v => v === 'owned').length,
    duplicate: vals.filter(v => v === 'duplicate').length,
    missing: vals.filter(v => v === 'missing').length,
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
      <div class="flex items-center gap-3 mb-2">
        <button class="text-blue-600 font-medium text-sm" @click="router.push(`/events/${code}`)">← Event</button>
        <div class="flex-1 text-center font-bold text-gray-900 text-sm">My Collection</div>
        <NuxtLink :to="`/events/${code}/trades`" class="text-blue-600 text-sm font-medium">Trades</NuxtLink>
      </div>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search team…"
        class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">Loading…</div>
    <div v-else-if="error" class="text-center py-16 text-red-500">{{ error }}</div>

    <template v-else>
      <!-- Stats bar -->
      <div class="flex justify-center gap-4 px-4 py-3 bg-white border-b border-gray-100 text-sm">
        <span class="text-blue-700 font-medium">{{ stats.owned }} owned</span>
        <span class="text-yellow-700 font-medium">{{ stats.duplicate }} ★ duplicate</span>
        <span class="text-gray-400">{{ stats.missing }} missing</span>
      </div>

      <!-- Legend -->
      <div class="flex justify-center gap-4 px-4 py-2 text-xs text-gray-500">
        <span>○ Missing → ● Owned → ★ Duplicate → ○</span>
      </div>

      <!-- Teams -->
      <div class="pb-8">
        <div v-for="team in filteredTeams" :key="team.code" class="mb-2">
          <div class="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-50">
            {{ team.code }} — {{ team.name }}
          </div>
          <div class="bg-white px-3 py-2">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="n in team.count"
                :key="`${team.code}-${n}`"
                :class="[
                  'w-10 h-10 rounded-lg text-sm font-bold transition-all active:scale-90',
                  stateColor[(stateMap[`${team.code}-${n}`] ?? 'missing')],
                  saving === `${team.code}-${n}` ? 'opacity-50' : '',
                ]"
                @click="toggle(`${team.code}-${n}`)"
              >
                {{ stateIcon[(stateMap[`${team.code}-${n}`] ?? 'missing')] }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
