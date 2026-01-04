import type { IniStructure, BindingData } from '@/types/ini'
import type { Keybind } from '@/types/keybind'
import { keycodeToName } from './keycodeMapper'

/**
 * Parse INI file content while preserving ALL lines exactly as they appear
 * Only extracts binding information for editing
 */
export function parseIni(content: string): IniStructure {
  const lines = content.split('\n')
  const structure: IniStructure = {
    lines: [],
    bindingIndices: []
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // Detect binding line with regex
    // Format: Bindings[0]=(Key=38,Ctrl=False,Alt=False,Shift=False,Command="MoveForward")
    // OR:     Bindings[0]=(Key=38,Ctrl=False,Alt=False,Shift=False,Command=MoveForward)
    const bindingMatch = line.match(
      /Bindings\[(\d+)\]=\(Key=(\d+),Ctrl=(True|False),Alt=(True|False),Shift=(True|False),Command=(?:"([^"]*)"|([^)]*)?)\)/
    )

    if (bindingMatch) {
      // Command can be in group 6 (quoted) or group 7 (unquoted)
      const command = bindingMatch[6] !== undefined ? bindingMatch[6] : (bindingMatch[7] || '')

      const bindingData: BindingData = {
        index: parseInt(bindingMatch[1]),
        key: parseInt(bindingMatch[2]),
        ctrl: bindingMatch[3] === 'True',
        alt: bindingMatch[4] === 'True',
        shift: bindingMatch[5] === 'True',
        command: command
      }

      structure.lines.push({
        type: 'binding',
        raw: line,
        lineNumber: idx,
        parsed: bindingData
      })
      structure.bindingIndices.push(idx)
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Section header
      structure.lines.push({
        type: 'section',
        raw: line,
        lineNumber: idx,
        parsed: { name: trimmed.slice(1, -1) }
      })
    } else if (trimmed.startsWith(';') || trimmed.startsWith('#')) {
      // Comment line
      structure.lines.push({
        type: 'comment',
        raw: line,
        lineNumber: idx
      })
    } else if (trimmed === '') {
      // Blank line
      structure.lines.push({
        type: 'blank',
        raw: line,
        lineNumber: idx
      })
    } else {
      // Any other content
      structure.lines.push({
        type: 'other',
        raw: line,
        lineNumber: idx
      })
    }
  })

  return structure
}

/**
 * Extract keybinds from parsed INI structure for UI display
 */
export function extractKeybinds(structure: IniStructure): Keybind[] {
  const keybinds: Keybind[] = []

  for (const line of structure.lines) {
    if (line.type === 'binding' && line.parsed) {
      const binding = line.parsed as BindingData
      keybinds.push({
        index: binding.index,
        key: binding.key,
        keyName: keycodeToName(binding.key),
        ctrl: binding.ctrl,
        alt: binding.alt,
        shift: binding.shift,
        command: binding.command
      })
    }
  }

  return keybinds
}

/**
 * Serialize INI structure back to string, preserving all content
 * Only reconstructs binding lines with updated values
 */
export function serializeIni(structure: IniStructure, updatedBindings: Keybind[]): string {
  // Create a map of binding index to updated data for quick lookup
  const bindingMap = new Map(
    updatedBindings.map(b => [b.index, b])
  )

  // Reconstruct file line by line
  const reconstructedLines = structure.lines.map(line => {
    if (line.type === 'binding' && line.parsed) {
      const originalBinding = line.parsed as BindingData
      const updated = bindingMap.get(originalBinding.index)

      if (updated) {
        // Reconstruct binding line with new values (without quotes to match original format)
        return `Bindings[${updated.index}]=(Key=${updated.key},Ctrl=${updated.ctrl ? 'True' : 'False'},Alt=${updated.alt ? 'True' : 'False'},Shift=${updated.shift ? 'True' : 'False'},Command=${updated.command})`
      }
    }

    // Return all other lines unchanged
    return line.raw
  })

  return reconstructedLines.join('\n')
}
