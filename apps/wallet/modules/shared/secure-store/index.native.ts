import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const secureStore = {
  async getItem(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string) {
    return SecureStore.deleteItemAsync(key);
  },

  // Biometric-bound storage (iOS real; Android fallback)
  async setItemBiometric(key: string, value: string) {
    if (Platform.OS === "ios") {
      return SecureStore.setItemAsync(key, value, {
        keychainService: key,
        requireAuthentication: true,
      });
    }
    // Android: no per-entry biometric; regular storage (gating will be handled by LocalAuth)
    return SecureStore.setItemAsync(key, value);
  },

  async getItemBiometric(key: string) {
    if (Platform.OS === "ios") {
      // In iOS, this will prompt for Face/Touch ID automatically
      return SecureStore.getItemAsync(key, {
        keychainService: key,
        requireAuthentication: true,
      });
    }
    // Android: regular storage (gating will be handled by LocalAuth)
    return SecureStore.getItemAsync(key);
  },
};
