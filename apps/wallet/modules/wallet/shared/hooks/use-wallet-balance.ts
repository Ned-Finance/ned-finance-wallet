import { useCurrentAccount } from "@/modules/keyring";
import { useCryptoPrices, useFiatRates } from "@/modules/pricing";
import { usePreferenceCurrency } from "@/modules/user/preferences";
import { useMemo } from "react";
import { useWalletStore } from "../store/wallet.store";

export function useWalletBalance() {
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

  const { data: fiatRates } = useFiatRates();

  const preferenceCurrencyCode = usePreferenceCurrency();

  const currentBalanceFiat = useMemo(() => {
    const nativeBalanceSum = Object.values(cryptoPrices || {}).reduce(
      (acc, price) => acc + price,
      0
    );
    const nativeBalanceInUsd = nativeBalanceSum * (nativePrice?.["usd"] || 0);
    const balanceInPreferenceCurrency =
      nativeBalanceInUsd * (fiatRates?.[preferenceCurrencyCode] ?? 1);
    return balanceInPreferenceCurrency;
  }, [cryptoPrices, nativePrice, fiatRates, preferenceCurrencyCode]);

  return currentBalanceFiat;
}
