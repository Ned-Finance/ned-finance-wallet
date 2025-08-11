import React, { useState } from "react";
import { View } from "react-native";

const OFFSET = 100;

type ProgressItemProps = {
  size: number;
  duration: number;
  currentIndex: number;
  progressIndex: number;
  enableProgress: boolean;
  onChangePosition: () => void;
};

export const ProgressViewItem = (props: ProgressItemProps) => {
  const [progress, setProgress] = useState(0);

  const {
    onChangePosition,
    duration,
    currentIndex,
    progressIndex,
    enableProgress,
  } = props;

  React.useEffect(() => {
    if (currentIndex === progressIndex) {
      setProgress(0);
    }
    if (currentIndex >= progressIndex) {
      setProgress(0);
    }
    if (currentIndex < progressIndex) {
      setProgress(100);
    }
  }, [currentIndex, progressIndex]);

  React.useEffect(() => {
    if (currentIndex === progressIndex) {
      const intervalId = setTimeout(() => {
        if (progress >= OFFSET - 1) {
          onChangePosition();
        } else {
          if (enableProgress) {
            setProgress(progress + 1);
          }
        }
      }, duration);
      return () => {
        clearTimeout(intervalId);
      };
    }
  }, [
    progress,
    onChangePosition,
    duration,
    currentIndex,
    progressIndex,
    enableProgress,
  ]);

  return (
    <View className="rounded-2xl bg-ned-muted w-full">
      {currentIndex === progressIndex && (
        <View
          className="rounded-2xl bg-ned-primary w-full h-10"
          style={{
            width: `${progress}%`,
          }}
        />
      )}

      {currentIndex !== progressIndex && (
        <View className="rounded-2xl bg-ned-muted w-full" />
      )}
    </View>
  );
};
