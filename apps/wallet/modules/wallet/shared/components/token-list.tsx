import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import { TokenBalance } from "@ned-finance/wallet";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { TokenListItem } from "./token-list-item";

const fakeToken = {
  token: {
    address: "ssdsdsd",
    name: "sdsdsd",
    symbol: "SOL",
    decimals: 9,
    imageUrl: "http://sdsdsdcom",
  },
  amount: BigInt(1_000_000_000),
};

export const TokenList = ({ height, width }: PageSizeProps) => {
  const DATA: TokenBalance[] = new Array(10).fill(fakeToken, 0, 10);

  return (
    <View
      style={{ height, width }}
      className="overflow-visible bg-slate-600">
      <FlashList
        data={DATA}
        removeClippedSubviews={false}
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
