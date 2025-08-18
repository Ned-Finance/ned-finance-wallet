import { create } from "zustand";
import {
  deleteEncryptedKey,
  loadEncryptedKey,
  saveEncryptedKey,
} from "../services/account-key-store"; // sólo guarda/lee blobs
import {
  decryptPrivateKeyWithMK,
  encryptPrivateKeyWithMK,
} from "../services/account-secret"; // ahora encripta con mk
import type { Address, PublicAccount } from "../types";

type KeyringState = {
  accounts: PublicAccount[];
  currentAccountAddress: Address | null;
  mk: Uint8Array | null;

  setAccounts: (accs: PublicAccount[]) => void;
  setCurrentAccount: (address: Address) => void;
  setMasterKey: (mk: Uint8Array | null) => void;

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
  mk: null,

  setAccounts: (accounts) => set({ accounts }),
  setCurrentAccount: (address) => set({ currentAccountAddress: address }),
  setMasterKey: (mk) => set({ mk }),

  addAccountWithPrivateKey: async (account, privateKey) => {
    const mk = get().mk;
    if (!mk) throw new Error("Keystore locked");

    const blob = await encryptPrivateKeyWithMK(mk, privateKey);
    await saveEncryptedKey(account.address, blob);

    set((s) => ({
      accounts: [...s.accounts, account],
      currentAccountAddress: account.address,
    }));

    privateKey.fill(0); // best-effort wipe
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
    const mk = get().mk;
    if (!mk) throw new Error("Keystore locked");

    const blob = await loadEncryptedKey(address);
    if (!blob) return null;
    return await decryptPrivateKeyWithMK(mk, blob);
  },
}));
