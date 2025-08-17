import * as SecureStore from "expo-secure-store";

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
};
