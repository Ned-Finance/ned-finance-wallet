// modules/pricing/hooks.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchTokenPrice } from "../services/price";
import { CryptoPrices } from "../types/price";

export function useCryptoPrices(
  assets: string[],
  nativeTokenSymbol?: string,
  options?: Partial<UseQueryOptions<CryptoPrices>>
) {
  return useQuery({
    queryKey: ["pricing", "token-price", assets.join(","), nativeTokenSymbol],
    queryFn: (): Promise<CryptoPrices> =>
      fetchTokenPrice(assets, nativeTokenSymbol),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
