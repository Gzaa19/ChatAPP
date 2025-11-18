import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

interface ChatInputBarProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export default function ChatInputBar({ message, onChangeText, onSend }: ChatInputBarProps) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#8696A0"
          value={message}
          onChangeText={onChangeText}
          multiline={true}
          maxLength={1000}
          returnKeyType="default"
          blurOnSubmit={false}
        />
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSend}
        disabled={!message.trim()}
      >
        <Text style={styles.sendButtonText}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#F0F2F5",
    alignItems: "flex-end",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    minHeight: 42,
    maxHeight: 100,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: "#111B21",
    maxHeight: 80,
    minHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
