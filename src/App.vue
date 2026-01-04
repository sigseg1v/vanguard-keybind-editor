<template>
  <v-app>
    <v-app-bar color="primary" elevation="4">
      <v-toolbar-title>
        <v-icon size="large" class="mr-2">mdi-gamepad-variant</v-icon>
        Vanguard Keybind Editor
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="fileName"
        icon="mdi-close"
        @click="handleReset"
        title="Load new file"
      />
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <v-alert
          v-if="error"
          type="error"
          closable
          class="mb-4"
          @click:close="error = null"
        >
          {{ error }}
        </v-alert>

        <FileDropZone
          v-if="!fileName"
          @file-loaded="handleFileLoaded"
        />

        <template v-else>
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <v-chip color="primary" variant="outlined" class="mr-2">
                <v-icon start>mdi-file-document</v-icon>
                {{ fileName }}
              </v-chip>
            </div>
            <ExportButton @export="handleExport" />
          </div>

          <KeybindList
            :keybinds="keybinds"
            @update="handleKeybindUpdate"
          />
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import FileDropZone from '@/components/FileDropZone.vue'
import KeybindList from '@/components/KeybindList.vue'
import ExportButton from '@/components/ExportButton.vue'
import { useIniParser } from '@/composables/useIniParser'
import { downloadFile } from '@/utils/fileDownload'
import type { Keybind } from '@/types/keybind'

const {
  keybinds,
  fileName,
  error,
  loadIniFile,
  exportIniFile,
  updateKeybind,
  reset
} = useIniParser()

const handleFileLoaded = (content: string, name: string) => {
  loadIniFile(content, name)
}

const handleKeybindUpdate = (index: number, updates: Partial<Keybind>) => {
  updateKeybind(index, updates)
}

const handleExport = () => {
  const content = exportIniFile()
  if (content) {
    downloadFile(content, fileName.value)
  }
}

const handleReset = () => {
  reset()
}
</script>

<style>
/* Global styles */
html {
  overflow-y: auto;
}
</style>
