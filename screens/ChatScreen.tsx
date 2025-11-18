import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  auth,
  signOut,
} from "../firebase";
import { clearAuthUser } from "../utils/authStorage";
import { messagesCollection } from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  saveMessagesToLocal,
  getMessagesFromLocal,
  LocalMessage,
} from "../utils/localStorage";
import MessageList, { Message } from "../components/MessageList";
import ChatInputBar from "../components/ChatInputBar";
import OfflineBanner from "../components/OfflineBanner";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const { name } = route.params;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Add logout button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ color: "#007AFF", fontSize: 16, marginRight: 10 }}>
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        const list: Message[] = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<Message, "id">),
          });
        });
        setMessages(list);
        setIsOnline(true);
        
        // Save to local storage
        const localMessages: LocalMessage[] = list.map((msg) => ({
          id: msg.id,
          text: msg.text,
          user: msg.user,
          userId: msg.userId,
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

  const loadLocalMessages = () => {
    const localMessages = getMessagesFromLocal();
    if (localMessages.length > 0) {
      const mapped: Message[] = localMessages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        user: msg.user,
        userId: msg.userId,
        createdAt: {
          seconds: Math.floor(msg.createdAt / 1000),
          nanoseconds: 0,
        } as any,
      }));
      setMessages(mapped);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear MMKV auth storage
            clearAuthUser();
            
            // Sign out from Firebase
            await signOut(auth);
            
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            Alert.alert("Error", "Gagal logout");
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User tidak terautentikasi");
      return;
    }

    try {
      await addDoc(messagesCollection, {
        text: message,
        user: name,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "Tidak bisa mengirim pesan. Mode offline.");
      console.error("Send message error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <OfflineBanner isOnline={isOnline} />
      <MessageList messages={messages} currentUserId={auth.currentUser?.uid || ""} />
      <ChatInputBar message={message} onChangeText={setMessage} onSend={sendMessage} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEAE2",
  },
});