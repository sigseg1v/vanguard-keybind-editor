# justfile

# Default recipe (list all commands)
default:
    @just --list

# Install dependencies
install:
    npm install

# Run development server
dev:
    npm run dev

# Build for production
build:
    npm run build

# Preview production build
preview:
    npm run preview

# Type check
typecheck:
    npm run typecheck

# Clean build artifacts
clean:
    rm -rf dist node_modules

# Full rebuild
rebuild: clean install build
