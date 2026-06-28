<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const code = computed(() => (route.params.code as string).toUpperCase())

interface EventData {
  id: string; code: string; name: string; participantCount: number
}

const event = ref<EventData | null>(null)
const loading = ref(true)
const notFound = ref(false)
const displayName = ref('')
const joining = ref(false)
const joinError = ref('')
const joined = ref(false)
const showQR = ref(false)
const eventUrl = ref('')

onMounted(async () => {
  eventUrl.value = window.location.href
  try {
    event.value = await $fetch<EventData>(`/api/events/${code.value}`)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }

  // Check if already in this event
  const all = JSON.parse(localStorage.getItem('ssm_participants') ?? '{}')
  if (event.value && all[event.value.id]) {
    joined.value = true
  }
})

async function joinEvent() {
  if (!displayName.value.trim()) { joinError.value = 'Enter your name'; return }
  if (!event.value) return
  joining.value = true; joinError.value = ''
  try {
    const all = JSON.parse(localStorage.getItem('ssm_participants') ?? '{}')
    const existing = all[event.value.id]
    const res = await $fetch<{ id: string; displayName: string; eventId: string }>(
      `/api/events/${event.value.id}/participants`,
      { method: 'POST', body: { displayName: displayName.value.trim(), participantId: existing?.id } },
    )
    const updated = { ...all, [event.value.id]: { id: res.id, displayName: res.displayName, eventId: event.value.id } }
    localStorage.setItem('ssm_participants', JSON.stringify(updated))
    joined.value = true
    event.value!.participantCount++
  } catch {
    joinError.value = 'Failed to join event'
  } finally {
    joining.value = false
  }
}

function share() {
  if (navigator.share) {
    navigator.share({ title: `Join ${event.value?.name}`, url: eventUrl.value })
  } else {
    navigator.clipboard.writeText(eventUrl.value).catch(() => {})
    alert('Link copied!')
  }
}

function participantId() {
  if (!event.value) return ''
  const all = JSON.parse(localStorage.getItem('ssm_participants') ?? '{}')
  return all[event.value.id]?.id ?? ''
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      <button class="text-blue-600 font-medium text-sm" @click="router.push('/')">← Back</button>
      <div class="flex-1 text-center font-bold text-gray-900 truncate">{{ event?.name ?? 'Loading…' }}</div>
      <button v-if="event" class="text-sm text-gray-500" @click="share">Share</button>
    </div>

    <div class="max-w-sm mx-auto p-4">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-16 text-gray-400">Loading…</div>

      <!-- Not found -->
      <div v-else-if="notFound" class="text-center py-16">
        <div class="text-5xl mb-3">🔍</div>
        <p class="text-gray-700 font-semibold">Event not found</p>
        <p class="text-gray-500 text-sm mt-1">Check the code and try again</p>
        <button class="mt-4 text-blue-600 font-medium" @click="router.push('/')">Go home</button>
      </div>

      <!-- Event info -->
      <template v-else-if="event">
        <!-- Event card -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <div class="text-4xl text-center mb-2">🏷️</div>
          <h1 class="text-xl font-bold text-center text-gray-900">{{ event.name }}</h1>
          <div class="text-center mt-2">
            <span class="inline-block bg-blue-50 text-blue-700 font-mono text-2xl font-bold tracking-widest px-4 py-1 rounded-xl">
              {{ event.code }}
            </span>
          </div>
          <p class="text-center text-gray-500 text-sm mt-2">{{ event.participantCount }} participant{{ event.participantCount !== 1 ? 's' : '' }}</p>
          <div class="flex gap-2 mt-4">
            <button class="flex-1 border border-blue-200 text-blue-700 text-sm font-medium py-2 rounded-xl active:scale-95 transition-transform" @click="share">
              📤 Share
            </button>
            <button class="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl active:scale-95 transition-transform" @click="showQR = !showQR">
              📷 QR Code
            </button>
          </div>
        </div>

        <!-- QR placeholder -->
        <div v-if="showQR" class="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-center">
          <p class="text-gray-500 text-sm mb-2">Scan to join:</p>
          <div class="font-mono text-xs text-gray-700 bg-gray-50 rounded p-2 break-all">{{ eventUrl }}</div>
          <p class="text-xs text-gray-400 mt-2">Copy link above to generate a QR code</p>
        </div>

        <!-- Join form (if not joined) -->
        <div v-if="!joined" class="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 class="font-semibold text-gray-800 mb-3">Enter your name to join</h2>
          <div v-if="joinError" class="text-red-600 text-sm mb-2">{{ joinError }}</div>
          <input
            v-model="displayName"
            type="text"
            placeholder="Your name…"
            maxlength="30"
            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            @keyup.enter="joinEvent"
          />
          <button
            :disabled="joining"
            class="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
            @click="joinEvent"
          >
            {{ joining ? 'Joining…' : '👋 Join' }}
          </button>
        </div>

        <!-- Navigation (if joined) -->
        <div v-if="joined" class="space-y-3">
          <p class="text-center text-green-600 font-medium text-sm">✓ You've joined this event</p>
          <NuxtLink
            :to="`/events/${event.code}/collection`"
            class="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 active:scale-95 transition-transform"
          >
            <span class="text-2xl">📋</span>
            <div>
              <div class="font-semibold text-gray-900">My Collection</div>
              <div class="text-gray-500 text-sm">Track missing &amp; duplicate stickers</div>
            </div>
            <span class="ml-auto text-gray-400">›</span>
          </NuxtLink>
          <NuxtLink
            :to="`/events/${event.code}/trades`"
            class="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 active:scale-95 transition-transform"
          >
            <span class="text-2xl">🔄</span>
            <div>
              <div class="font-semibold text-gray-900">Trade Suggestions</div>
              <div class="text-gray-500 text-sm">Find perfect swaps with others</div>
            </div>
            <span class="ml-auto text-gray-400">›</span>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
