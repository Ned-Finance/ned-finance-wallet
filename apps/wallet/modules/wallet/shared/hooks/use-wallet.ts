import { useCurrentAccount } from "@/modules/keyring";
import { useWalletStore } from "../store/wallet.store";

export function useWallet() {
  const currentAccount = useCurrentAccount();

  const getBalance = useWalletStore((state) => state.getBalance);
  const currentBalance = getBalance(currentAccount?.address || "");

  // const { data: fiatRates } = useFiatRates();
  // const { data: cryptoPrices } = useCryptoPrices(["SOL", "ETH", "USDC"]);

  // const { data: currentBalanceFiat } = useMemo(() => {
  //   return currentBalance * fiatRates?.USD;
  // }, [currentBalance, fiatRates]);

  return {
    currentBalance,
    currentAccountAddress: currentAccount?.address,
  };
}
