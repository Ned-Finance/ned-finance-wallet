import { STORE_NAME } from "@/constants";
import { mmkvStorage } from "@/modules/shared/storage/mmkv-storage";
import { Theme } from "@/modules/shared/types/ui/themes";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PreferencesState = {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  currencyCode: string;
  updateCurrencyCode: (currencyCode: string) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "main" as Theme,
      updateTheme: (theme: Theme) => {
        console.log("🎨 Updating theme to:", theme);
        set({ theme });
      },
      currencyCode: "USD",
      updateCurrencyCode: (currencyCode: string) => {
        set({ currencyCode });
      },
    }),
    {
      name: STORE_NAME,
      storage: mmkvStorage,
    }
  )
);
