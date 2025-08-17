import { useCryptoPrices } from "../hooks/use-crypto-prices";
import { useFiatRates } from "../hooks/use-fiat-rates";

export const PricingRefresher = () => {
  // TODO: Add time to user preferences
  useFiatRates({
    refetchInterval: 5 * 60_000,
    staleTime: 10 * 60_000,
  });
  useCryptoPrices(["SOL", "ETH", "USDC"], {
    refetchInterval: 30_000,
    staleTime: 30_000,
  });
  return null;
};
