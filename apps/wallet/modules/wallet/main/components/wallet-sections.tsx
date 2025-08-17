import { Pager, Tabs } from "@/modules/shared/ui";
import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TokenList } from "../../shared/components/token-list";

export function WalletSections() {
  const { t } = useTranslation();

  return (
    <View className="flex-col justify-center my-4 flex-1">
      <Tabs
        elements={[
          { text: t("wallet.main.options.tokens") },
          { text: t("wallet.main.options.collectibles") },
          { text: t("wallet.main.options.portfolio") },
        ]}
      />
      <Pager
        showIndicator={false}
        pages={[
          {
            key: "tokens",
            component: ({ height, width }: PageSizeProps) => (
              <TokenList
                height={height}
                width={width}
              />
            ),
          },
          // { key: "collectibles", component: <CollectiblesList /> },
          // { key: "portfolio", component: <PortfolioList /> },
        ]}
      />
    </View>
  );
}
