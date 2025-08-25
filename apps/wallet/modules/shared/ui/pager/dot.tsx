import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export function Dot({ index, x }: { index: number; x: SharedValue<number> }) {
  const { width } = useWindowDimensions();

  const style = useAnimatedStyle(() => {
    const progress = interpolate(
      x.value / width,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5]
    );
    return {
      transform: [{ scale: progress }],
      opacity: progress,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
          backgroundColor: "#999",
        },
        style,
      ]}
    />
  );
}
