import { setPinAndWrapMK } from "@/modules/keyring/shared/services/pin-vault";
import { useKeyringStore } from "@/modules/keyring/shared/store/keyring.store";
import { createWeb3Wallet } from "@ned-finance/wallet";
import { useCallback, useState } from "react";

export function useAuthPinSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const setMK = useKeyringStore((s) => s.setMasterKey);
  const addAccountFromVault = useKeyringStore((s) => s.addAccountFromVault);

  const setupPinAndAccounts = useCallback(
    async (pin: string, masterKey: Uint8Array, vaultId: string) => {
      setIsLoading(true);

      try {
        // Wrap MK with PIN and store it
        await setPinAndWrapMK(pin, masterKey);

        // Set MK in keyring store for immediate use
        setMK(masterKey);

        // Create wallet instance to derive accounts
        const wallet = createWeb3Wallet();

        // Get available chains (currently only Solana)
        const chains = await wallet.listChains();
        const chainIds = chains.map((c) => c.chainId);

        // Add accounts to keyring store for each chain
        for (const chainId of chainIds) {
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
      } catch (error) {
        console.error("Failed to setup PIN and accounts:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setMK, addAccountFromVault]
  );

  return {
    setupPinAndAccounts,
    isLoading,
  };
}
