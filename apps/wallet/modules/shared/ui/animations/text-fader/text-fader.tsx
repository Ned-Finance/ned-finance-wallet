import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { TextFaderProps } from "./text-fader.props";

export const TextFader: React.FC<TextFaderProps> = ({
  texts,
  duration = 3000,
  fadeDuration = 200,
  style,
  className,
  textClassName = "text-white text-center text-md",
  ...rest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);

  const currentText = useMemo(
    () => texts[currentIndex % texts.length],
    [currentIndex, texts]
  );

  const opacity = useSharedValue(1);

  useEffect(() => {
    console.log("entra => ", opacity.value);
    const changeText = () => {
      return setTimeout(() => {
        // Fade out current text
        opacity.value = withTiming(0, { duration: fadeDuration }, () => {
          // After fade out, change to next text and fade in
          setCurrentIndex(nextIndex);
          setNextIndex((nextIndex + 1) % texts.length);
          opacity.value = withTiming(1, { duration: fadeDuration });
        });
      }, duration);
    };

    const timeout = changeText();

    return () => {
      clearTimeout(timeout);
    };
  }, [texts.length, duration, fadeDuration, nextIndex, currentIndex, opacity]);

  return (
    <View className={`flex justify-center items-center w-full ${className}`}>
      <View className="relative w-full h-10">
        <Animated.View
          {...rest}
          style={[
            style,
            {
              position: "absolute",
              left: 0,
              right: 0,
              opacity: opacity,
            },
          ]}>
          <Text className={textClassName}>{currentText}</Text>
        </Animated.View>
      </View>
    </View>
  );
};
