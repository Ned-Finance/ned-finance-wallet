import { Button } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function WalletActions() {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-2 my-4">
      <Button
        className="!rounded-full !bg-ned-background-secondary !px-9 !pl-2 pr-4 !py-2 w-auto flex  flex-grow !justify-start"
        onPress={() => {}}>
        <View className="flex-row items-center gap-2 bg-ned-background rounded-full p-2 mr-4 self-start">
          <Icon
            name="Send"
            className="w-6 h-6 text-ned-inverse"
          />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className=" text-ned-text-secondary">
            {t("wallet.main.actions.send")}
          </Text>
        </View>
      </Button>
      <Button
        className="!rounded-full !bg-ned-background-secondary !px-9 !pl-2 pr-4 !py-2 flex flex-grow !justify-start"
        onPress={() => {}}>
        <View className="flex-row items-center gap-2 bg-ned-background rounded-full p-2 mr-4">
          <Icon
            name="ArrowDown"
            className="w-6 h-6 text-ned-inverse"
          />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className=" text-ned-text-secondary">
            {t("wallet.main.actions.deposit")}
          </Text>
        </View>
      </Button>
      <Button
        className="!rounded-full !bg-ned-background-secondary !px-4 !py-2"
        onPress={() => {}}>
        <Icon
          name="Plus"
          className="w-6 h-6 text-ned-inverse"
        />
      </Button>
    </View>
  );
}
