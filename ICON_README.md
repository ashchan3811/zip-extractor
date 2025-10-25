# Icon Generation - Quick Reference

## Generate Icons in One Command

```bash
npm run generate-icons
```

This generates:
- ✅ `assets/icons/icon.ico` - Windows icon (all sizes)
- ✅ `assets/icons/icon.icns` - macOS icon (all sizes)  
- ✅ `assets/icons/*.png` - Individual size variants

## Requirements

**Source image**: `assets/icon-source.png`
- **Format**: PNG with transparency
- **Size**: 1024x1024 pixels (recommended)
- **Minimum**: 512x512 pixels

## Quick Workflow

1. **Create/replace** your icon:
   ```bash
   # Place your 1024x1024 PNG here
   assets/icon-source.png
   ```

2. **Generate** platform icons:
   ```bash
   npm run generate-icons
   ```

3. **Build** with new icons:
   ```bash
   npm run make:win
   ```

## Generated Files

```
assets/
├── icon-source.png       ← Your master icon (1024x1024)
└── icons/
    ├── icon.ico          ← Windows (used in builds)
    ├── icon.icns         ← macOS (used in builds)
    ├── 16x16.png
    ├── 24x24.png
    ├── 32x32.png
    ├── 48x48.png
    ├── 64x64.png
    ├── 128x128.png
    ├── 256x256.png
    ├── 512x512.png
    └── 1024x1024.png
```

## Icon Design Tips

### ✅ Do
- Use simple, bold shapes
- Test at 16x16 size
- Use transparent background
- Center with padding
- Keep design flat/minimal

### ❌ Don't
- Don't use thin lines
- Don't add text
- Don't use gradients
- Don't place items at edges

## Packages Installed

- **electron-icon-builder** - Main icon generator
- **icon-gen** - Alternative/manual icon generation

## See Full Guide

For detailed instructions, design tips, and troubleshooting:

📖 **[ICON_GUIDE.md](./ICON_GUIDE.md)**

---

**That's it!** Just replace `icon-source.png` and run `npm run generate-icons` 🎨

