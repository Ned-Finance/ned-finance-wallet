import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Route } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Platform, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "../tabs/haptic-tab";

type TabBarItemProps = {
  route: Route<string>;
  descriptor: BottomTabBarProps["descriptors"][string];
  navigation: BottomTabBarProps["navigation"];
  focused: boolean;
};

type TabBarTheme = {
  backgroundColor?: string;
  borderColor?: string;
  activeTextClassName?: string;
  inactiveTextClassName?: string;
  activeIconClassName?: string;
  inactiveIconClassName?: string;
  textSize?: number;
  iconSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
  // Blur effect options
  blurEnabled?: boolean;
  blurIntensity?: number;
  blurTint?:
    | "light"
    | "dark"
    | "default"
    | "systemChromeMaterial"
    | "systemMaterial"
    | "systemThickMaterial"
    | "systemThinMaterial"
    | "systemUltraThinMaterial";
};

type CustomTabBarProps = BottomTabBarProps & {
  theme?: TabBarTheme;
};

const TabBarItem = ({
  route,
  descriptor,
  navigation,
  focused,
  theme,
}: TabBarItemProps & { theme?: TabBarTheme }) => {
  const { options } = descriptor;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  // Get className and size from theme or use defaults
  const activeIconClassName = theme?.activeIconClassName || "text-ned-primary";
  const inactiveIconClassName =
    theme?.inactiveIconClassName || "text-ned-text-muted";
  const iconSize = theme?.iconSize || 24;
  const paddingVertical = theme?.paddingVertical || 8;
  const paddingHorizontal = theme?.paddingHorizontal || 4;

  const iconClassName = focused ? activeIconClassName : inactiveIconClassName;

  return (
    <HapticTab
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical,
        paddingHorizontal,
      }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {options.tabBarIcon && (
          <View style={{ marginBottom: 4 }}>
            {options.tabBarIcon({
              focused,
              className: iconClassName,
              size: iconSize,
            } as any)}
          </View>
        )}
      </View>
    </HapticTab>
  );
};

export const TabBar = ({
  state,
  descriptors,
  navigation,
  theme,
}: CustomTabBarProps) => {
  const insets = useSafeAreaInsets();

  // Default theme values for floating tab bar
  const defaultTheme: Required<TabBarTheme> = {
    backgroundColor: "transparent", // Always transparent for floating effect
    borderColor: "transparent",
    activeTextClassName: "text-ned-primary font-semibold",
    inactiveTextClassName: "text-ned-text-muted font-normal",
    activeIconClassName: "text-ned-primary",
    inactiveIconClassName: "text-ned-text-muted",
    textSize: 12,
    iconSize: 24,
    paddingVertical: 12, // Increased padding for floating effect
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    // Enhanced blur effect defaults
    blurEnabled: true,
    blurIntensity: Platform.OS === "ios" ? 80 : 10,
    blurTint: Platform.OS === "ios" ? "systemUltraThinMaterial" : "light",
  };

  // Merge theme with defaults
  const finalTheme = { ...defaultTheme, ...theme };

  const tabBarStyle: ViewStyle = {
    flexDirection: "row",
    backgroundColor: finalTheme.blurEnabled
      ? "transparent"
      : finalTheme.backgroundColor,
    // Floating effect with rounded corners
    borderRadius: 50,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? insets.bottom + 8 : 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    // Enhanced shadow for floating effect
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  };

  return (
    <View style={tabBarStyle}>
      {/* Enhanced blur background for floating effect */}
      {finalTheme.blurEnabled && (
        <BlurView
          tint="dark"
          intensity={finalTheme.blurIntensity}
          experimentalBlurMethod={"dimezisBlurView"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
            zIndex: 0,
          }}
        />
      )}

      {/* Tab items with higher z-index */}
      <View style={{ zIndex: 1, flexDirection: "row", flex: 1 }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          return (
            <TabBarItem
              key={route.key}
              route={route}
              descriptor={descriptors[route.key]}
              navigation={navigation}
              focused={isFocused}
              theme={finalTheme}
            />
          );
        })}
      </View>
    </View>
  );
};
