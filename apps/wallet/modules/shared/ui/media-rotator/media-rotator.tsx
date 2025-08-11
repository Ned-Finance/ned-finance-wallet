import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ProgressView } from "./progress-view";

const DURATION = 30;

type MediaRotatorProps = {
  onIndexChange?: (index: number) => void;
  images: number[] | string[];
};

export const MediaRotator = ({ onIndexChange, images }: MediaRotatorProps) => {
  const [progressIndex, setProgressIndex] = useState(0);
  const progress = useSharedValue(progressIndex);

  const onPressOut = (direction: "left" | "right") => {
    console.log("onPressOut called with direction:", direction);
    switch (direction) {
      case "left":
        if (progressIndex > 0) {
          setProgressIndex(progressIndex - 1);
        } else {
          setProgressIndex(images.length - 1);
        }
        break;
      case "right":
        if (progressIndex < images.length - 1) {
          setProgressIndex(progressIndex + 1);
        } else {
          setProgressIndex(0);
        }
        break;
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    progress.value = progressIndex;
    if (onIndexChange) onIndexChange(progressIndex);
  }, [progressIndex, progress, onIndexChange]);

  return (
    <View className="flex flex-1 h-full">
      <Image
        className="w-full h-full"
        source={images[progressIndex]}
        contentFit="contain"
        transition={500}
        onLoad={() => console.log("Image loaded successfully")}
        onError={(error) => console.log("Image error:", error)}
      />

      <View>
        <ProgressView
          images={images}
          onChange={(index: number) => {
            console.log("ProgressView onChange:", index);
            if (index === images.length) {
              setProgressIndex(0);
            } else {
              setProgressIndex(index);
            }
          }}
          progressIndex={progressIndex}
          enableProgress={true}
          duration={DURATION}
        />
      </View>
      <View className="absolute top-0 left-0 right-0 bottom-0 w-full flex-row">
        <Pressable onPressOut={() => onPressOut("left")}>
          <View className="flex-1 opacity-50" />
        </Pressable>
        <Pressable onPressOut={() => onPressOut("right")}>
          <View className="flex-1 opacity-50" />
        </Pressable>
      </View>
    </View>
  );
};
