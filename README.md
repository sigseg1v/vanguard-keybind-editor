# Vanguard Keybind Editor

A modern web-based editor for Vanguard game keybindings using Vue 3, TypeScript, and Vuetify.

## Features

- Drag-and-drop INI file upload
- Visual keybind editor with click-to-capture key input
- Modifier key support (Ctrl, Alt, Shift)
- Preserves all original INI file content (comments, sections, etc.)
- Export modified INI file
- Material Design UI with dark mode

## Quick Start

```bash
# Install dependencies
just install

# Run development server
just dev

# Build for production
just build

# Preview production build
just preview
```

## Usage

1. Open the application in your browser
2. Drop your INI file into the upload zone (or use the file picker)
3. Edit keybindings by clicking on the key button and pressing a new key
4. Toggle modifier keys (Ctrl, Alt, Shift) with checkboxes
5. Click "Export INI File" to download your modified configuration

## File Format

The application supports INI files with keybindings in the format:

```ini
Bindings[0]=(Key=38,Ctrl=False,Alt=False,Shift=False,Command=MoveForward)
```

Where:
- `Key=38` is the numeric keycode (38 = ArrowUp)
- `Ctrl`, `Alt`, `Shift` are modifier keys (True/False)
- `Command` is the action name

## Tech Stack

- Vue 3 with Composition API
- TypeScript for type safety
- Vuetify 3 for Material Design components
- Vite for fast development and building
- Just for task running

## Sample File

A sample INI file is included at `sample-keybinds.ini` for testing.
