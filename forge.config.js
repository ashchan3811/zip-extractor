const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon', // Optional: add icon later
    name: 'ZIP Extractor',
    executableName: 'zip-extractor',
  },
  rebuildConfig: {},
  makers: [
    {
      // Squirrel.Windows - only runs on Windows or Mac with Wine/Mono
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'zip_extractor',
        authors: 'Ashwani Kumar',
        description: 'Extract ZIP files easily using a desktop app',
        setupIcon: './assets/icon.ico', // Optional: add icon later
        loadingGif: './assets/install-spinner.gif', // Optional
      },
      platforms: ['win32'],
    },
    {
      // ZIP maker - works cross-platform, no dependencies needed
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
      platforms: ['linux'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
