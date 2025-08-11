import { Button } from "@/modules/shared";
import { Icon } from "@/modules/shared/ui/icons/icon";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const AuthWelcomeScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <ScreenWrapper showBack={false}>
      <View className="flex-1 items-center justify-center">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-4xl mt-2">
            {t("auth.welcome.title")}
          </Text>
          <Text className="text-white text-lg font-extralight mt-2 mb-4">
            {t("auth.welcome.description")}
          </Text>
          <Button
            variant="ghost"
            onPress={() => router.replace("/")}>
            <Icon
              name="CircleCheck"
              className="w-16 h-16 text-ned-primary"
              strokeWidth={1}
            />
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};
