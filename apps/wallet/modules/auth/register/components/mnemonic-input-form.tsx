import { Button, TextInput } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function AuthLoginMnemonicInputForm({
  onContinue,
  isValid,
  isLoading,
}: {
  onContinue: (mnemonic: string, pin: string) => void;
  isValid?: boolean | null;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();

  const [mnemonic, setMnemonic] = useState("");
  const [pin, setPin] = useState("");

  const handleContinue = () => {
    onContinue(mnemonic, pin);
  };

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
      <View className="w-full mb-4">
        <Text className="text-ned-muted text-sm mb-2">
          {t("auth.login.pinLabel")}
        </Text>
        <TextInput
          className="w-full"
          placeholder={t("auth.login.pinPlaceholder")}
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          maxLength={4}
          keyboardType="numeric"
        />
      </View>

      {isValid === false && (
        <Text className="text-red-500 text-sm mb-4">
          {t("auth.login.errors.invalidMnemonic")}
        </Text>
      )}

      <Button
        disabled={!mnemonic || !pin || isLoading}
        variant="primary"
        className="w-full"
        onPress={handleContinue}>
        <Text className="text-lg mr-2">
          {isLoading
            ? t("auth.login.button.importing")
            : t("auth.login.button.continue")}
        </Text>
        <Icon
          name="ChevronRight"
          className="w-5 h-5"
        />
      </Button>
    </View>
  );
}
