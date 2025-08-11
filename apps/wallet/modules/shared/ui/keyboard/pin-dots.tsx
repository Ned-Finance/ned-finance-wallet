import { FC } from "react";
import { View } from "react-native";
import { PinDotsProps } from "./pin-dots.props";

export const PinDots: FC<PinDotsProps> = ({ repeat = 1, code }) => {
  const points = new Array(repeat).fill(null);

  return (
    <View className="flex-row justify-center p-5">
      {points.map((_, index) => (
        <View
          key={index}
          className={`w-5 h-5 rounded-full mx-2.5 ${
            code.length > index ? "bg-ned-primary" : "bg-ned-muted/50"
          }`}></View>
      ))}
    </View>
  );
};
