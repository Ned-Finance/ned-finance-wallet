import { WalletHeader } from "@/modules/shell";
import React from "react";
import { View } from "react-native";
import { WalletActions } from "./components/wallet-actions";
import { WalletBalance } from "./components/wallet-balance";
import { WalletOptions } from "./components/wallet-options";
import { WalletSections } from "./components/wallet-sections";

export const WalletMainScreen = () => {
  return (
    <View className="flex-1">
      <WalletHeader />
      <WalletBalance />
      <WalletActions />
      <WalletOptions />
      <WalletSections />
    </View>
  );
};
