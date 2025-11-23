import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ChatInputBarProps {
  message: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttachment?: () => void;
}

export default function ChatInputBar({ message, onChangeText, onSend, onAttachment }: ChatInputBarProps) {
  return (
    <View style={styles.inputContainer}>
      {/* Attachment Button */}
      <TouchableOpacity style={styles.iconButton} onPress={onAttachment}>
        <Ionicons name="attach" size={24} color="#A0A0A0" />
      </TouchableOpacity>

      {/* Input Field */}
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

        {/* Emoji Button inside input */}
        <TouchableOpacity style={styles.emojiButton}>
          <Icon name="emoji-emotions" size={24} color="#667781" />
        </TouchableOpacity>
      </View>

      {/* Send or Voice Button */}
      {message.trim() ? (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    padding: 6,
    backgroundColor: "#F0F2F5",
    alignItems: "flex-end",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconText: {
    fontSize: 22,
    color: '#A0A0A0',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    minHeight: 44,
    maxHeight: 100,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111B21",
    maxHeight: 80,
    minHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  emojiButton: {
    paddingLeft: 6,
    paddingRight: 2,
  },
  emojiText: {
    fontSize: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#25D366", // WhatsApp green
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#25D366",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#25D366",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  voiceButtonText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
