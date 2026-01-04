<template>
  <v-btn
    :color="localCapturing ? 'success' : 'primary'"
    :variant="localCapturing ? 'elevated' : 'tonal'"
    @click="handleClick"
    class="key-capture-btn"
  >
    <template v-if="localCapturing">
      <v-icon start>mdi-keyboard</v-icon>
      Press a key... (ESC to cancel)
    </template>
    <template v-else>
      {{ keyName }}
    </template>
  </v-btn>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useKeyCapture } from '@/composables/useKeyCapture'
import { keycodeToName } from '@/utils/keycodeMapper'

defineProps<{
  keyCode: number
  keyName: string
}>()

const emit = defineEmits<{
  keyChanged: [keycode: number, keyName: string]
}>()

const { isCapturing, startCapture, stopCapture } = useKeyCapture()
const localCapturing = ref(false)

watch(isCapturing, (newValue) => {
  localCapturing.value = newValue
})

const handleClick = () => {
  if (localCapturing.value) {
    stopCapture()
    return
  }

  localCapturing.value = true
  startCapture((keycode: number) => {
    const newKeyName = keycodeToName(keycode)
    emit('keyChanged', keycode, newKeyName)
    localCapturing.value = false
  })
}
</script>

<style scoped>
.key-capture-btn {
  min-width: 140px;
}
</style>
