import { Icon } from "@/modules/shared/ui/icons";
import { Pressable } from "@/modules/shared/ui/pressable/pressable";
import { cn } from "@/modules/shared/utils/ui/styles";
import { getWalletAddress } from "@/modules/shared/utils/ui/wallet";
import { BlockchainName } from "@ned-finance/wallet";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export type ImportedAccountProps = {
  address: string;
  numberOfTransactions: number;
  checked: boolean;
  blockchainName: BlockchainName;
};

type ImportedAccountActionProps = {
  onPress: (item: ImportedAccountProps) => void;
};

export const ImportedAccount = ({
  address,
  numberOfTransactions,
  checked,
  blockchainName,
  onPress,
}: ImportedAccountProps & ImportedAccountActionProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() =>
        onPress({ address, numberOfTransactions, checked, blockchainName })
      }>
      <View className="flex flex-1 flex-row items-center justify-between bg-ned-background-secondary rounded-2xl p-4">
        <View>
          <Text className="text-white">{getWalletAddress(address)}</Text>
          <Text className="text-ned-muted">
            {t("auth.selectAccounts.numberOfTransactions", {
              count: numberOfTransactions,
            })}
          </Text>
        </View>
        <View
          className={cn(
            "bg-ned-secondary rounded-full w-8 h-8 items-center justify-center",
            checked
              ? "bg-ned-secondary"
              : "bg-transparent border border-ned-muted"
          )}>
          {checked && (
            <Icon
              name="Check"
              className="text-inverse"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};
