/**
 * Custom TabBar Component for Expo Router
 *
 * This component provides a fully customizable tab bar implementation that works with Expo Router.
 * You can customize every aspect of the tab bar including colors, sizes, spacing, and shadows.
 *
 * Usage Examples:
 *
 * 1. Basic usage with default theme:
 *    <TabBar {...props} />
 *
 * 2. Custom theme with Tailwind classes:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        activeTextClassName: 'text-red-500 font-bold',
 *        inactiveTextClassName: 'text-gray-500 font-normal',
 *        activeIconClassName: 'text-red-500',
 *        inactiveIconClassName: 'text-gray-500',
 *        backgroundColor: '#FFFFFF',
 *        iconSize: 28,
 *        textSize: 14,
 *        paddingVertical: 12,
 *      }}
 *    />
 *
 * 3. Dark theme with custom colors:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        activeTextClassName: 'text-blue-400 font-semibold',
 *        inactiveTextClassName: 'text-gray-400 font-normal',
 *        activeIconClassName: 'text-blue-400',
 *        inactiveIconClassName: 'text-gray-400',
 *        backgroundColor: '#212121',
 *        borderColor: '#424242',
 *        shadowColor: '#000',
 *        shadowOpacity: 0.3,
 *      }}
 *    />
 *
 * 4. Minimal theme:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        activeTextClassName: 'text-black font-semibold',
 *        inactiveTextClassName: 'text-gray-300 font-normal',
 *        activeIconClassName: 'text-black',
 *        inactiveIconClassName: 'text-gray-300',
 *        backgroundColor: 'transparent',
 *        borderColor: 'transparent',
 *        shadowOpacity: 0,
 *        elevation: 0,
 *        paddingVertical: 16,
 *      }}
 *    />
 *
 * 5. Blur effect theme:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        blurEnabled: true,
 *        blurIntensity: 100,
 *        blurTint: 'systemChromeMaterial',
 *        activeTextClassName: 'text-blue-500 font-semibold',
 *        inactiveTextClassName: 'text-gray-500 font-normal',
 *        activeIconClassName: 'text-blue-500',
 *        inactiveIconClassName: 'text-gray-500',
 *      }}
 *    />
 */

import { HapticTab } from "@/modules/shared/ui/tabs/haptic-tab";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationState, Route } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Platform, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabBarItemProps {
  route: Route<string>;
  descriptor: BottomTabBarProps["descriptors"][string];
  navigation: BottomTabBarProps["navigation"];
  state: NavigationState;
  focused: boolean;
}

interface TabBarTheme {
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
}

interface CustomTabBarProps extends BottomTabBarProps {
  theme?: TabBarTheme;
}

const TabBarItem = ({
  route,
  descriptor,
  navigation,
  state,
  focused,
  theme,
}: TabBarItemProps & { theme?: TabBarTheme }) => {
  const { options } = descriptor;
  let label = options.tabBarLabel;
  if (typeof label !== "string") {
    label = options.title;
  }
  if (typeof label !== "string") {
    label = route.name;
  }

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
  const activeTextClassName =
    theme?.activeTextClassName || "text-ned-primary font-semibold";
  const inactiveTextClassName =
    theme?.inactiveTextClassName || "text-ned-text-muted font-normal";
  const activeIconClassName = theme?.activeIconClassName || "text-ned-primary";
  const inactiveIconClassName =
    theme?.inactiveIconClassName || "text-ned-text-muted";
  const iconSize = theme?.iconSize || 24;
  const textSize = theme?.textSize || 12;
  const paddingVertical = theme?.paddingVertical || 8;
  const paddingHorizontal = theme?.paddingHorizontal || 4;

  const textClassName = focused ? activeTextClassName : inactiveTextClassName;
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
        <Text
          className={textClassName}
          style={{
            fontSize: textSize,
            textAlign: "center",
          }}>
          {label}
        </Text>
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
    blurIntensity: Platform.OS === "ios" ? 80 : 100,
    blurTint: Platform.OS === "ios" ? "systemUltraThinMaterial" : "light",
  };

  // Merge theme with defaults
  const finalTheme = { ...defaultTheme, ...theme };

  const tabBarStyle: ViewStyle = {
    flexDirection: "row",
    backgroundColor: finalTheme.blurEnabled
      ? "transparent"
      : "rgba(0, 0, 0, 0.8)", // Temporary dark background for debugging
    // Floating effect with rounded corners
    borderRadius: 20,
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
          tint={Platform.OS === "ios" ? "systemUltraThinMaterial" : "light"}
          intensity={Platform.OS === "ios" ? 80 : 100}
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
              state={state}
              focused={isFocused}
              theme={finalTheme}
            />
          );
        })}
      </View>
    </View>
  );
};
