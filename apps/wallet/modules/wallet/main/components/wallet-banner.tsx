import { Pager } from "@/modules/shared/ui";
import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useWalletBanners } from "../../shared/hooks/use-wallet-banners";

export function WalletBanner() {
  const { data: banners } = useWalletBanners();

  const pages = useMemo(
    () =>
      banners?.map((banner, index) => ({
        key: banner.type + "-" + index,
        component: ({ height, width }: PageSizeProps) => (
          <View className="flex-1">
            <Image
              contentFit="fill"
              className="rounded-lg h-24 w-full bg-slate-400"
              source={{ uri: banner.imageUrl }}
            />
          </View>
        ),
      })) ?? [],
    [banners]
  );

  return (
    <View className="mt-8 h-24 rounded-xl">
      <Pager
        showIndicator={false}
        pages={pages}
      />
    </View>
  );
}
