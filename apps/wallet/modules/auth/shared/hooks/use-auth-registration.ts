import { useKeyringStore } from "@/modules/keyring/shared/store/keyring.store";
import { randomBytes, randomUUID } from "@/modules/shared/crypto";
import { useCallback, useState } from "react";

export function useAuthRegistration() {
  const [masterKey, setMasterKey] = useState<Uint8Array | null>(null);
  const addVaultFromMnemonic = useKeyringStore((s) => s.addVaultFromMnemonic);
  const setMK = useKeyringStore((s) => s.setMasterKey);

  const initializeRegistration = useCallback(
    async (mnemonic: string) => {
      // Generate a random 32-byte Master Key
      const mk = randomBytes(32);
      setMasterKey(mk);

      // Temporarily set MK in store to allow vault creation
      setMK(mk);

      // Create vault with the mnemonic encrypted by the MK
      const vaultId = randomUUID();
      await addVaultFromMnemonic(vaultId, mnemonic, "Main Wallet");

      return { masterKey: mk, vaultId };
    },
    [addVaultFromMnemonic, setMK]
  );

  const clearMasterKey = useCallback(() => {
    if (masterKey) {
      masterKey.fill(0);
      setMasterKey(null);
    }
  }, [masterKey]);

  return {
    masterKey,
    initializeRegistration,
    clearMasterKey,
  };
}
