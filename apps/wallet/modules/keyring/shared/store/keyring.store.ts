import { create } from "zustand";
import {
  decryptPrivateKeyWithMK,
  encryptPrivateKeyWithMK,
} from "../services/account-secret";
import {
  decryptMnemonicWithMK,
  encryptMnemonicWithMK,
} from "../services/mnemonic-secret";
import type {
  Address,
  ChainId,
  PublicAccount,
  SeedVault,
  VaultId,
} from "../types";
import {
  deleteEncryptedKey,
  loadEncryptedKey,
  saveEncryptedKey,
} from "./account-key-store";
import { deleteSeedVault, loadSeedVault, saveSeedVault } from "./vault-store";

type KeyringState = {
  accounts: PublicAccount[];
  currentAccountAddress: Address | null;
  mk: Uint8Array | null;

  setAccounts: (accs: PublicAccount[]) => void;
  setCurrentAccount: (address: Address) => void;

  setMasterKey: (mk: Uint8Array | null) => void;
  lock: () => void;

  addVaultFromMnemonic: (
    vaultId: VaultId,
    mnemonic: string,
    label?: string
  ) => Promise<void>;
  removeVault: (vaultId: VaultId) => Promise<void>;

  addAccountFromVault: (
    params: {
      vaultId: VaultId;
      derivationPath: string;
      chainId: ChainId;
      label?: string;
    },
    derive: (
      mnemonic: string,
      derivationPath: string,
      chainId: ChainId
    ) => Promise<{ privateKey: Uint8Array; publicKey: string; address: string }>
  ) => Promise<PublicAccount>;
  removeAccount: (address: Address) => Promise<void>;

  addAccountWithPrivateKey: (
    account: PublicAccount,
    privateKey: Uint8Array
  ) => Promise<void>;
  getDecryptedPrivateKey: (address: Address) => Promise<Uint8Array | null>;
};

export const useKeyringStore = create<KeyringState>((set, get) => ({
  accounts: [],
  currentAccountAddress: null,
  mk: null,

  setAccounts: (accounts) => set({ accounts }),
  setCurrentAccount: (address) => set({ currentAccountAddress: address }),

  setMasterKey: (mk) => set({ mk }),
  lock: () => {
    const { mk } = get();
    mk?.fill(0);
    set({ mk: null });
  },

  addVaultFromMnemonic: async (vaultId, mnemonic, label) => {
    const mk = get().mk;
    if (!mk) throw new Error("Keystore locked");
    const aad = new TextEncoder().encode("mnemonic:v1");
    const blob = await encryptMnemonicWithMK(mk, mnemonic, aad);

    const vault: SeedVault = {
      id: vaultId,
      mnemonic: blob,
      label,
      createdAt: Date.now(),
    };
    await saveSeedVault(vault);
  },

  removeVault: async (vaultId) => {
    await deleteSeedVault(vaultId);
    // Delete all accounts associated with this vaultId
    set((s) => ({
      accounts: s.accounts.filter((a) => a.vaultId !== vaultId),
      currentAccountAddress:
        s.currentAccountAddress &&
        s.accounts.find(
          (a) => a.address === s.currentAccountAddress && a.vaultId !== vaultId
        )
          ? s.currentAccountAddress
          : s.accounts.find((a) => a.vaultId !== vaultId)?.address ?? null,
    }));
  },

  addAccountFromVault: async (
    { vaultId, derivationPath, chainId, label },
    derive
  ) => {
    const mk = get().mk;
    if (!mk) throw new Error("Keystore locked");

    const vault = await loadSeedVault(vaultId);
    if (!vault) throw new Error("Vault not found");

    const aad = new TextEncoder().encode("mnemonic:v1");
    const mnemonic = decryptMnemonicWithMK(mk, vault.mnemonic, aad);

    const { privateKey, publicKey, address } = await derive(
      mnemonic,
      derivationPath,
      chainId
    );

    const blob = await encryptPrivateKeyWithMK(mk, privateKey);
    await saveEncryptedKey(address, blob);

    const account = {
      address,
      publicKey,
      chainId,
      vaultId,
      derivationPath,
      label,
    };
    set((s) => ({
      accounts: [...s.accounts, account],
      currentAccountAddress: s.currentAccountAddress ?? address,
    }));

    privateKey.fill(0);
    return account;
  },

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
