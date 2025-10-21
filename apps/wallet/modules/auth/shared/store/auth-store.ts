import { STORE_NAME } from "@/constants";
import { mmkvStorage } from "@/modules/shared/store/mmkv-store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  registrationData: {
    masterKey: Uint8Array;
    vaultId: string;
  } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  setRegistrationData: (data: {
    masterKey: Uint8Array;
    vaultId: string;
  }) => void;
  clearRegistrationData: () => void;
};

// Tipo para el estado persistido (solo los campos que queremos guardar)
type PersistedState = Pick<AuthState, "isAuthenticated" | "user">;

export const useAuthStore = create<AuthState>()(
  immer(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        registrationData: null,
        login: (email: string, password: string) => {
          set((state) => {
            state.isAuthenticated = true;
            state.user = { id: "1", email };
          });
        },
        logout: () => {
          set((state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.registrationData = null;
          });
        },
        setRegistrationData: (data: {
          masterKey: Uint8Array;
          vaultId: string;
        }) => {
          set((state) => {
            state.registrationData = data;
          });
        },
        clearRegistrationData: () => {
          set((state) => {
            if (state.registrationData?.masterKey) {
              state.registrationData.masterKey.fill(0);
            }
            state.registrationData = null;
          });
        },
      }),
      {
        name: STORE_NAME,
        storage: mmkvStorage,
        partialize: (state): PersistedState => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
      }
    )
  )
);
