<template>
  <v-card class="file-drop-zone" elevation="4">
    <v-card-text class="text-center pa-8">
      <v-icon size="64" color="primary" class="mb-4">mdi-file-upload</v-icon>
      <h2 class="text-h5 mb-4">Vanguard Keybind Editor</h2>
      <p class="text-body-1 mb-6">
        Click to browse for a Vanguard User.ini file
      </p>

      <v-file-input
        v-model="selectedFile"
        accept=".ini"
        label="Select INI file"
        prepend-icon="mdi-file-document"
        variant="outlined"
        @change="handleFileSelect"
        @drop="handleDrop"
        @dragover="handleDragOver"
      />

      <v-alert
        v-if="errorMessage"
        type="error"
        class="mt-4"
        closable
        @click:close="errorMessage = null"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  fileLoaded: [content: string, fileName: string]
}>()

const selectedFile = ref<File | File[] | null>(null)
const errorMessage = ref<string | null>(null)

const handleFileSelect = async () => {
  errorMessage.value = null

  if (!selectedFile.value) return

  // Handle both single file and array (Vuetify can return either)
  const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value

  if (!file || !file.name.endsWith('.ini')) {
    errorMessage.value = 'Please select an INI file (.ini extension)'
    return
  }

  try {
    const content = await file.text()
    emit('fileLoaded', content, file.name)
  } catch (err) {
    errorMessage.value = `Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}
</script>

<style scoped>
.file-drop-zone {
  max-width: 600px;
  margin: 0 auto;
}
</style>
