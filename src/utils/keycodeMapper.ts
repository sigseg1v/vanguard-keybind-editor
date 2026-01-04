// Map of keyCode numbers to readable names
const KEYCODE_TO_NAME: Record<number, string> = {
  // Special keys
  8: 'Backspace',
  9: 'Tab',
  13: 'Enter',
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',

  // Numbers 0-9
  48: '0', 49: '1', 50: '2', 51: '3', 52: '4',
  53: '5', 54: '6', 55: '7', 56: '8', 57: '9',

  // Letters A-Z
  65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E',
  70: 'F', 71: 'G', 72: 'H', 73: 'I', 74: 'J',
  75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O',
  80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T',
  85: 'U', 86: 'V', 87: 'W', 88: 'X', 89: 'Y',
  90: 'Z',

  // Numpad
  96: 'Numpad0', 97: 'Numpad1', 98: 'Numpad2', 99: 'Numpad3', 100: 'Numpad4',
  101: 'Numpad5', 102: 'Numpad6', 103: 'Numpad7', 104: 'Numpad8', 105: 'Numpad9',
  106: 'Multiply', 107: 'Add', 109: 'Subtract', 110: 'Decimal', 111: 'Divide',

  // Function keys
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4',
  116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8',
  120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',

  // Symbols
  186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/',
  192: '`', 219: '[', 220: '\\', 221: ']', 222: "'",
}

// Reverse map for name to keyCode
const NAME_TO_KEYCODE = Object.fromEntries(
  Object.entries(KEYCODE_TO_NAME).map(([code, name]) => [name, parseInt(code)])
)

/**
 * Convert a numeric keycode to a readable key name
 */
export function keycodeToName(code: number): string {
  return KEYCODE_TO_NAME[code] || `Key${code}`
}

/**
 * Convert a key name to numeric keycode
 */
export function nameToKeycode(name: string): number | undefined {
  return NAME_TO_KEYCODE[name]
}

/**
 * Extract keycode from a KeyboardEvent
 * Handles deprecated keyCode and modern event.key/event.code
 */
export function eventToKeycode(event: KeyboardEvent): number {
  // First try direct keyCode (deprecated but still present in most browsers)
  if (event.keyCode && event.keyCode !== 0) {
    return event.keyCode
  }

  // Try to map from event.key to keycode
  const keycode = nameToKeycode(event.key)
  if (keycode !== undefined) {
    return keycode
  }

  // For single character keys, use charCodeAt
  if (event.key.length === 1) {
    const char = event.key.toUpperCase()
    const code = char.charCodeAt(0)
    // If it's A-Z or 0-9, use the code
    if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
      return code
    }
  }

  // Fallback for unknown keys
  return 0
}
