# Build Guide - ZIP Extractor

This guide explains how to build Windows executables from macOS.

## Prerequisites

- Node.js and npm installed
- All dependencies installed (`npm install`)

## Quick Start - Build Windows Executable from Mac

The easiest way to build for Windows from Mac:

```bash
npm run make:win
```

✅ **This works without any additional tools!**

The output will be at:
```
out/make/zip/win32/x64/ZIP Extractor-win32-x64-1.0.0.zip
```

## All Build Commands

### Windows Builds (from Mac)

```bash
# Build Windows x64 (most common) - Creates ZIP
npm run make:win

# Build Windows ARM64 - Creates ZIP  
npm run make:win-arm

# Build Windows installer (requires Wine & Mono on Mac)
npm run make:win-installer
```

### Other Platforms

```bash
# Build for macOS
npm run make:mac

# Build for Linux
npm run make:linux

# Build for all platforms
npm run make
```

### Package Only (No Distribution Archive)

```bash
# Package for Windows (no ZIP)
npm run package:win

# Package for macOS (no ZIP)
npm run package:mac
```

## Output Files

After running `npm run make:win`, you'll find:

### Windows Distribution
**Location**: `out/make/zip/win32/x64/ZIP Extractor-win32-x64-1.0.0.zip`
- **Size**: ~108 MB
- **Architecture**: x64 (Intel/AMD processors)
- **Format**: Portable ZIP archive

### Packaged App (Unzipped)
**Location**: `out/ZIP Extractor-win32-x64/`
- Contains `zip-extractor.exe` and all dependencies
- This is what's inside the ZIP file

## How to Distribute

### Method 1: ZIP File (Recommended for Mac → Windows builds)

1. Share the ZIP file: `ZIP Extractor-win32-x64-1.0.0.zip`
2. Users extract the ZIP
3. Users run `zip-extractor.exe` inside
4. No installation required!

**Pros:**
- ✅ Works cross-platform (build from Mac)
- ✅ No installer needed
- ✅ Portable - can run from USB drive
- ✅ No admin rights required

**Cons:**
- ❌ Users must extract manually
- ❌ No Start Menu shortcuts
- ❌ No auto-updates

### Method 2: Windows Installer (Requires Wine/Mono on Mac)

To create a Windows installer from Mac:

1. **Install Wine and Mono** (one-time setup):
   ```bash
   # Using Homebrew
   brew install --cask wine-stable
   brew install mono
   ```

2. **Build installer**:
   ```bash
   npm run make:win-installer
   ```

3. **Output location**:
   ```
   out/make/squirrel.windows/x64/zip-extractor-1.0.0 Setup.exe
   ```

**Pros:**
- ✅ Professional installer experience
- ✅ Start Menu shortcuts
- ✅ Uninstaller included
- ✅ Desktop icons

**Cons:**
- ❌ Requires Wine/Mono setup on Mac
- ❌ Slower build process
- ❌ More complex troubleshooting

## Testing Your Build

### On Windows:

1. Transfer the ZIP file to a Windows PC
2. Extract it
3. Run `zip-extractor.exe`
4. Test all features

### File Size

- **Typical size**: 100-120 MB
- **Why so large?**: Includes Chromium and Node.js
- **This is normal** for Electron apps

## Architecture Support

### x64 (Intel/AMD) - Default
- Most common Windows PCs
- Intel and AMD processors
- Built with: `npm run make:win`

### ARM64 (ARM processors)
- Surface Pro X, other ARM Windows devices
- Built with: `npm run make:win-arm`

## Project Structure After Build

```
zip-extractor/
├── out/
│   ├── ZIP Extractor-win32-x64/      ← Packaged app (extracted)
│   │   ├── zip-extractor.exe         ← Main executable
│   │   ├── resources/                ← App resources
│   │   └── ...
│   └── make/
│       ├── zip/
│       │   └── win32/
│       │       └── x64/
│       │           └── ZIP Extractor-win32-x64-1.0.0.zip  ← DISTRIBUTE THIS
│       └── squirrel.windows/         ← Only if using installer
│           └── x64/
│               └── zip-extractor-1.0.0 Setup.exe
├── src/
├── package.json
└── ...
```

## Clean Builds

To start fresh:

```bash
# Remove output directory
rm -rf out/

# Rebuild
npm run make:win
```

## Troubleshooting

### Error: "Cannot find module"
**Solution**: Run `npm install`

### Error: "EACCES: permission denied"
**Solution**: Check file permissions or run without sudo

### Build is slow
**Normal**: First build downloads ~100MB of Electron binaries
**Subsequent builds**: Much faster due to caching

### ZIP file won't open on Windows
**Solution**: Use 7-Zip or WinRAR if Windows built-in extractor fails

### .exe won't run on Windows
**Common causes**:
1. **Windows Defender blocking**: Right-click → "Run anyway"
2. **Missing Visual C++ Runtime**: Windows usually auto-installs
3. **32-bit vs 64-bit**: Make sure using x64 build for 64-bit Windows

## Advanced: Custom Icons

To add a custom app icon:

1. Create `assets/` folder:
   ```bash
   mkdir assets
   ```

2. Add icons:
   - `icon.ico` - Windows (256x256 or multiple sizes)
   - `icon.icns` - macOS
   - `icon.png` - Linux (512x512)

3. Update `forge.config.js` to uncomment icon paths

4. Rebuild

## Version Updates

To release a new version:

1. Edit `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Rebuild:
   ```bash
   npm run make:win
   ```

3. New file will be:
   ```
   ZIP Extractor-win32-x64-1.0.1.zip
   ```

## CI/CD (GitHub Actions)

For automated builds on every commit:

Create `.github/workflows/build.yml`:

```yaml
name: Build Windows App

on:
  push:
    branches: [ main, build-electron ]
  pull_request:
    branches: [ main ]

jobs:
  build-windows:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Windows app
        run: npm run make:win
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: windows-build
          path: out/make/zip/win32/x64/*.zip
```

This automatically builds on Windows runners (no Wine needed).

## Performance Tips

### Faster Builds
- Use `--arch=x64` instead of building all architectures
- Use `--targets=@electron-forge/maker-zip` instead of all makers
- Clear `out/` folder between major changes

### Smaller Builds
- Remove unused dependencies
- Use `asar` packaging (already enabled)
- Don't bundle devDependencies (already configured)

## Support Resources

- **Electron Forge Docs**: https://www.electronforge.io/
- **Electron Docs**: https://www.electronjs.org/docs
- **This Project**: Check README.md for app-specific info

## Summary

**Recommended workflow from Mac**:

1. Run: `npm run make:win`
2. Find: `out/make/zip/win32/x64/ZIP Extractor-win32-x64-1.0.0.zip`
3. Share with Windows users
4. They extract and run `zip-extractor.exe`

✅ **Works perfectly without Wine or additional tools!**

