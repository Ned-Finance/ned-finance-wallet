import { Icon } from "@/modules/shared/ui";
import { PageSizeProps } from "@/modules/shared/ui/pager/pager.props";
import { TokenBalance } from "@ned-finance/wallet";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
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
  const DATA: TokenBalance[] = new Array(100).fill(fakeToken, 0, 100);
  const { t } = useTranslation();

  return (
    <View
      style={{ height, width }}
      className="overflow-visible">
      <View className="flex flex-row items-center justify-center self-end mb-4">
        <Text className="text-ned-text">{t("common.viewAll")}</Text>
        <Icon
          name="ChevronRight"
          className="text-ned-text w-6 h-6"
        />
      </View>
      <FlashList
        data={DATA}
        removeClippedSubviews={false}
        nestedScrollEnabled
        getItemType={(item) => "token"}
        ItemSeparatorComponent={() => <View className="h-4" />}
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
