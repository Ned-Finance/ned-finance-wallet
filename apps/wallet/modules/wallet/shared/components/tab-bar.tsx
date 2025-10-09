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
 * 2. Custom theme:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        activeColor: '#FF6B6B',
 *        inactiveColor: '#999999',
 *        backgroundColor: '#FFFFFF',
 *        iconSize: 28,
 *        textSize: 14,
 *        paddingVertical: 12,
 *      }}
 *    />
 *
 * 3. Dark theme:
 *    <TabBar
 *      {...props}
 *      theme={{
 *        activeColor: '#4FC3F7',
 *        inactiveColor: '#757575',
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
 *        activeColor: '#000000',
 *        inactiveColor: '#CCCCCC',
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
 *        activeColor: '#007AFF',
 *        inactiveColor: '#8E8E93',
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
  activeColor?: string;
  inactiveColor?: string;
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

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
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

  // Get colors from theme or use defaults
  const activeColor = theme?.activeColor || "#007AFF";
  const inactiveColor = theme?.inactiveColor || "#8E8E93";
  const iconSize = theme?.iconSize || 24;
  const textSize = theme?.textSize || 12;
  const paddingVertical = theme?.paddingVertical || 8;
  const paddingHorizontal = theme?.paddingHorizontal || 4;

  const iconColor = focused ? activeColor : inactiveColor;
  const textColor = focused ? activeColor : inactiveColor;

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
              color: iconColor,
              size: iconSize,
            } as TabBarIconProps)}
          </View>
        )}
        <Text
          style={{
            color: textColor,
            fontSize: textSize,
            fontWeight: focused ? "600" : "400",
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

  // Default theme values
  const defaultTheme: Required<TabBarTheme> = {
    backgroundColor:
      Platform.OS === "ios" ? "rgba(255, 255, 255, 0.95)" : "#FFFFFF",
    borderColor: Platform.OS === "ios" ? "rgba(0, 0, 0, 0.1)" : "#E5E5E7",
    activeColor: "#007AFF",
    inactiveColor: "#8E8E93",
    textSize: 12,
    iconSize: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    // Blur effect defaults
    blurEnabled: true,
    blurIntensity: 100,
    blurTint: Platform.OS === "ios" ? "systemChromeMaterial" : "default",
  };

  // Merge theme with defaults
  const finalTheme = { ...defaultTheme, ...theme };

  const tabBarStyle: ViewStyle = {
    flexDirection: "row",
    backgroundColor: finalTheme.blurEnabled
      ? "transparent"
      : finalTheme.backgroundColor,
    // Remove the white line by setting borderTopWidth to 0
    borderTopWidth: 0,
    paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
    shadowColor: finalTheme.shadowColor,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: finalTheme.shadowOpacity,
    shadowRadius: finalTheme.shadowRadius,
    elevation: finalTheme.elevation,
    position: "relative",
    overflow: "hidden",
  };

  return (
    <View style={tabBarStyle}>
      {/* Blur background */}
      {finalTheme.blurEnabled && (
        <BlurView
          tint={finalTheme.blurTint}
          intensity={finalTheme.blurIntensity}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Tab items */}
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
  );
};
