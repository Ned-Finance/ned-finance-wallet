import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ButtonProps } from "./button.props";

export const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className = "",
  textClassName = "",
}) => {
  const getButtonClasses = () => {
    const baseClasses = "flex-row items-center justify-center rounded-3xl";

    const variantClasses = {
      primary: "bg-ned-primary",
      secondary: "bg-ned-secondary",
      outline: "border border-ned-primary bg-transparent",
      ghost: "bg-transparent",
    };

    const sizeClasses = {
      sm: "px-4 py-2 min-h-12",
      md: "px-6 py-3 min-h-14",
      lg: "px-8 py-4 min-h-16",
    };

    const disabledClasses = disabled ? "opacity-50" : "active:opacity-80";

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  };

  const getTextClasses = () => {
    const baseClasses = "text-center";

    const variantTextClasses = {
      primary: "text-ned-background",
      secondary: "text-ned-inverse",
      outline: "text-ned-primary",
      ghost: "text-ned-primary",
    };

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return `${baseClasses} ${variantTextClasses[variant]} ${sizeClasses[size]} ${textClassName}`;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled}>
      {children ? children : <Text className={getTextClasses()}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default Button;
