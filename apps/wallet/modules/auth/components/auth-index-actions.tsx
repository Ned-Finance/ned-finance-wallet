import { Button } from "@/modules/shared";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function AuthIndexActions() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex justify-center items-center w-full p-4 gap-4">
      <Button
        className="w-full"
        text={t("auth.index.button.register")}
        onPress={() => router.push("/(auth)/register")}
      />
      <Button
        variant="outline"
        className="w-full"
        text={t("auth.index.button.login")}
        onPress={() => router.push("/(auth)/login")}
      />
    </View>
  );
}
