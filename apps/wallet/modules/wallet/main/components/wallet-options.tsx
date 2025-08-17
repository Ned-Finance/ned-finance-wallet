import { Tabs } from "@/modules/shared/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function WalletOptions() {
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-center space-x-4 my-4">
      <Tabs
        elements={[
          { text: t("wallet.main.options.tokens") },
          { text: t("wallet.main.options.collectibles") },
          { text: t("wallet.main.options.portfolio") },
        ]}
      />
    </View>
  );
}
