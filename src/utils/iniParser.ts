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
    const rawLine = line // preserve original raw line exactly
    const trimmed = rawLine.trim()

    // Detect binding line robustly:
    // - tolerate leading/trailing whitespace
    // - tolerate CR characters (trim takes care of them)
    // - capture index and everything inside the parentheses
    const bindingMatch = trimmed.match(
      /^\s*Bindings\[(\d+)\]\s*=\s*\(([\s\S]*)\)\s*$/
    )

    if (bindingMatch) {
      const index = parseInt(bindingMatch[1], 10)
      const body = bindingMatch[2].trim()

      // Match key=value pairs where value is either:
      //  - a quoted string (supports escaped quotes) OR
      //  - anything up to the next comma or end
      // This is tolerant of pairs appearing in any order and of missing pairs.
      const pairRe = /([A-Za-z0-9_]+)=("(?:[^"\\]|\\.)*"|[^,)]*)/g
      const pairs: Record<string, string> = {}
      let m: RegExpExecArray | null
      while ((m = pairRe.exec(body)) !== null) {
        const key = m[1]
        let val = (m[2] ?? '').trim()
        if (val.startsWith('"') && val.endsWith('"')) {
          // Remove surrounding quotes and unescape \" sequences
          val = val.slice(1, -1).replace(/\\"/g, '"')
        }
        pairs[key] = val
      }

      const toBool = (v?: string): boolean | undefined => {
        if (v === undefined) return undefined
        const low = v.toLowerCase()
        if (low === 'true' || low === 'false') return low === 'true'
        if (v === '1') return true
        if (v === '0') return false
        return undefined
      }
      const toInt = (v?: string): number | undefined => {
        if (v === undefined) return undefined
        if (/^-?\d+$/.test(v)) return parseInt(v, 10)
        return undefined
      }

      const bindingData: BindingData = {
        index,
        key: toInt(pairs['Key']),
        ctrl: toBool(pairs['Ctrl']),
        alt: toBool(pairs['Alt']),
        shift: toBool(pairs['Shift']),
        defaultCtrl: toBool(pairs['DefaultCtrl']),
        defaultAlt: toBool(pairs['DefaultAlt']),
        defaultShift: toBool(pairs['DefaultShift']),
        default: toInt(pairs['Default']),
        // Keep empty string as empty string (Command=) instead of undefined;
        // if you prefer undefined, change the expression below.
        command: pairs['Command'] ?? undefined
      }

      structure.lines.push({
        type: 'binding',
        raw: rawLine,
        lineNumber: idx,
        parsed: bindingData
      })
      structure.bindingIndices.push(idx)
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      // Section header
      structure.lines.push({
        type: 'section',
        raw: rawLine,
        lineNumber: idx,
        parsed: { name: trimmed.slice(1, -1) }
      })
    } else if (trimmed.startsWith(';') || trimmed.startsWith('#')) {
      // Comment line
      structure.lines.push({
        type: 'comment',
        raw: rawLine,
        lineNumber: idx
      })
    } else if (trimmed === '') {
      // Blank line
      structure.lines.push({
        type: 'blank',
        raw: rawLine,
        lineNumber: idx
      })
    } else {
      // Any other content
      structure.lines.push({
        type: 'other',
        raw: rawLine,
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

      // Defensive defaults: ensure numbers/booleans are defined for UI consumption.
      // If you prefer to keep undefineds, drop the fallback values below.
      const keyVal = binding.key ?? -1
      const ctrlVal = binding.ctrl ?? false
      const altVal = binding.alt ?? false
      const shiftVal = binding.shift ?? false

      keybinds.push({
        index: binding.index,
        key: keyVal,
        keyName: keycodeToName(keyVal),
        ctrl: ctrlVal,
        alt: altVal,
        shift: shiftVal,
        default: binding.default,
        defaultCtrl: binding.defaultCtrl,
        defaultAlt: binding.defaultAlt,
        defaultShift: binding.defaultShift,
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
        // Reconstruct binding line with new values.
        // Keep a consistent ordering for written bindings (you can change order if needed).
        // Command is quoted to be safe (matches most original files).
        const cmdPart = updated.command === undefined
          ? undefined
          : (updated.command === '' ? 'Command=' : `Command="${updated.command.replace(/"/g, '\\"')}"`)

        const parts = [
          (updated.defaultCtrl !== undefined ? `DefaultCtrl=${updated.defaultCtrl ? 'True' : 'False'}` : undefined),
          (updated.defaultAlt  !== undefined ? `DefaultAlt=${updated.defaultAlt ? 'True' : 'False'}` : undefined),
          (updated.defaultShift !== undefined ? `DefaultShift=${updated.defaultShift ? 'True' : 'False'}` : undefined),
          (updated.default !== undefined ? `Default=${updated.default}` : undefined),
          `Key=${updated.key}`,
          `Ctrl=${updated.ctrl ? 'True' : 'False'}`,
          `Alt=${updated.alt ? 'True' : 'False'}`,
          `Shift=${updated.shift ? 'True' : 'False'}`,
          cmdPart
        ].filter(x => x !== undefined) as string[]

        return `Bindings[${updated.index}]=(${parts.join(',')})\r`
      }
    }

    // Return all other lines unchanged
    return line.raw
  })

  return reconstructedLines.join('\n')
}