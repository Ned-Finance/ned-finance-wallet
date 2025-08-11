import React from "react";

export type ButtonProps = {
  text?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
};
