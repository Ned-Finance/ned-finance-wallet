import { useTheme } from "@/modules/user/preferences/providers/theme-provider";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import type { TabElement, TabLayout, TabsProps } from "./tabs.props";

export function Tabs<T extends TabElement>({
  elements,
  onIndexChange,
}: Readonly<TabsProps<T>>) {
  const { themeVars } = useTheme();

  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: TabLayout;
  }>({});

  const [tabIndex, setTabIndex] = useState(0);

  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const layoutSelectedTab = useMemo(() => {
    return tabLayouts[tabIndex] || { x: 0, y: 0, width: 0, height: 0 };
  }, [tabIndex, tabLayouts]);

  const handleLayout = ({
    event,
    index,
  }: {
    event: LayoutChangeEvent;
    index: number;
  }) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    setTabLayouts((prev) => ({
      ...prev,
      [index]: { x, y, width, height },
    }));
  };

  const backgroundActiveColor = useMemo(() => {
    const primaryColor = themeVars?.["--ned-primary"];
    if (!primaryColor || typeof primaryColor !== "string") {
      return "rgb(0, 239, 209)"; // fallback color
    }
    return `rgb(${primaryColor.split(" ").join(",")})`;
  }, [themeVars]);

  const textActiveColor = useMemo(() => {
    const textInverseColor = themeVars?.["--ned-text-inverse"];
    if (!textInverseColor || typeof textInverseColor !== "string") {
      return "rgb(10, 10, 10)"; // fallback color
    }
    return `rgb(${textInverseColor.split(" ").join(",")})`;
  }, [themeVars]);

  const textColor = useMemo(() => {
    const textSecondaryColor = themeVars?.["--ned-text-secondary"];
    if (!textSecondaryColor || typeof textSecondaryColor !== "string") {
      return "rgb(150, 150, 150)"; // fallback color
    }
    return `rgb(${textSecondaryColor.split(" ").join(",")})`;
  }, [themeVars]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(tabIndex);
    }
  }, [onIndexChange, tabIndex]);

  useEffect(() => {
    if (Object.keys(tabLayouts).length === elements.length) {
      setIsLayoutReady(true);
    }
  }, [tabLayouts, elements.length]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="h-10"
      className="w-full max-h-10">
      <View className="flex h-full flex-row gap-2 items-center justify-start">
        {Object.keys(tabLayouts).map((key) => (
          <View
            key={"bg-" + key}
            style={{
              position: "absolute",
              top: tabLayouts[key].y,
              left: tabLayouts[key].x,
              width: tabLayouts[key].width,
              height: tabLayouts[key].height,
            }}
            className="rounded-2xl"
          />
        ))}

        {isLayoutReady && (
          <Animated.View
            style={{
              position: "absolute",
              transitionProperty: ["width", "left", "top", "height"],
              transitionDuration: "300ms",
              backgroundColor: backgroundActiveColor,
              top: layoutSelectedTab?.y,
              left: layoutSelectedTab?.x,
              width: layoutSelectedTab?.width,
              height: layoutSelectedTab?.height,
            }}
            className="rounded-2xl"
          />
        )}

        {elements.map((element, index) => (
          <View
            key={element.text + index}
            className="flex-1"
            onLayout={(event) => handleLayout({ event, index })}>
            <Pressable onPress={() => setTabIndex(index)}>
              <View className="px-4 py-2 rounded-2xl flex h-full items-center justify-center">
                <Animated.Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    transitionProperty: "color",
                    transitionDuration: "300ms",
                    color: tabIndex === index ? textActiveColor : textColor,
                  }}>
                  {element.text}
                </Animated.Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
