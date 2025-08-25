import { useState } from "react";
import { PressableProps, Pressable as RNPressable } from "react-native";
import Animated from "react-native-reanimated";
import { cn } from "../../utils/ui";

export const Pressable = ({ children, ...props }: PressableProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Animated.View
      style={{
        opacity: isPressed ? 1 : 1,
        transitionProperty: "opacity",
        transitionDuration: "100ms",
      }}>
      <RNPressable
        {...props}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className={cn(
          "flex flex-1 items-center justify-between rounded-2xl",
          props.className ?? ""
        )}>
        {children}
      </RNPressable>
    </Animated.View>
  );
};
