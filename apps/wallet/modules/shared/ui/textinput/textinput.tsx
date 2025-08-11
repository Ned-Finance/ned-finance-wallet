import React from "react";
import { TextInput as RNTextInput } from "react-native";
import { TextInputProps } from "./textinput.props";

export const TextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return (
    <RNTextInput
      {...props}
      className={`bg-ned-background-secondary outline-none border-ned-muted/20 border rounded-lg p-4 text-white ${props.className}`}
    />
  );
};

export default TextInput;
