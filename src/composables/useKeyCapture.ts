import { ref, onMounted, onUnmounted } from 'vue'
import { eventToKeycode } from '@/utils/keycodeMapper'

export function useKeyCapture() {
  const isCapturing = ref(false)
  const capturedKeycode = ref<number | null>(null)

  let onCaptureCallback: ((keycode: number) => void) | null = null

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isCapturing.value) return

    // Prevent default browser behavior during capture
    event.preventDefault()
    event.stopPropagation()

    // Allow ESC to cancel capture
    if (event.key === 'Escape') {
      stopCapture()
      return
    }

    // Capture the keycode
    const keycode = eventToKeycode(event)
    if (keycode !== 0) {
      capturedKeycode.value = keycode

      // Call the callback if provided
      if (onCaptureCallback) {
        onCaptureCallback(keycode)
      }

      stopCapture()
    }
  }

  const startCapture = (callback?: (keycode: number) => void) => {
    isCapturing.value = true
    capturedKeycode.value = null
    onCaptureCallback = callback || null
  }

  const stopCapture = () => {
    isCapturing.value = false
    onCaptureCallback = null
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown, true)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown, true)
  })

  return {
    isCapturing,
    capturedKeycode,
    startCapture,
    stopCapture
  }
}
