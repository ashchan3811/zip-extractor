# Quick Start Guide

## Development

Start the app in development mode:

```bash
npm start
```

## Building for Windows (from Mac)

### Simple Method - Just One Command! 🚀

```bash
npm run make:win
```

**Output**: `out/make/zip/win32/x64/ZIP Extractor-win32-x64-1.0.0.zip`

### What You Get

- ✅ A portable Windows application (~108 MB)
- ✅ Works on Windows 10/11 (64-bit)
- ✅ No installation required
- ✅ Built entirely on Mac - no Windows machine needed!

### How to Use

1. **Build**:
   ```bash
   npm run make:win
   ```

2. **Find your file**:
   ```
   out/make/zip/win32/x64/ZIP Extractor-win32-x64-1.0.0.zip
   ```

3. **Share with Windows users**:
   - They extract the ZIP
   - They run `zip-extractor.exe`
   - Done! 🎉

## All Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run app in development mode |
| `npm run make:win` | Build Windows app (x64) |
| `npm run make:win-arm` | Build Windows app (ARM64) |
| `npm run make:mac` | Build macOS app |
| `npm run make:linux` | Build Linux app |
| `npm run package:win` | Package only (no ZIP) |
| `npm run generate-icons` | Generate icons from source PNG |

## Need More Info?

See detailed guides:
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Building for all platforms
- [ICON_GUIDE.md](./ICON_GUIDE.md) - Creating and generating icons

For more details on:
- Detailed build instructions
- Creating Windows installers
- Troubleshooting
- CI/CD setup
- Custom icons
- And more!

## Project Structure

```
zip-extractor/
├── src/
│   ├── main.js           # Electron main process
│   ├── index.html        # UI
│   ├── renderer.js       # Renderer process (unused currently)
│   └── extract-zips.js   # ZIP extraction logic
├── out/                  # Build output (gitignored)
├── package.json          # Dependencies & scripts
├── forge.config.js       # Build configuration
└── BUILD_GUIDE.md        # Detailed build guide
```

## Features

- ✨ Select multiple ZIP files or folders
- 📦 Extract all ZIPs at once
- 🗂️ Option to keep folder structure
- 🎯 Simple, modern UI
- 🚀 Fast extraction with progress logs
- ❌ Remove items from selection list

## Tech Stack

- **Framework**: Electron 32
- **Build Tool**: Electron Forge
- **ZIP Library**: adm-zip
- **UI**: Vanilla JavaScript + CSS

---

**Ready to build?** Just run `npm run make:win` and you're done! 🎊

