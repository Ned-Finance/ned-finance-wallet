import { Pager, Tabs } from "@/modules/shared/ui";
import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { TokenList } from "../../shared/components/token-list";

export function WalletSections() {
  const { t } = useTranslation();

  return (
    <View className="flex-col justify-center my-4 flex-1">
      <Text className="text-3xl my-4 text-ned-inverse">
        {t("wallet.main.assets")}
      </Text>
      <Tabs
        elements={[
          {
            text: t("wallet.main.options.tokens"),
            icon: require("@/assets/images/wallet/icons/coins.png"),
            iconSize: 25,
          },
          {
            text: t("wallet.main.options.collectibles"),
            icon: require("@/assets/images/wallet/icons/collectibles.png"),
          },
        ]}
      />
      <Pager
        className="mt-4"
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
