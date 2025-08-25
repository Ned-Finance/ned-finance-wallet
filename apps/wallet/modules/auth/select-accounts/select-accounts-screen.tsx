import { Button } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui/icons";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import {
  ImportedAccount,
  ImportedAccountProps,
} from "./components/imported-account";

export const AuthSelectAccountsScreen = () => {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState([
    {
      address: "0x1234567890123456789012345678901234567890",
      numberOfTransactions: 10,
      checked: false,
      blockchainName: "Ethereum",
    },
  ]);

  const selectedAccounts = useMemo(() => {
    return accounts.filter((account) => account.checked);
  }, [accounts]);

  const onAccountPress = (item: ImportedAccountProps) => {
    setAccounts(
      accounts.map((account) =>
        account.address === item.address
          ? { ...account, checked: !account.checked }
          : account
      )
    );
  };

  return (
    <ScreenWrapper
      showBack={true}
      title={t("auth.selectAccounts.title")}>
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-ned-muted text-md mt-2 w-full">
          {t("auth.selectAccounts.description")}
        </Text>
        <FlatList
          className="flex-1 w-full mt-8"
          data={accounts}
          renderItem={({ item }) => (
            <ImportedAccount
              onPress={onAccountPress}
              address={item.address}
              blockchainName={item.blockchainName}
              numberOfTransactions={item.numberOfTransactions}
              checked={item.checked}
            />
          )}
        />
        <Button
          disabled={selectedAccounts.length === 0}
          variant="primary"
          className="w-full"
          onPress={() => router.push("/(auth)/secure-passcode")}>
          <Text className="text-lg mr-2">
            {t("auth.register.button.continueToPin")}
          </Text>
          <Icon
            name="ChevronRight"
            className="w-5 h-5"
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};
