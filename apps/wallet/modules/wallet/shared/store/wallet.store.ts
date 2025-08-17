import { STORE_NAME } from "@/constants";
import { mmkvStorage } from "@/modules/shared/storage/mmkv-storage";
import { Address, TokenBalance } from "@ned-finance/wallet";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type WalletSnapshot = {
  tokenBalances: TokenBalance[];
  nativeTokenSymbol: string;
};

type WalletState = {
  snapshot: Record<string, WalletSnapshot>;
  setSnapshot: (address: Address, snapshot: WalletSnapshot) => void;
  getSnapshot: (address: Address) => WalletSnapshot;
};

export const useWalletStore = create<WalletState>()(
  immer(
    persist(
      (set, get) => ({
        currentAccount: null,
        snapshot: {},
        setSnapshot: (address, snapshot) =>
          set((state) => ({
            snapshot: { ...state.snapshot, [address]: snapshot },
          })),
        getSnapshot: (address) => get().snapshot[address],
      }),
      {
        name: STORE_NAME,
        storage: mmkvStorage,
        partialize: (state) => state.snapshot,
      }
    )
  )
);
