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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView>
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
                <Stack.Screen name="(auth)" />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
          <Toast config={toastConfig} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
