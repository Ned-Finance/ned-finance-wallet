import { useCurrentAccount } from "@/modules/keyring";
import { useWalletBalance } from "./use-wallet-balance";

export function useWallet() {
  const currentAccount = useCurrentAccount();
  const currentBalance = useWalletBalance();

  return {
    currentBalance,
    currentAccountAddress: currentAccount?.address,
  };
}
