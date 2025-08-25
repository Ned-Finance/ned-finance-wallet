import React from "react";
import { Text, View } from "react-native";
import { useWallet } from "../../shared/hooks/use-wallet";

export function WalletBalance() {
  const { currentBalance } = useWallet();
  return (
    <View className="items-center my-12">
      <Text className="text-2xl font-bold text-ned-text">{currentBalance}</Text>
    </View>
  );
}
