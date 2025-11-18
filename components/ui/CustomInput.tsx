import React from "react";
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from "react-native";

interface CustomInputProps extends TextInputProps {
  style?: ViewStyle;
}

export default function CustomInput({ style, ...props }: CustomInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#8696A0"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E9EDEF",
    color: "#111B21",
  },
});
