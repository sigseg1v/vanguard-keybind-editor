<template>
  <v-card class="keybind-item mb-3" elevation="2">
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" sm="3">
          <div class="text-h6">{{ keybind.command }}</div>
        </v-col>

        <v-col cols="12" sm="3">
          <KeyCaptureButton
            :key-code="keybind.key"
            :key-name="keybind.keyName"
            @key-changed="handleKeyChanged"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <div class="d-flex align-center justify-start">
            <v-checkbox
              :model-value="keybind.ctrl"
              label="Ctrl"
              hide-details
              density="compact"
              class="mr-3"
              @update:model-value="updateModifier('ctrl', $event)"
            />
            <v-checkbox
              :model-value="keybind.alt"
              label="Alt"
              hide-details
              density="compact"
              class="mr-3"
              @update:model-value="updateModifier('alt', $event)"
            />
            <v-checkbox
              :model-value="keybind.shift"
              label="Shift"
              hide-details
              density="compact"
              @update:model-value="updateModifier('shift', $event)"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Keybind } from '@/types/keybind'
import KeyCaptureButton from './KeyCaptureButton.vue'

const props = defineProps<{
  keybind: Keybind
}>()

const emit = defineEmits<{
  update: [index: number, updates: Partial<Keybind>]
}>()

const handleKeyChanged = (keycode: number, keyName: string) => {
  emit('update', props.keybind.index, { key: keycode, keyName })
}

const updateModifier = (modifier: 'ctrl' | 'alt' | 'shift', value: boolean | null) => {
  emit('update', props.keybind.index, { [modifier]: value ?? false })
}
</script>

<style scoped>
.keybind-item {
  transition: all 0.2s ease;
}

.keybind-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
