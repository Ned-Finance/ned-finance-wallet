import {
  DetachedModal,
  DetachedModalMethods,
} from "@/modules/shared/ui/modals/detached-modal";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { router } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthLoginMnemonicInputForm } from "../register/components/mnemonic-input-form";
import { ImportingAccounts } from "./components/importing-accounts";

export const AuthLoginScreen = () => {
  const { t } = useTranslation();

  const detachedModalRef = useRef<DetachedModalMethods | null>(null);

  const onContinue = () => {
    detachedModalRef.current?.present(0);
    setTimeout(() => {
      router.push("/(auth)/select-accounts");
      detachedModalRef.current?.dismiss();
    }, 1000);
  };

  return (
    <ScreenWrapper
      showBack={true}
      title={t("auth.login.title")}>
      <AuthLoginMnemonicInputForm onContinue={onContinue} />

      <DetachedModal
        ref={detachedModalRef}
        enablePanDownToClose={false}
        enableDismissOnClose={false}>
        <ImportingAccounts />
      </DetachedModal>
    </ScreenWrapper>
  );
};
