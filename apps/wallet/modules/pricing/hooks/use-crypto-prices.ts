// modules/pricing/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrice } from "../services/price";

export function useCryptoPrices(
  assets: string[],
  options?: Partial<Parameters<typeof useQuery>[0]>
) {
  return useQuery({
    queryKey: ["pricing", "crypto-usd", assets.join(",")],
    queryFn: () => fetchTokenPrice(assets),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
