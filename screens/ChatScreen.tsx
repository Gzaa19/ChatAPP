import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "../firebase";
import { messagesCollection } from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  saveMessagesToLocal,
  getMessagesFromLocal,
  LocalMessage,
} from "../utils/localStorage";

type MessageType = {
  id: string;
  text: string;
  user: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route }: Props) {
  const { name } = route.params;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Load messages from local storage on mount
  useEffect(() => {
    loadLocalMessages();
  }, []);

  // Sync with Firebase
  useEffect(() => {
    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: MessageType[] = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<MessageType, "id">),
          });
        });
        setMessages(list);
        setIsOnline(true);
        
        // Save to local storage
        const localMessages: LocalMessage[] = list.map((msg) => ({
          id: msg.id,
          text: msg.text,
          user: msg.user,
          createdAt: msg.createdAt?.seconds
            ? msg.createdAt.seconds * 1000
            : Date.now(),
        }));
        saveMessagesToLocal(localMessages);
      },
      (error) => {
        console.error("Firebase error:", error);
        setIsOnline(false);
      }
    );
    return () => unsub();
  }, []);

  const loadLocalMessages = async () => {
    const localMessages = await getMessagesFromLocal();
    if (localMessages.length > 0) {
      const formattedMessages: MessageType[] = localMessages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        user: msg.user,
        createdAt: {
          seconds: Math.floor(msg.createdAt / 1000),
          nanoseconds: 0,
        },
      }));
      setMessages(formattedMessages);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(messagesCollection, {
        text: message,
        user: name,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "Tidak bisa mengirim pesan. Mode offline.");
      console.error("Send message error:", error);
    }
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.msgBox,
        item.user === name ? styles.myMsg : styles.otherMsg,
      ]}
    >
      <Text style={styles.sender}>{item.user}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📴 Mode Offline</Text>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontWeight: "bold",
  },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
});