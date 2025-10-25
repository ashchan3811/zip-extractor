# Build Guide - ZIP Extractor

This guide explains how to build Windows executables from macOS.

## Prerequisites

- Node.js and npm installed
- All dependencies installed (`npm install`)

## Build Commands

### Build Windows Executable (from Mac)

To create a Windows executable (.exe) from your Mac:

```bash
npm run make:win
```

This will:
- Package your app for Windows (win32)
- Create a Windows installer using Squirrel
- Output files to the `out/` directory

### Build for Other Platforms

```bash
# Build for macOS
npm run make:mac

# Build for Linux
npm run make:linux

# Build for all platforms
npm run make
```

### Package Only (No Installer)

If you only want to package without creating an installer:

```bash
# Package for Windows
npm run package:win

# Package for macOS
npm run package:mac
```

## Output Location

All built files will be in the `out/` directory:

```
out/
├── make/
│   ├── squirrel.windows/
│   │   └── x64/
│   │       ├── zip-extractor-1.0.0 Setup.exe  ← Windows Installer
│   │       └── RELEASES
│   └── zip/
│       └── win32/
│           └── zip-extractor-win32-x64-1.0.0.zip
└── zip-extractor-win32-x64/  ← Packaged app
```

## Installation Files

### Windows
- **Installer**: `out/make/squirrel.windows/x64/zip-extractor-1.0.0 Setup.exe`
- **Portable ZIP**: `out/make/zip/win32/zip-extractor-win32-x64-1.0.0.zip`

### macOS
- **ZIP**: `out/make/zip-extractor-darwin-x64-1.0.0.zip`

## Cross-Platform Building

### Building Windows from Mac ✅
- **Works**: Yes, fully supported
- **Requirements**: None additional
- **Output**: Windows .exe installer

### Building Mac from Windows ❌
- **Works**: No, requires macOS
- **Why**: Code signing and app bundling require macOS

### Building Linux from Mac/Windows ⚠️
- **Works**: Partially
- **Limitations**: Some Linux-specific tools may not work perfectly

## Testing the Build

After building for Windows:

1. **Transfer to Windows PC**: Copy the `.exe` file to a Windows machine
2. **Test Installation**: Run the installer
3. **Test Functionality**: Verify all features work correctly

## Troubleshooting

### Error: "Cannot build for win32 on darwin"
**Solution**: This shouldn't happen with Electron Forge. Ensure you're using the correct commands.

### Error: "Cannot find module"
**Solution**: Run `npm install` to ensure all dependencies are installed.

### Build takes a long time
**Reason**: Cross-platform builds need to download platform-specific binaries.
**Solution**: First build will be slow, subsequent builds are faster.

### Output files are very large
**Reason**: Electron bundles Chromium and Node.js.
**Solution**: This is normal. Typical size is 80-150MB.

## Optimizing Builds

### Reduce Build Size

1. **Remove unused dependencies**: Check `package.json`
2. **Use asar**: Already enabled in config
3. **Exclude dev dependencies**: Already configured

### Speed Up Builds

1. **Cache**: Electron Forge caches downloads
2. **Target specific architecture**: Add `--arch=x64` flag
3. **Skip unused platforms**: Use platform-specific commands

## Icons (Optional)

To add custom icons:

1. Create `assets/` folder in project root
2. Add icons:
   - `icon.ico` for Windows (256x256)
   - `icon.icns` for macOS
   - `icon.png` for Linux (512x512)
3. Rebuild the app

## CI/CD Integration

For automated builds, use GitHub Actions:

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run make:win
      - uses: actions/upload-artifact@v3
        with:
          name: windows-installer
          path: out/make/squirrel.windows/x64/*.exe
```

## Distribution

### Windows
- Share the `.exe` installer file
- Users download and run it
- App installs to `%LOCALAPPDATA%/zip-extractor/`

### macOS
- Share the `.zip` file
- Users extract and drag to Applications
- May need to allow app in System Preferences > Security

## Version Updates

To release a new version:

1. Update version in `package.json`
2. Run build command
3. New version number appears in filename
4. Distribute new installer

## Support

For issues with building, check:
- [Electron Forge Documentation](https://www.electronforge.io/)
- [Electron Documentation](https://www.electronjs.org/)

