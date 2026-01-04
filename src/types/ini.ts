export interface IniLine {
  type: 'section' | 'binding' | 'other' | 'comment' | 'blank'
  raw: string          // Original line preserved exactly
  lineNumber: number
  parsed?: BindingData | SectionData
}

export interface BindingData {
  index: number        // e.g., 0 from Bindings[0]
  key?: number          // e.g., 38
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  defaultCtrl?: boolean
  defaultAlt?: boolean
  defaultShift?: boolean
  default?: number
  command: string      // e.g., "MoveForward"
}

export interface SectionData {
  name: string
}

export interface IniStructure {
  lines: IniLine[]            // Every line preserved
  bindingIndices: number[]    // Line numbers where bindings are
}
