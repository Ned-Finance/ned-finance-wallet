import { Pager } from "@/modules/shared/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TokenList } from "../../shared/components/token-list";

export function WalletSections() {
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-center space-x-4 my-4 flex-1">
      <Pager
        pages={[
          { key: "tokens", component: <TokenList /> },
          // { key: "collectibles", component: <CollectiblesList /> },
          // { key: "portfolio", component: <PortfolioList /> },
        ]}
      />
    </View>
  );
}
