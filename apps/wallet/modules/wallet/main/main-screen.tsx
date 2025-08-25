import { WalletHeader } from "@/modules/shell";
import React from "react";
import { View } from "react-native";
import { WalletActions } from "./components/wallet-actions";
import { WalletBalance } from "./components/wallet-balance";
import { WalletSections } from "./components/wallet-sections";

export const WalletMainScreen = () => {
  return (
    <View className="flex-1 p-2">
      <WalletHeader />
      <WalletBalance />
      <WalletActions />
      <WalletSections />
    </View>
  );
};
