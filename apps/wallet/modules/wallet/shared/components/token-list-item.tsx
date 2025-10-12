import { formatAmount } from "@/modules/shared/utils/ui/wallet";
import { TokenBalance } from "@ned-finance/wallet";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export const TokenListItem = ({ token, amount }: TokenBalance) => {
  return (
    <View className="flex-row items-center p-4 bg-ned-background-secondary rounded-xl">
      <View className="flex-row items-center gap-2 flex-1">
        <Image
          source={{ uri: token.imageUrl }}
          className="w-6 h-6 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-ned-text-secondary">{token.name}</Text>
          <Text className="text-ned-text-secondary">
            {formatAmount(amount, token.decimals)} {token.symbol}
          </Text>
        </View>
      </View>

      <View className="ml-2">
        <Text className="text-ned-text text-right">
          {formatAmount(amount, token.decimals)}
        </Text>
      </View>
    </View>
  );
};
