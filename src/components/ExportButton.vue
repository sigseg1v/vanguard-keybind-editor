<template>
  <v-btn
    color="success"
    size="large"
    prepend-icon="mdi-download"
    @click="handleExport"
  >
    Export INI File
  </v-btn>

  <v-snackbar v-model="showSuccess" color="success" timeout="3000">
    INI file exported successfully!
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  export: []
}>()

const showSuccess = ref(false)

const handleExport = () => {
  emit('export')
  showSuccess.value = true
}
</script>
