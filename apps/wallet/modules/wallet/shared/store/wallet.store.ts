import { create } from "zustand";

type WalletState = {
  balances: Record<string, { balance: number; currencySymbol: string }>;
  setBalance: ({
    address,
    balance,
    currencySymbol,
  }: {
    address: string;
    balance: number;
    currencySymbol: string;
  }) => void;
  getBalance: (address: string) => number;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  balances: {},
  setBalance: ({ address, balance, currencySymbol }) =>
    set((state) => ({
      balances: { ...state.balances, [address]: { balance, currencySymbol } },
    })),
  getBalance: (address: string) => get().balances[address]?.balance || 0,
}));
