// modules/keyring/shared/store/keyring.store.ts
import { Account } from "@ned-finance/wallet";
import { create } from "zustand";

type KeyringState = {
  accounts: Account[];
  currentAccountAddress: string | null;
  selectAccount: (id: string) => void;
  addAccount: (account: Account) => void;
  removeAccount: (address: string) => void;
  setCurrentAccount: (address: string) => void;
  setAccounts: (accounts: Account[]) => void;
};

export const useKeyringStore = create<KeyringState>((set) => ({
  accounts: [],
  currentAccountAddress: null,
  selectAccount: (address) => set({ currentAccountAddress: address }),
  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
      currentAccountAddress: account.address,
    })),
  removeAccount: (address) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.address !== address),
    })),
  setCurrentAccount: (address) => set({ currentAccountAddress: address }),
  setAccounts: (accounts) => set({ accounts }),
}));
