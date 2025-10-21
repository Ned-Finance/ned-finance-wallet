import { useMnemonic } from "@/modules/keyring";
import { Button } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui/icons";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useAuthRegistration } from "../../shared/hooks";
import { useAuthStore } from "../../shared/store/auth-store";

export const AuthRegisterScreen = () => {
  const { t } = useTranslation();
  const { mnemonic, generate } = useMnemonic();
  const { initializeRegistration } = useAuthRegistration();
  const { setRegistrationData } = useAuthStore();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);

  const onContinue = async () => {
    if (!mnemonic) return;

    setIsInitializing(true);
    try {
      const { masterKey, vaultId } = await initializeRegistration(mnemonic);
      setRegistrationData({ masterKey, vaultId });
      router.push("/(auth)/secure-passcode");
    } catch (error) {
      console.error("Failed to initialize registration:", error);
      // TODO: Show error toast
    } finally {
      setIsInitializing(false);
    }
  };

  // Generate a new mnemonic on mount
  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <ScreenWrapper
      showBack={true}
      title={t("auth.register.title")}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-ned-muted text-md mt-2">
          {t("auth.register.description")}
        </Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-4xl font-extralight">
            {mnemonic}
          </Text>
          <Button
            variant="outline"
            className="scale-75 mt-4 self-end"
            onPress={() => {}}>
            <Icon
              name="Copy"
              className="text-ned-primary scale-90 mt-1"
            />
            <Text className="text-lg ml-4 text-ned-primary">
              {t("auth.register.button.copyMnemonic")}
            </Text>
          </Button>
        </View>
        <Button
          disabled={!mnemonic || isInitializing}
          variant="primary"
          className="w-full"
          onPress={onContinue}>
          <Text className="text-lg mr-2">
            {isInitializing
              ? t("auth.register.button.initializing")
              : t("auth.register.button.continueToPin")}
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
