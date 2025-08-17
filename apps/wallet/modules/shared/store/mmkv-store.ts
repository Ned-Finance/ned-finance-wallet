import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

const storage = new MMKV({
  id: "ned-wallet-storage",
});

export const mmkvStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    const value = storage.getString(name);
    return Promise.resolve(value || null);
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
    return Promise.resolve();
  },
  removeItem: (name: string) => {
    storage.delete(name);
    return Promise.resolve();
  },
}));
