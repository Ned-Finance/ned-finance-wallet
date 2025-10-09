import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { PricingRefresher } from "@/modules/pricing";
import { HapticTab } from "@/modules/shared/ui/tabs/haptic-tab";

import { useManageAccounts, useMasterKey } from "@/modules/keyring";
import { Icon } from "@/modules/shared/ui";
import { TabBar } from "@/modules/wallet/shared/components/tab-bar";

// Simulated wallet account and tokens
const mockAccount = {
  address: "0x1234abcd5678efgh9012ijklmnopqrstuvwx",
  publicKey: "0x1234abcd5678efgh9012ijklmnopqrstuvwx",
  chainId: "solana" as const,
  label: "Demo Wallet",
};

export default function TabLayout() {
  const { addAccountWithPrivateKey } = useManageAccounts();
  const { mk, setMK } = useMasterKey();

  useEffect(() => {
    // if (!mk) {
    //   const randomMk = randomBytes(32);
    //   setMK(randomMk);
    // }
    // // Set the mock account and make it current
    // addAccountWithPrivateKey(mockAccount, new Uint8Array());
  }, [addAccountWithPrivateKey, mk, setMK]);

  return (
    <>
      <PricingRefresher />
      <Tabs
        tabBar={(props) => (
          <TabBar
            {...props}
            theme={{
              activeColor: "#007AFF",
              inactiveColor: "#8E8E93",
              // Enable blur effect instead of solid background
              blurEnabled: true,
              blurIntensity: 100,
              blurTint:
                Platform.OS === "ios" ? "systemChromeMaterial" : "default",
              iconSize: 28,
              textSize: 12,
            }}
          />
        )}
        screenLayout={({ children }) => (
          <View className="flex-1 bg-ned-background">{children}</View>
        )}
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
            tabBarIcon: ({ color }) => (
              <Icon
                name="Wallet"
                className="size-8"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="paperplane.fill"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
