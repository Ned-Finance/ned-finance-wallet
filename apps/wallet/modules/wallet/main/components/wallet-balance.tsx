import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useWallet } from "../../shared/hooks/use-wallet";

export function WalletBalance() {
  const { currentBalance } = useWallet();
  const { t } = useTranslation();

  return (
    <View className="mt-8">
      <Text className="text-3xl text-ned-text self-start">
        {t("wallet.main.balance")}
      </Text>
      <Text className="text-5xl text-ned-text my-4">{currentBalance}</Text>
    </View>
  );
}
