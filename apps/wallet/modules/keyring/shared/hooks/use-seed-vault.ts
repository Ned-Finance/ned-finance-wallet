import { useCallback } from "react";
import { encryptMnemonicWithMK } from "../services/mnemonic-secret";
import { useKeyringStore } from "../store/keyring.store";
import { saveSeedVault } from "../store/vault-store";
import { SeedVault } from "../types";

export function useSeedVault() {
  const masterKey = useKeyringStore((state) => state.mk);

  const createSeedVault = useCallback(async (mnemonic: string) => {
    const vaultId = crypto.randomUUID();
    const blob = await encryptMnemonicWithMK(masterKey!, mnemonic);

    const vault: SeedVault = {
      id: vaultId,
      mnemonic: blob,
      createdAt: Date.now(),
    };
    await saveSeedVault(vault);
  }, []);

  return {
    createSeedVault,
  };
}
