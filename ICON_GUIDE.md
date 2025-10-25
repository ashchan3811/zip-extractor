# Icon Generation Guide

This guide explains how to create and manage icons for your Electron app across all platforms.

## Quick Start

### 1. Prepare Your Source Icon

Create a **1024x1024 PNG** image and save it as:
```
assets/icon-source.png
```

**Requirements:**
- Format: PNG with transparency
- Size: 1024x1024 pixels (minimum 512x512)
- Content: Should look good when scaled down
- Padding: Leave some padding around edges

### 2. Generate Icons

Run this command to generate all platform-specific icons:

```bash
npm run generate-icons
```

This will create:
- `assets/icon.ico` - Windows icon
- `assets/icon.icns` - macOS icon
- `assets/icon.png` - Linux icon (512x512)

### 3. Rebuild Your App

After generating icons, rebuild to include them:

```bash
npm run make:win
```

## Icon Specifications

### Windows (.ico)
- **Sizes included**: 16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256
- **Format**: ICO with multiple resolutions
- **Used for**: App icon, taskbar, file explorer
- **File**: `assets/icon.ico`

### macOS (.icns)
- **Sizes included**: 16x16 to 1024x1024 (various resolutions)
- **Format**: ICNS with @1x and @2x versions
- **Used for**: App icon, dock, Finder
- **File**: `assets/icon.icns`

### Linux (.png)
- **Size**: 512x512 pixels
- **Format**: PNG with transparency
- **Used for**: App icon, application menu
- **File**: `assets/icon.png`

## Design Tips

### Do's ✅
- Use simple, recognizable shapes
- Ensure icon looks good at small sizes (16x16)
- Use transparent backgrounds
- Keep design centered with padding
- Test on both light and dark backgrounds
- Use vector graphics when possible

### Don'ts ❌
- Don't use thin lines (won't scale well)
- Don't add text (unreadable at small sizes)
- Don't use gradients excessively
- Don't place elements too close to edges
- Don't use too many colors

## Icon Creation Tools

### Free Tools
- **Figma** - https://figma.com (recommended)
- **Inkscape** - Vector graphics editor
- **GIMP** - Raster graphics editor
- **Photopea** - Online Photoshop alternative

### Paid Tools
- **Adobe Illustrator** - Professional vector tool
- **Sketch** - macOS design tool
- **Affinity Designer** - One-time purchase

## Current Icon Setup

Your project currently has:
```
assets/
├── icon-source.png    ← Your master icon (1024x1024)
├── icon.ico           ← Windows icon (auto-generated)
├── icon.icns          ← macOS icon (auto-generated)
└── icon.png           ← Linux icon (auto-generated)
```

## Manual Icon Generation

If you prefer manual control, you can use the `icon-gen` package directly:

```bash
# Install globally
npm install -g icon-gen

# Generate icons
icon-gen -i assets/icon-source.png -o assets --ico --icns --png
```

### Custom Sizes

To generate specific sizes:

```javascript
// Create a script: scripts/generate-icons.js
const icongen = require('icon-gen');

const options = {
  ico: {
    name: 'icon',
    sizes: [16, 24, 32, 48, 64, 128, 256]
  },
  icns: {
    name: 'icon',
    sizes: [16, 32, 64, 128, 256, 512, 1024]
  },
  png: {
    name: 'icon',
    sizes: [512]
  },
  favicon: {
    name: 'favicon',
    sizes: [16, 32, 48]
  }
};

icongen('assets/icon-source.png', 'assets', options)
  .then(() => console.log('✅ Icons generated!'))
  .catch(err => console.error('❌ Error:', err));
```

Run it:
```bash
node scripts/generate-icons.js
```

## Verifying Your Icons

### Windows
After building:
1. Extract the built ZIP
2. Right-click `zip-extractor.exe`
3. Check if icon appears correctly
4. Test in taskbar when running

### macOS
1. Open the built `.app` file
2. Icon should appear in Finder
3. Test in Dock when running

### Test at Different Sizes

Icons should look good at:
- **16x16** - Taskbar, system tray
- **32x32** - Desktop shortcuts
- **48x48** - File explorer
- **256x256** - Large icons, thumbnails

## Troubleshooting

