const { withNativeWind } = require("nativewind/metro");
const { FileStore } = require("metro-cache");
const path = require("path");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// Create the default Expo config for Metro
// This includes the automatic monorepo configuration for workspaces
// See: https://docs.expo.dev/guides/monorepos/#automatic-configuration
const config = getSentryExpoConfig(__dirname);

// Configure alias resolution
config.resolver.alias = {
  "@": path.resolve(__dirname, "./"),
};

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({
    root: path.join(__dirname, "node_modules", ".cache", "metro"),
  }),
];

module.exports = withNativeWind(config, { input: "./assets/css/global.css" });
