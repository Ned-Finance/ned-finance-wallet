import { formatAmount } from "@/modules/shared/utils/ui/wallet";
import { TokenBalance } from "@ned-finance/wallet";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export const TokenListItem = ({ token, amount }: TokenBalance) => {
  return (
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center gap-2">
        <Image
          source={{ uri: token.imageUrl }}
          className="w-6 h-6 rounded-full"
        />
        <View>
          <Text className="text-ned-text-secondary">{token.name}</Text>
          <Text className="text-ned-text-secondary">
            {formatAmount(amount, token.decimals)} {token.symbol}
          </Text>
        </View>
      </View>

      <Text className="text-ned-text">
        {formatAmount(amount, token.decimals)}
      </Text>
    </View>
  );
};
