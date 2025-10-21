import { useMnemonic } from "@/modules/keyring";
import { setPinAndWrapMK } from "@/modules/keyring/shared/services/pin-vault";
import { useKeyringStore } from "@/modules/keyring/shared/store/keyring.store";
import { randomBytes } from "@/modules/shared/crypto";
import { createWeb3Wallet } from "@ned-finance/wallet";
import { useCallback, useState } from "react";

export function useAuthLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { validate } = useMnemonic();
  const setMK = useKeyringStore((s) => s.setMasterKey);
  const addVaultFromMnemonic = useKeyringStore((s) => s.addVaultFromMnemonic);
  const addAccountFromVault = useKeyringStore((s) => s.addAccountFromVault);

  const validateAndImport = useCallback(
    async (mnemonic: string, pin: string) => {
      setIsLoading(true);
      setIsValid(null);

      try {
        // Validate mnemonic
        const isValidMnemonic = validate(mnemonic);
        setIsValid(isValidMnemonic);

        if (!isValidMnemonic) {
          return { success: false, error: "Invalid mnemonic phrase" };
        }

        // Generate a new Master Key for this login session
        const masterKey = randomBytes(32);

        // Wrap MK with PIN and store it
        await setPinAndWrapMK(pin, masterKey);

        // Set MK in keyring store for immediate use
        setMK(masterKey);

        // Create vault with the mnemonic
        const vaultId = crypto.randomUUID();
        await addVaultFromMnemonic(vaultId, mnemonic, "Imported Wallet");

        // Create wallet instance to derive accounts
        const wallet = createWeb3Wallet();

        // Get available chains (currently only Solana)
        const chains = await wallet.listChains();
        const chainIds = chains.map((c) => c.chainId);

        // Derive accounts for all available chains at index 0
        const accounts = await wallet.deriveFromMnemonic(mnemonic, chainIds, 0);

        // Add accounts to keyring store
        for (const [chainId, account] of Object.entries(accounts)) {
          await addAccountFromVault(
            {
              vaultId,
              derivationPath: `m/44'/501'/0'/0'`, // Solana derivation path
              chainId: chainId as any,
              label: `Main Account (${chainId})`,
            },
            async (mnemonic, derivationPath, chainId) => {
              // Use the wallet's deriveFromMnemonic method
              const derivedAccounts = await wallet.deriveFromMnemonic(
                mnemonic,
                [chainId],
                0
              );
              const account = derivedAccounts[chainId];
              return {
                privateKey: account.privateKey,
                publicKey: account.publicKey,
                address: account.address,
              };
            }
          );
        }

        // Clear master key from memory
        masterKey.fill(0);

        return { success: true };
      } catch (error) {
        console.error("Failed to validate and import:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [validate, setMK, addVaultFromMnemonic, addAccountFromVault]
  );

  return {
    validateAndImport,
    isValid,
    isLoading,
  };
}
