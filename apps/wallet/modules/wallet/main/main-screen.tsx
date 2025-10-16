import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { WalletHeader } from "@/modules/shell";
import React from "react";
import { WalletBalance } from "./components/wallet-balance";
import { WalletSections } from "./components/wallet-sections";

export const WalletMainScreen = () => {
  return (
    <ScreenWrapper>
      <WalletHeader />
      <WalletBalance />

      <WalletSections />
    </ScreenWrapper>
  );
};
