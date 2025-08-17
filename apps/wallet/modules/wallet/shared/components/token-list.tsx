import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
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

export const TokenList = ({ height, width }: PageSizeProps) => {
  console.log("height", height);
  console.log("width", width);
  return (
    <View style={{ height, width }}>
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
