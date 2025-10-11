import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React, { useCallback } from "react";
import { Platform, View } from "react-native";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { PricingRefresher } from "@/modules/pricing";
import { HapticTab } from "@/modules/shared/ui/tabs/haptic-tab";

import { Icon } from "@/modules/shared/ui";
import { TabBar } from "@/modules/wallet/shared/components/tab-bar";

export default function TabLayout() {
  const TabBarComponent = useCallback(
    (props: BottomTabBarProps) => (
      <TabBar
        {...props}
        theme={{
          activeTextClassName: "text-white font-semibold",
          inactiveTextClassName: "text-gray-400 font-normal",
          activeIconClassName: "text-white",
          inactiveIconClassName: "text-gray-400",
          // Temporarily disable blur to debug icon visibility
          blurEnabled: false,
          blurIntensity: Platform.OS === "ios" ? 80 : 100,
          blurTint: Platform.OS === "ios" ? "systemUltraThinMaterial" : "light",
          iconSize: 28,
          textSize: 12,
          paddingVertical: 12,
        }}
      />
    ),
    []
  );

  const ScreenLayout = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <View className="flex-1 bg-ned-background">{children}</View>
    ),
    []
  );

  const WalletIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <Icon
        name="Wallet"
        className={focused ? "text-white" : "text-gray-400"}
        strokeWidth={2}
      />
    ),
    []
  );

  const ExploreIcon = useCallback(
    ({ focused }: { focused: boolean }) => (
      <Icon
        name="ArrowLeftRight"
        className={focused ? "text-white" : "text-gray-400"}
        strokeWidth={2}
      />
    ),
    []
  );

  return (
    <>
      <PricingRefresher />
      <Tabs
        tabBar={TabBarComponent}
        screenLayout={ScreenLayout}
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Remove default tab bar styling for floating effect
              position: "absolute",
              backgroundColor: "transparent",
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            default: {
              // Remove default tab bar styling for floating effect
              position: "absolute",
              backgroundColor: "transparent",
              borderTopWidth: 0,
              elevation: 0,
            },
          }),
        }}>
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: WalletIcon,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ExploreIcon,
          }}
        />
      </Tabs>
    </>
  );
}
