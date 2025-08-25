import { Button, TextInput } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function AuthLoginMnemonicInputForm({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const { t } = useTranslation();

  const [mnemonic, setMnemonic] = useState("");

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-ned-muted text-md mt-2 w-full">
        {t("auth.login.description")}
      </Text>
      <View className="flex flex-1 items-center justify-center w-full">
        <TextInput
          className="h-48 w-full text-2xl font-extralight"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={mnemonic}
          onChangeText={setMnemonic}
        />
        <Button
          variant="outline"
          className="scale-75 mt-4 self-end"
          onPress={() => {}}>
          <Icon
            name="ClipboardPaste"
            className="text-ned-primary scale-90 mt-1"
          />
          <Text className="text-lg ml-4 text-ned-primary">
            {t("auth.login.button.pasteMnemonic")}
          </Text>
        </Button>
      </View>
      <Button
        // disabled={!isMnemonicValid}
        variant="primary"
        className="w-full"
        onPress={onContinue}>
        <Text className="text-lg mr-2">{t("auth.login.button.continue")}</Text>
        <Icon
          name="ChevronRight"
          className="w-5 h-5"
        />
      </Button>
    </View>
  );
}
