import { CustomKeyboard } from "@/modules/shared/ui/keyboard/numeric-keyboard";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message"; // Force recompilation
import { useAuthPinSetup } from "../shared/hooks";
import { useAuthStore } from "../shared/store/auth-store";

export const AuthSecurePasscodeScreen = () => {
  const { t } = useTranslation();
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const { setupPinAndAccounts, isLoading } = useAuthPinSetup();
  const { registrationData, clearRegistrationData } = useAuthStore();
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
        // Setup PIN and derive accounts
        if (registrationData) {
          // We need to get the mnemonic from the vault to derive accounts
          // For now, we'll derive accounts without the mnemonic parameter
          // This is a limitation that should be addressed in a real implementation
          setupPinAndAccounts(
            confirmPasscode,
            registrationData.masterKey,
            registrationData.vaultId
          )
            .then(() => {
              clearRegistrationData();
              router.push("/(auth)/success");
            })
            .catch((error) => {
              console.error("Failed to setup PIN and accounts:", error);
              Toast.show({
                type: "error",
                text1: t("auth.securePasscode.errors.setupFailed"),
              });
              setPasscode("");
              setConfirmPasscode("");
            });
        }
      } else {
        Toast.show({
          type: "error",
          text1: t("auth.securePasscode.errors.passcodeMismatch"),
        });
        setPasscode("");
        setConfirmPasscode("");
      }
    }
  }, [
    passcode,
    confirmPasscode,
    t,
    router,
    setupPinAndAccounts,
    registrationData,
    clearRegistrationData,
  ]);

  return (
    <ScreenWrapper
      showBack={true}
      title={messages.title}>
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-ned-muted text-md mt-2 w-full">
          {t("auth.securePasscode.description")}
        </Text>
        <View className="flex flex-1 w-full">
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
