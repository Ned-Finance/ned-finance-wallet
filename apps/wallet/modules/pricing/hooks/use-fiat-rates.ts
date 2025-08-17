// modules/pricing/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { fetchFiatRates } from "../services/rates";

export function useFiatRates(
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: ["pricing", "fiat-rates"],
    queryFn: () => fetchFiatRates(),
    staleTime: 10 * 60_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
