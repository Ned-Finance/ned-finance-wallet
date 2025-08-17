// modules/pricing/hooks.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchFiatRates } from "../services/rates";
import { FiatRates } from "../types/rate";

export function useFiatRates(options?: Partial<UseQueryOptions<FiatRates>>) {
  return useQuery({
    queryKey: ["pricing", "fiat-rates"],
    queryFn: () => fetchFiatRates(),
    staleTime: 10 * 60_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
