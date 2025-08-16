import { TextFader } from "@/modules/shared/ui/animations/text-fader/text-fader";
import { Icon } from "@/modules/shared/ui/icons";
import { View } from "react-native";

export function ImportingAccounts() {
  return (
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
  );
}
