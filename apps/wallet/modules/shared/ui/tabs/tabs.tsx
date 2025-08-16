import { useTheme } from "@/modules/user/preferences/providers/theme-provider";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { Pressable } from "../pressable/pressable";
import type { TabElement, TabLayout, TabsProps } from "./tabs.props";

export function Tabs<T extends TabElement>({
  elements,
  onIndexChange,
}: TabsProps<T>) {
  const { themeVars } = useTheme();

  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: TabLayout;
  }>({});

  const [tabIndex, setTabIndex] = useState(0);

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
    return `rgb(${themeVars["--ned-primary"].split(" ").join(",")})`;
  }, [themeVars]);

  const textActiveColor = useMemo(() => {
    return `rgb(${themeVars["--ned-background"].split(" ").join(",")})`;
  }, [themeVars]);

  const textColor = useMemo(() => {
    return `rgb(${themeVars["--ned-muted"].split(" ").join(",")})`;
  }, [themeVars]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(tabIndex);
    }
  }, [onIndexChange, tabIndex]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="h-14"
      className="w-full max-h-14">
      <View className="flex-row gap-2 items-center justify-start">
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

        {elements.map((element, index) => (
          <View
            key={element.text + index}
            className={"rounded-2xl"}
            onLayout={(event) => handleLayout({ event, index })}>
            <Pressable
              onPress={() => setTabIndex(index)}
              className="flex-1 flex-row items-center justify-between">
              <View className="px-4 py-2 flex-1 flex-row items-center justify-between w-full h-full">
                <Animated.Text
                  style={{
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
