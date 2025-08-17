import { Pressable } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function WalletActions() {
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-center space-x-4 my-4">
      <Pressable className="flex flex-col items-center gap-2 rounded-2xl p-4 w-18">
        <Icon
          name="Send"
          className="w-6 h-6 text-ned-primary"
        />
        <Text className="text-sm text-ned-text-secondary">
          {t("wallet.main.actions.send")}
        </Text>
      </Pressable>
      <Pressable className="flex flex-col items-center gap-2 rounded-2xl p-4 w-18">
        <Icon
          name="DollarSign"
          className="w-6 h-6 text-ned-primary"
        />
        <Text className="text-sm text-ned-text-secondary">
          {t("wallet.main.actions.buy")}
        </Text>
      </Pressable>
    </View>
  );
}
