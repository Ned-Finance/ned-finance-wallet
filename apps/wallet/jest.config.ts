module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "./jest.setup.js",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": require.resolve("babel-jest"),
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(expo(nent)?|@expo(nent)?|@expo/.*|expo-router|expo-asset|expo-constants|expo-modules-core|react-native|@react-native|react-clone-referenced-element|@react-native-community|react-native-reanimated|react-native-gesture-handler|react-native-url-polyfill|@walletconnect/.*|@reown/.*|wagmi|viem))",
  ],
};
