// Initializations
import "@/modules/shared/i18n";
import "../modules/shared/nativewind/interop";

import "@/assets/css/global.css";
import { AuthProvider } from "@/modules/auth/shared/providers/auth-provider";
import { toastConfig } from "@/modules/shared/utils/ui/toast";
import { ThemeProvider } from "@/modules/user/preferences/providers/theme-provider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
const queryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView>
            <SafeAreaProvider>
              <BottomSheetModalProvider>
                <Stack
                  screenLayout={({ children }) => (
                    <View className="flex-1 bg-ned-background">{children}</View>
                  )}
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: "transparent",
                    },
                  }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(auth)/index" />
                </Stack>
              </BottomSheetModalProvider>
            </SafeAreaProvider>
          </GestureHandlerRootView>
          <Toast config={toastConfig} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
});
