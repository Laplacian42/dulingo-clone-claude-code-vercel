export function usePolling(fn: () => Promise<void> | void, intervalMs = 7000) {
  let timer: ReturnType<typeof setInterval> | null = null

  function start() {
    if (timer) return
    timer = setInterval(fn, intervalMs)
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null }
  }

  onMounted(() => { fn(); start() })
  onUnmounted(stop)

  return { start, stop }
}
