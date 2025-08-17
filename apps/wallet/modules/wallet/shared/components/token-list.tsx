import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { useWallet } from "../hooks/use-wallet";
import { TokenListItem } from "./token-list-item";

export const TokenList = ({ height, width }: PageSizeProps) => {
  const { currentBalance } = useWallet();

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
