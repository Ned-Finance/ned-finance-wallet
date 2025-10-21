import {
  DetachedModal,
  DetachedModalMethods,
} from "@/modules/shared/ui/modals/detached-modal";
import { ScreenWrapper } from "@/modules/shared/ui/screen/screen-wrapper";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthLoginMnemonicInputForm } from "../../register/components/mnemonic-input-form";
import { useAuthLogin } from "../../shared/hooks";
import { ImportingAccounts } from "../components/importing-accounts";

export const AuthLoginScreen = () => {
  const { t } = useTranslation();
  const { validateAndImport, isValid, isLoading } = useAuthLogin();
  const [mnemonic, setMnemonic] = useState("");
  const [pin, setPin] = useState("");

  const detachedModalRef = useRef<DetachedModalMethods | null>(null);

  const onContinue = async (mnemonicInput: string, pinInput: string) => {
    setMnemonic(mnemonicInput);
    setPin(pinInput);

    detachedModalRef.current?.present(0);

    try {
      const result = await validateAndImport(mnemonicInput, pinInput);

      if (result.success) {
        setTimeout(() => {
          router.push("/(auth)/select-accounts");
          detachedModalRef.current?.dismiss();
        }, 2000);
      } else {
        detachedModalRef.current?.dismiss();
        // TODO: Show error message
        console.error("Login failed:", result.error);
      }
    } catch (error) {
      detachedModalRef.current?.dismiss();
      console.error("Login error:", error);
    }
  };

  return (
    <ScreenWrapper
      showBack={true}
      title={t("auth.login.title")}>
      <AuthLoginMnemonicInputForm
        onContinue={(mnemonic, pin) => onContinue(mnemonic, pin)}
        isValid={isValid}
        isLoading={isLoading}
      />

      <DetachedModal
        ref={detachedModalRef}
        enablePanDownToClose={false}
        enableDismissOnClose={false}>
        <ImportingAccounts />
      </DetachedModal>
    </ScreenWrapper>
  );
};
