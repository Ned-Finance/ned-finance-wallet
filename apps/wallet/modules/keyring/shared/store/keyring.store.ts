import { create } from "zustand";
import {
  decryptPrivateKey,
  deleteEncryptedKey,
  encryptPrivateKey,
  loadEncryptedKey,
  saveEncryptedKey,
} from "../services/keystore";
import type { Address, PublicAccount } from "../types";

type KeyringState = {
  accounts: PublicAccount[];
  currentAccountAddress: Address | null;

  setAccounts: (accs: PublicAccount[]) => void;
  setCurrentAccount: (address: Address) => void;

  addAccountWithPrivateKey: (
    account: PublicAccount,
    privateKey: Uint8Array
  ) => Promise<void>;
  removeAccount: (address: Address) => Promise<void>;

  getDecryptedPrivateKey: (address: Address) => Promise<Uint8Array | null>;
};

export const useKeyringStore = create<KeyringState>((set, get) => ({
  accounts: [],
  currentAccountAddress: null,

  setAccounts: (accounts) => set({ accounts }),
  setCurrentAccount: (address) => set({ currentAccountAddress: address }),

  addAccountWithPrivateKey: async (account, privateKey) => {
    const blob = await encryptPrivateKey(privateKey);
    await saveEncryptedKey(account.address, blob);
    set((s) => ({
      accounts: [...s.accounts, account],
      currentAccountAddress: account.address,
    }));
    // best-effort zeroing (JS can't guarantee)
    privateKey.fill(0);
  },

  removeAccount: async (address) => {
    await deleteEncryptedKey(address);
    set((s) => {
      const accounts = s.accounts.filter((a) => a.address !== address);
      const current =
        s.currentAccountAddress === address
          ? accounts[0]?.address ?? null
          : s.currentAccountAddress;
      return { accounts, currentAccountAddress: current };
    });
  },

  getDecryptedPrivateKey: async (address) => {
    const blob = await loadEncryptedKey(address);
    if (!blob) return null;
    return await decryptPrivateKey(blob);
  },
}));
