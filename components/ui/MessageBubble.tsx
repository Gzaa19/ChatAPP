import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MessageBubbleProps {
  text: string;
  user: string;
  timestamp: string;
  isMyMessage: boolean;
}

export default function MessageBubble({ text, user, timestamp, isMyMessage }: MessageBubbleProps) {
  return (
    <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {!isMyMessage && <Text style={styles.senderName}>{user}</Text>}
        <Text style={styles.messageText}>{text}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    maxWidth: "75%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  myMessage: {
    backgroundColor: "#D9FDD3",
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
  },
  senderName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#075E54",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
    color: "#111B21",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: "#667781",
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
