<script setup lang="ts">
const router = useRouter()
const creating = ref(false)
const joining = ref(false)
const eventName = ref('')
const joinCode = ref('')
const error = ref('')

async function createEvent() {
  if (!eventName.value.trim()) { error.value = 'Enter an event name'; return }
  creating.value = true; error.value = ''
  try {
    const res = await $fetch<{ id: string; code: string; name: string }>('/api/events', {
      method: 'POST',
      body: { name: eventName.value.trim() },
    })
    router.push(`/events/${res.code}`)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? 'Failed to create event'
  } finally {
    creating.value = false
  }
}

async function joinEvent() {
  const code = joinCode.value.trim().toUpperCase()
  if (!code) { error.value = 'Enter an event code'; return }
  joining.value = true; error.value = ''
  try {
    await $fetch(`/api/events/${code}`)
    router.push(`/events/${code}`)
  } catch {
    error.value = 'Event not found — check the code'
  } finally {
    joining.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <div class="text-6xl mb-3">🏆</div>
        <h1 class="text-3xl font-bold text-gray-900">Sticker Swap</h1>
        <p class="text-gray-500 mt-2 text-sm">Find perfect trades at your event</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
        {{ error }}
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <h2 class="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Create Event</h2>
        <input
          v-model="eventName"
          type="text"
          placeholder="Event name…"
          maxlength="50"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          @keyup.enter="createEvent"
        />
        <button
          :disabled="creating"
          class="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
          @click="createEvent"
        >
          {{ creating ? 'Creating…' : '✨ Create Event' }}
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 class="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Join Event</h2>
        <input
          v-model="joinCode"
          type="text"
          placeholder="Event code (e.g. ABC123)"
          maxlength="6"
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-base uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
          @keyup.enter="joinEvent"
        />
        <button
          :disabled="joining"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
          @click="joinEvent"
        >
          {{ joining ? 'Joining…' : '🎟 Join Event' }}
        </button>
      </div>
    </div>
  </div>
</template>
