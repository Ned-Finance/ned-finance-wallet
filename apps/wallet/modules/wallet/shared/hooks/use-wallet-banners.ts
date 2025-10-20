// modules/pricing/hooks.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchBanners } from "../../main/services/banners";
import { WalletBanner } from "../../main/types/banner";

export function useWalletBanners(
  options?: Partial<UseQueryOptions<WalletBanner[]>>
) {
  return useQuery({
    queryKey: ["wallet", "banners"],
    queryFn: (): Promise<WalletBanner[]> => fetchBanners(),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
