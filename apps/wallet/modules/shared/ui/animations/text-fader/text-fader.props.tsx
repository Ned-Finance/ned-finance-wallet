import { StyleProp, ViewProps, ViewStyle } from "react-native";

export type TextFaderProps = {
  texts: string[];
  duration?: number; // in ms
  fadeDuration?: number; // in ms
  style?: StyleProp<ViewStyle>;
  className?: string;
  textClassName?: string;
} & ViewProps;
