import { AuthIndexActions } from "@/modules/auth/components/auth-index-actions";
import { MediaRotator } from "@/modules/shared/ui/media-rotator/media-rotator";
import { SafeAreaView } from "react-native-safe-area-context";

export const AuthIndexScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <MediaRotator
        images={[
          require("@/assets/images/onboarding/screen1.png"),
          require("@/assets/images/onboarding/screen2.png"),
          require("@/assets/images/onboarding/screen3.png"),
          require("@/assets/images/onboarding/screen4.png"),
          require("@/assets/images/onboarding/screen5.png"),
        ]}
      />
      <AuthIndexActions />
    </SafeAreaView>
  );
};
