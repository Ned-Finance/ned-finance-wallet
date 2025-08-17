const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Configure alias resolution
config.resolver.alias = {
  "@": path.resolve(__dirname, "./"),
};

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "require",
  "react-native",
  "default",
];
config.resolver.sourceExts = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "native.ts",
  "native.tsx",
  "web.ts",
  "web.tsx",
];

module.exports = withNativeWind(config, { input: "./assets/css/global.css" });
