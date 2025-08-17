import { useCurrentAccount } from "@/modules/keyring";
import { useCryptoPrices } from "@/modules/pricing";
import { useMemo } from "react";
import { useWalletStore } from "../store/wallet.store";

export function useWalletTokens() {
  const currentAccount = useCurrentAccount();

  const snapshot = useWalletStore(
    (state) => state.snapshot[currentAccount?.address || ""]
  );

  const accountTokenSymbols = useMemo(() => {
    return snapshot?.tokenBalances.map((tb) => tb.token.symbol) ?? [];
  }, [snapshot]);

  const { data: cryptoPrices } = useCryptoPrices(
    accountTokenSymbols,
    snapshot?.nativeTokenSymbol
  );

  const { data: nativePrice } = useCryptoPrices(
    [snapshot?.nativeTokenSymbol],
    "usd"
  );

  // const tokensWithPrice = useMemo(() => {
  //   return snapshot?.tokenBalances.map((tb) => ({
  //     ...tb,
  //     price:
  //       (cryptoPrices?.[tb.token.symbol] ?? 0) * (nativePrice?.["usd"] ?? 0),
  //   }));
  // }, [cryptoPrices, nativePrice]);

  // // TODO: convert to user preference fiat currency
  // const { data: fiatRates } = useFiatRates();

  // return currentBalance;
}
