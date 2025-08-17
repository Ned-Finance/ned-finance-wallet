import { TokenBalance } from "@ned-finance/wallet";
import React from "react";
import { Text } from "react-native";

export const TokenListItem = ({ token, amount }: TokenBalance) => {
  return <Text className="text-ned-text">{token.symbol}</Text>;
};
