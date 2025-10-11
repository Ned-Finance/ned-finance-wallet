import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { WalletHeader } from "@/modules/shell";
import React from "react";
import { WalletActions } from "./components/wallet-actions";
import { WalletBalance } from "./components/wallet-balance";
import { WalletSections } from "./components/wallet-sections";

export const WalletMainScreen = () => {
  return (
    <ScreenWrapper>
      <WalletHeader />
      <WalletBalance />
      <WalletActions />
      <WalletSections />
    </ScreenWrapper>
  );
};
