import { useState } from "react";
import { PressableProps, Pressable as RNPressable } from "react-native";
import Animated from "react-native-reanimated";

export const Pressable = ({ children, ...props }: PressableProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Animated.View
      style={{
        opacity: isPressed ? 0.8 : 1,
        transitionProperty: "opacity",
        transitionDuration: "100ms",
      }}>
      <RNPressable
        {...props}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className="flex flex-1 flex-row items-center justify-between bg-ned-background-secondary rounded-2xl">
        {children}
      </RNPressable>
    </Animated.View>
  );
};
