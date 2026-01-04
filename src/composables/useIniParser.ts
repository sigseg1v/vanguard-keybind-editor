import { ref } from 'vue'
import type { IniStructure } from '@/types/ini'
import type { Keybind } from '@/types/keybind'
import { parseIni, extractKeybinds, serializeIni } from '@/utils/iniParser'

export function useIniParser() {
  const iniStructure = ref<IniStructure | null>(null)
  const keybinds = ref<Keybind[]>([])
  const fileName = ref<string>('')
  const error = ref<string | null>(null)

  const loadIniFile = (content: string, name: string) => {
    try {
      error.value = null
      const parsed = parseIni(content)
      iniStructure.value = parsed
      keybinds.value = extractKeybinds(parsed)
      fileName.value = name

      if (keybinds.value.length === 0) {
        error.value = 'No keybindings found in file. Make sure the file contains Bindings[N] entries.'
      }
    } catch (err) {
      error.value = `Failed to parse INI file: ${err instanceof Error ? err.message : 'Unknown error'}`
      iniStructure.value = null
      keybinds.value = []
    }
  }

  const exportIniFile = (): string | null => {
    if (!iniStructure.value) {
      error.value = 'No INI file loaded'
      return null
    }

    try {
      error.value = null
      return serializeIni(iniStructure.value, keybinds.value)
    } catch (err) {
      error.value = `Failed to export INI file: ${err instanceof Error ? err.message : 'Unknown error'}`
      return null
    }
  }

  const updateKeybind = (index: number, updates: Partial<Keybind>) => {
    const keybind = keybinds.value.find(k => k.index === index)
    if (keybind) {
      Object.assign(keybind, updates)
    }
  }

  const reset = () => {
    iniStructure.value = null
    keybinds.value = []
    fileName.value = ''
    error.value = null
  }

  return {
    iniStructure,
    keybinds,
    fileName,
    error,
    loadIniFile,
    exportIniFile,
    updateKeybind,
    reset
  }
}
