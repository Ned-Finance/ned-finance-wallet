import { Button, TextInput } from "@/modules/shared";
import { TextFader } from "@/modules/shared/ui/animations/text-fader/text-fader";
import { Icon } from "@/modules/shared/ui/icons/icon";
import {
  DetachedModal,
  DetachedModalMethods,
} from "@/modules/shared/ui/modals/detached-modal";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const AuthLoginScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const detachedModalRef = useRef<DetachedModalMethods | null>(null);

  const [mnemonic, setMnemonic] = useState("");

  const onContinue = () => {
    detachedModalRef.current?.present(1);
  };

  return (
    <ScreenWrapper
      showBack={true}
      title={t("auth.login.title")}>
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
          <Text className="text-lg mr-2">
            {t("auth.login.button.continue")}
          </Text>
          <Icon
            name="ChevronRight"
            className="w-5 h-5"
          />
        </Button>
      </View>
      <DetachedModal
        ref={detachedModalRef}
        enablePanDownToClose={false}
        enableDismissOnClose={false}>
        <View className="flex-1 justify-center items-center w-full h-full">
          <Icon
            name="Wallet"
            className="w-12 h-12 text-ned-primary mb-4"
            strokeWidth={0.8}
          />

          {/* TODO: add info like BTC price, current volume, etc */}
          <TextFader
            texts={[
              "Searching for your wallets",
              "We are almost there",
              "A few more seconds and we got them",
            ]}
          />
        </View>
      </DetachedModal>
    </ScreenWrapper>
  );
};