### Icons not showing after build

**Solution 1**: Clear the out directory
```bash
rm -rf out/
npm run make:win
```

**Solution 2**: Verify icon paths in `forge.config.js`
```javascript
packagerConfig: {
  icon: './assets/icon', // No extension, Forge adds it
}
```

### Icon looks blurry on Windows

**Cause**: Missing high-resolution versions in .ico file

**Solution**: Regenerate with electron-icon-builder which includes all sizes
```bash
npm run generate-icons
```

### Icon has white background on macOS

**Cause**: Source image doesn't have transparency

**Solution**: 
1. Open source image in image editor
2. Remove background layer
3. Save as PNG with transparency
4. Regenerate icons

### Icons are different sizes

**Cause**: Source image isn't square

**Solution**:
1. Crop/resize source to 1024x1024
2. Center your design
3. Regenerate icons

### Generated .icns file doesn't work

**macOS only**: .icns generation works best on macOS

**Workaround on Windows/Linux**:
- Use online converter: https://cloudconvert.com/png-to-icns
- Or generate on macOS machine
- Or use pre-built .icns from template

## Icon Resources

### Icon Design Inspiration
- **Electron Apps**: https://www.electronjs.org/apps
- **macOS Big Sur Icons**: https://macosicons.com
- **Fluent Design**: https://www.microsoft.com/design/fluent

### Stock Icons
- **Flaticon**: https://www.flaticon.com
- **Icons8**: https://icons8.com
- **Iconfinder**: https://www.iconfinder.com

### Templates
- **Figma Icon Templates**: Search "app icon template" in Figma Community
- **Sketch Templates**: Available on Sketch App Sources

## Current Build Configuration

Your `forge.config.js` is already set up:

```javascript
packagerConfig: {
  icon: './assets/icon', // Automatically picks .ico/.icns based on platform
  name: 'ZIP Extractor',
  executableName: 'zip-extractor',
}
```

When you build:
- **Windows**: Uses `assets/icon.ico`
- **macOS**: Uses `assets/icon.icns`
- **Linux**: Uses `assets/icon.png`

## Workflow Summary

1. **Design** your icon in Figma/Illustrator
2. **Export** as 1024x1024 PNG → `assets/icon-source.png`
3. **Generate** icons: `npm run generate-icons`
4. **Build** app: `npm run make:win`
5. **Test** on target platform
6. **Iterate** if needed

## Package Details

### electron-icon-builder
- **Purpose**: Generates all platform icons
- **Input**: Single PNG image
- **Output**: .ico, .icns, and various .png files
- **Pros**: Simple, one command
- **Cons**: Less control over individual sizes

### icon-gen
- **Purpose**: More control over icon generation
- **Input**: Single PNG or multiple PNGs
- **Output**: Customizable formats and sizes
- **Pros**: Flexible, programmatic usage
- **Cons**: Requires more configuration

## Example: Custom Icon Generation Script

Create `scripts/icons.js`:

```javascript
#!/usr/bin/env node
const icongen = require('icon-gen');
const path = require('path');

const source = path.join(__dirname, '../assets/icon-source.png');
const dest = path.join(__dirname, '../assets');

const options = {
  report: true,
  ico: {
    name: 'icon',
    sizes: [16, 24, 32, 48, 64, 128, 256]
  },
  icns: {
    name: 'icon',
    sizes: [16, 32, 64, 128, 256, 512, 1024]
  }
};

console.log('🎨 Generating icons...');
console.log(`📁 Source: ${source}`);
console.log(`📁 Output: ${dest}\n`);

icongen(source, dest, options)
  .then((results) => {
    console.log('✅ Icons generated successfully!');
    results.forEach(result => {
      console.log(`   ✓ ${path.basename(result)}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error generating icons:', err);
    process.exit(1);
  });
```

Add to package.json:
```json
"scripts": {
  "icons": "node scripts/icons.js"
}
```

## Next Steps

1. Create your icon design
2. Export as `assets/icon-source.png`
3. Run `npm run generate-icons`
4. Build and test your app
5. Enjoy your custom-branded application! 🎉

---

**Need help?** Check out the [Electron documentation on icons](https://www.electronjs.org/docs/latest/tutorial/application-icons)

