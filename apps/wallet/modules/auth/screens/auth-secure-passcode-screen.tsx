import { CustomKeyboard } from "@/modules/shared/ui/keyboard/numeric-keyboard";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const AuthSecurePasscodeScreen = () => {
  const { t } = useTranslation();
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const router = useRouter();

  const messages = useMemo(() => {
    return {
      title:
        passcode.length < 4
          ? t("auth.securePasscode.title")
          : t("auth.securePasscode.titleConfirm"),
    };
  }, [passcode, t]);

  // Validate second passcode to see if they match
  useEffect(() => {
    if (confirmPasscode.length === 4) {
      if (passcode === confirmPasscode) {
        router.push("/(auth)/welcome");
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.securePasscode.errors.passcodeMismatch"),
        });
        setPasscode("");
        setConfirmPasscode("");
      }
    }
  }, [passcode, confirmPasscode, t, router]);

  return (
    <ScreenWrapper
      showBack={true}
      title={messages.title}>
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-ned-muted text-md mt-2">
          {t("auth.securePasscode.description")}
        </Text>
        <View className="flex flex-1 flex-row items-end w-full self-stretch">
          {passcode.length < 4 && (
            <CustomKeyboard
              onChange={setPasscode}
              onBiometric={() => {}}
            />
          )}

          {confirmPasscode.length <= 4 && passcode.length === 4 && (
            <CustomKeyboard
              onChange={setConfirmPasscode}
              onBiometric={() => {}}
            />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};
