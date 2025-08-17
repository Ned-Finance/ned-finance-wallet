import { TokenBalance } from "@ned-finance/wallet";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { TokenListItem } from "./token-list-item";

const DATA: TokenBalance[] = Array.from({ length: 300 }, (_, i) => ({
  token: {
    address: `sol:token:${i}`,
    symbol: `Token ${i}`,
    decimals: 9,
  },
  amount: BigInt(i),
}));

export const TokenList = () => {
  return (
    <View className="flex-1 flex h-98">
      <FlashList
        data={DATA}
        removeClippedSubviews
        nestedScrollEnabled
        estimatedItemSize={80}
        getItemType={(item) => "token"}
        renderItem={({ item }) => (
          <TokenListItem
            token={item.token}
            amount={item.amount}
          />
        )}
      />
    </View>
  );
};
