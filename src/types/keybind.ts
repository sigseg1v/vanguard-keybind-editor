export interface Keybind {
  index: number        // Original array index from INI (e.g., 0 from Bindings[0])
  key: number          // Numeric keycode (e.g., 38 for ArrowUp)
  keyName: string      // Readable display name (e.g., "ArrowUp")
  ctrl: boolean
  alt: boolean
  shift: boolean
  command: string      // e.g., "MoveForward"
}
