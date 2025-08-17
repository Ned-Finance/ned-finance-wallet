import { del, get, set } from "idb-keyval";

export const secureStore = {
  async getItem(key: string) {
    const v = await get<string>(key);
    return v ?? null;
  },
  async setItem(key: string, value: string) {
    await set(key, value);
  },
  async deleteItem(key: string) {
    await del(key);
  },
};
