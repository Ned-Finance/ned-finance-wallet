import { useCurrentAccount } from "@/modules/keyring";
import { Icon } from "@/modules/shared/ui/icons";
import React from "react";
import { Text, View } from "react-native";

export const WalletHeader = () => {
  const currentAccount = useCurrentAccount();
  return (
    <View className="flex-row">
      <View className="flex-row items-center justify-between">
        <Icon
          name="WalletMinimal"
          className="text-ned-primary"
        />
        <Text className="text-ned-muted">{currentAccount?.address}</Text>
        <Icon
          name="ChevronDown"
          className="text-ned-primary"
        />
      </View>
    </View>
  );
};
