<template>
  <div class="keybind-list">
    <v-card elevation="0" class="mb-4">
      <v-card-title class="text-h4">
        <v-icon start color="primary">mdi-keyboard-variant</v-icon>
        Keybindings
        <v-chip class="ml-3" color="primary">{{ keybinds.length }}</v-chip>
      </v-card-title>
    </v-card>

    <div v-if="keybinds.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey">mdi-information-outline</v-icon>
      <p class="text-h6 mt-4">No keybindings found</p>
    </div>

    <KeybindItem
      v-for="keybind in keybinds"
      :key="keybind.index"
      :keybind="keybind"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import type { Keybind } from '@/types/keybind'
import KeybindItem from './KeybindItem.vue'

defineProps<{
  keybinds: Keybind[]
}>()

const emit = defineEmits<{
  update: [index: number, updates: Partial<Keybind>]
}>()

const handleUpdate = (index: number, updates: Partial<Keybind>) => {
  emit('update', index, updates)
}
</script>
