import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { PricingRefresher } from "@/modules/pricing";
import { HapticTab } from "@/modules/shared/ui/tabs/haptic-tab";

import { Icon } from "@/modules/shared/ui";
import { TabBar } from "@/modules/wallet/shared/components/tab-bar";

const getIconTabBarClasses = (focused: boolean) => {
  return focused ? "text-ned-primary" : "text-ned-text-muted";
};

const TabBarComponent = (props: any) => (
  <TabBar
    {...props}
    theme={{
      activeTextClassName: "text-ned-primary font-semibold",
      inactiveTextClassName: "text-ned-text-muted font-normal",
      activeIconClassName: "text-ned-primary",
      inactiveIconClassName: "text-ned-text-muted",
      // Enable blur effect instead of solid background
      blurEnabled: true,
      blurIntensity: 100,
      blurTint: Platform.OS === "ios" ? "systemChromeMaterial" : "default",
      iconSize: 28,
      textSize: 12,
    }}
  />
);

const ScreenLayout = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-1 bg-ned-background">{children}</View>
);

const WalletIcon = ({ focused }: { focused: boolean }) => (
  <Icon name="Wallet" className={getIconTabBarClasses(focused)} />
);

const ExploreIcon = ({ focused }: { focused: boolean }) => (
  <Icon name="ArrowLeftRight" className={getIconTabBarClasses(focused)} />
);

export default function TabLayout() {
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
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
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
