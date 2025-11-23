import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";

interface MessageBubbleProps {
  text: string;
  user: string;
  timestamp: string;
  isMyMessage: boolean;
  status?: 'sent' | 'delivered' | 'read';
  imageUrl?: string;
}

export default function MessageBubble({ text, user, timestamp, isMyMessage, status, imageUrl }: MessageBubbleProps) {
  const handleImagePress = () => {
    if (imageUrl) {
      Linking.openURL(imageUrl);
    }
  };
  // Render check marks for message status (WhatsApp style)
  const renderCheckMarks = () => {
    if (!isMyMessage || !status) return null;

    let checkMarks = '';
    let color = '#667781'; // default gray

    switch (status) {
      case 'sent':
        checkMarks = '✓'; // Single check (sent)
        break;
      case 'delivered':
        checkMarks = '✓✓'; // Double check gray (delivered)
        break;
      case 'read':
        checkMarks = '✓✓'; // Double check blue (read)
        color = '#53BDEB'; // WhatsApp blue
        break;
    }

    return <Text style={[styles.checkMark, { color }]}>{checkMarks}</Text>;
  };

  return (
    <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer]}>
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {/* Tail bubble triangle */}
        <View style={[
          styles.bubbleTail,
          isMyMessage ? styles.myMessageTail : styles.otherMessageTail
        ]} />

        {!isMyMessage && <Text style={styles.senderName}>{user}</Text>}
        
        {imageUrl && imageUrl !== 'uploading' && (
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        
        {imageUrl === 'uploading' && (
          <View style={styles.uploadingPlaceholder}>
            <Text style={styles.uploadingText}>📤 Uploading...</Text>
          </View>
        )}
        
        {text ? <Text style={styles.messageText}>{text}</Text> : null}
        
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          {renderCheckMarks()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 3,
    maxWidth: "80%",
    paddingHorizontal: 2,
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.5,
    elevation: 2,
    position: "relative",
  },
  myMessage: {
    backgroundColor: "#DCF8C6", // WhatsApp green
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 0,
  },
  bubbleTail: {
    position: "absolute",
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
  },
  myMessageTail: {
    right: -6,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderTopWidth: 10,
    borderBottomWidth: 0,
    borderLeftColor: "#DCF8C6",
    borderRightColor: "transparent",
    borderTopColor: "#DCF8C6",
    borderBottomColor: "transparent",
  },
  otherMessageTail: {
    left: -6,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderBottomWidth: 0,
    borderLeftColor: "transparent",
    borderRightColor: "#FFFFFF",
    borderTopColor: "#FFFFFF",
    borderBottomColor: "transparent",
  },
  senderName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#075E54",
    marginBottom: 3,
  },
  messageText: {
    fontSize: 15.5,
    color: "#111B21",
    lineHeight: 21,
    marginBottom: 2,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 1,
    gap: 3,
  },
  timestamp: {
    fontSize: 11,
    color: "#667781",
  },
  checkMark: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
  uploadingPlaceholder: {
    width: 200,
    height: 100,
    backgroundColor: '#E9EDEF',
    borderRadius: 8,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 14,
    color: '#667781',
  },
});
