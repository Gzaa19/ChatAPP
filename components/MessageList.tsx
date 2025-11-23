import React from "react";
import { FlatList, StyleSheet } from "react-native";
import MessageBubble from "./ui/MessageBubble";

export interface Message {
  id: string;
  text: string;
  user: string;
  userId: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  status?: 'sent' | 'delivered' | 'read';
  readBy?: string[];
  imageUrl?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const renderItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.userId === currentUserId;
    const timestamp = item.createdAt?.seconds
      ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "";

    return (
      <MessageBubble
        text={item.text}
        user={item.user}
        timestamp={timestamp}
        isMyMessage={isMyMessage}
        status={item.status}
        imageUrl={item.imageUrl}
      />
    );
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.messagesList}
      inverted={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  messagesList: {
    padding: 12,
    paddingBottom: 16,
  },
});
