import { useCryptoPrices, useFiatRates } from "../hooks";

export const PricingRefresher = () => {
  // TODO: Add time to user preferences
  useFiatRates({
    refetchInterval: 5 * 60_000,
    staleTime: 10 * 60_000,
  });
  useCryptoPrices(["SOL", "ETH", "USDC"], undefined, {
    refetchInterval: 30_000,
    staleTime: 30_000,
  });
  return null;
};
