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
    backgroundColor: "#F7F8FA",
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#E9EDEF",
    color: "#111B21",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
