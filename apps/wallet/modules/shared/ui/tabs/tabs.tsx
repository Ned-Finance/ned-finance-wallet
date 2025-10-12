import { useTheme } from "@/modules/user/preferences/providers/theme-provider";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import type { TabElement, TabLayout, TabsProps } from "./tabs.props";

export function Tabs<T extends TabElement>({
  elements,
  onIndexChange,
}: Readonly<TabsProps<T>>) {
  const { themeValues } = useTheme();

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

  const themeBackgroundActiveColor = "--ned-background-secondary";
  const themeBorderColor = "--ned-background-secondary";
  const themeTextActiveColor = "--ned-inverse";
  const themeTextColor = "--ned-text-secondary";

  const backgroundActiveColor = useMemo(() => {
    console.log("themeValues", themeValues);
    const primaryColor = themeValues?.[themeBackgroundActiveColor];
    if (!primaryColor || typeof primaryColor !== "string") {
      return "rgb(0, 239, 209)"; // fallback color
    }
    return `rgb(${primaryColor.split(" ").join(",")})`;
  }, [themeValues]);

  const borderColor = useMemo(() => {
    const primaryColor = themeValues?.[themeBorderColor];
    if (!primaryColor || typeof primaryColor !== "string") {
      return "rgb(0, 239, 209)"; // fallback color
    }
    return `rgb(${primaryColor.split(" ").join(",")})`;
  }, [themeValues]);

  const textActiveColor = useMemo(() => {
    const textInverseColor = themeValues?.[themeTextActiveColor];
    if (!textInverseColor || typeof textInverseColor !== "string") {
      return "rgb(10, 10, 10)"; // fallback color
    }
    return `rgb(${textInverseColor.split(" ").join(",")})`;
  }, [themeValues]);

  const textColor = useMemo(() => {
    const textSecondaryColor = themeValues?.[themeTextColor];
    if (!textSecondaryColor || typeof textSecondaryColor !== "string") {
      return "rgb(150, 150, 150)"; // fallback color
    }
    return `rgb(${textSecondaryColor.split(" ").join(",")})`;
  }, [themeValues]);

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
              borderColor: borderColor,
              borderWidth: 1,
            }}
            className="rounded-3xl"
          />
        ))}

        {isLayoutReady && (
          <Animated.View
            style={{
              position: "absolute",
              transitionProperty: ["width", "left", "top", "height"],
              transitionDuration: "200ms",
              backgroundColor: backgroundActiveColor,
              borderWidth: 1,
              top: layoutSelectedTab?.y,
              left: layoutSelectedTab?.x,
              width: layoutSelectedTab?.width,
              height: layoutSelectedTab?.height,
            }}
            className="rounded-3xl"
          />
        )}

        {elements.map((element, index) => (
          <View
            key={element.text + index}
            className="flex-1"
            onLayout={(event) => handleLayout({ event, index })}>
            <Pressable onPress={() => setTabIndex(index)}>
              <View className="px-4 py-2 rounded-3xl flex h-full items-center justify-center flex-row">
                <Image
                  style={{
                    width: element.iconSize || 20,
                    height: element.iconSize || 20,
                    marginRight: 8,
                  }}
                  source={element.icon}
                  contentFit="cover"
                  transition={1000}
                />
                <Animated.Text
                  style={{
                    transitionProperty: "color",
                    transitionDuration: "200ms",
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
