import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  Image,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import {
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  auth,
  updateDoc,
  doc,
  db,
} from "../firebase";
import { messagesCollection } from "../firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  saveMessagesToLocal,
  getMessagesFromLocal,
  LocalMessage,
} from "../utils/localStorage";
import { getAuthUser } from "../utils/authStorage";
import { logoutUser } from "../services/authService";
import MessageList, { Message } from "../components/MessageList";
import ChatInputBar from "../components/ChatInputBar";
import OfflineBanner from "../components/OfflineBanner";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export default function ChatScreen({ route, navigation }: Props) {
  const { name } = route.params;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Add custom header with avatar and logout
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#075E54",
      },
      headerTintColor: "#fff",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👥</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Chat Room</Text>
            <Text style={styles.headerSubtitle}>
              {messages.length} messages
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, messages.length]);

  // Load messages from local storage on mount
  useEffect(() => {
    loadLocalMessages();
    // Set online optimistically if we have local messages
    const localMessages = getMessagesFromLocal();
    if (localMessages.length > 0) {
      setIsOnline(true);
    }
  }, []);

  // Sync with Firebase with retry mechanism
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let retryTimeout: ReturnType<typeof setTimeout>;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const setupFirebaseSync = () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        // Retry after delay if auth not ready yet
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          retryTimeout = setTimeout(() => {
            setupFirebaseSync();
          }, 1000); // Retry every 1 second
        } else {
          // Max retries reached, stay offline but keep local messages
          setIsOnline(false);
        }
        return;
      }

      // Auth is ready, setup Firebase sync
      const q = query(messagesCollection, orderBy("createdAt", "asc"));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Message[] = [];
          const currentUserId = auth.currentUser?.uid;

          snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data() as Omit<Message, "id">;
            list.push({
              id: docSnapshot.id,
              ...data,
            });

            if (currentUserId && data.userId !== currentUserId) {
              const currentStatus = data.status || 'sent';

              if (currentStatus === 'sent') {
                updateDoc(doc(db, "messages", docSnapshot.id), {
                  status: 'delivered',
                }).catch(() => { });
              }

              if (currentStatus !== 'read') {
                setTimeout(() => {
                  updateDoc(doc(db, "messages", docSnapshot.id), {
                    status: 'read',
                    readBy: [...(data.readBy || []), currentUserId],
                  }).catch(() => { });
                }, 1000);
              }
            }
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
            imageUrl: msg.imageUrl,
          }));
          saveMessagesToLocal(localMessages);
        },
        (error) => {
          if (error.code === 'permission-denied') {
            Alert.alert(
              "Authentication Error",
              "Please logout and login again to sync messages.",
              [
                {
                  text: "Logout",
                  onPress: handleLogout,
                  style: "destructive"
                },
                {
                  text: "Continue Offline",
                  style: "cancel"
                }
              ]
            );
          }

          setIsOnline(false);
        }
      );
    };

    // Start Firebase sync
    setupFirebaseSync();

    return () => {
      if (unsubscribe) unsubscribe();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
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
        imageUrl: msg.imageUrl,
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
          const result = await logoutUser();

          if (result.success) {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } else {
            Alert.alert("Error", result.error || "Failed to logout");
          }
        },
      },
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const messageText = message.trim();
    const imageToUpload = selectedImage;
    
    // Clear input immediately
    setMessage("");
    setSelectedImage(null);

    try {
      // Kirim message dulu dengan placeholder jika ada image
      const docRef = await addDoc(messagesCollection, {
        text: messageText,
        ...(imageToUpload && { imageUrl: 'uploading' }), // placeholder
        user: name,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'sent',
        readBy: [],
      });

      // Upload image di background (tidak blocking)
      if (imageToUpload) {
        uploadToCloudinary(imageToUpload)
          .then((imageUrl) => {
            if (imageUrl) {
              // Update message dengan imageUrl yang sudah di-upload
              updateDoc(doc(db, "messages", docRef.id), {
                imageUrl: imageUrl,
              }).catch((err) => console.error('Failed to update imageUrl:', err));
            }
          })
          .catch((err) => {
            console.error('Upload error:', err);
            // Hapus placeholder jika upload gagal
            updateDoc(doc(db, "messages", docRef.id), {
              imageUrl: null,
            }).catch(() => {});
          });
      }
    } catch (error: any) {
      console.error('Send error:', error);
      const errorMessage = error?.message || 'Unable to send message';
      Alert.alert("Error", errorMessage);
    }
  };

  const handleAttachment = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleTakePhoto();
          } else if (buttonIndex === 2) {
            handlePickImage();
          }
        }
      );
    } else {
      Alert.alert(
        'Upload Image',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: handleTakePhoto },
          { text: 'Choose from Library', onPress: handlePickImage },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        saveToPhotos: true,
      });

      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
      });

      if (result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <OfflineBanner isOnline={isOnline} />
      <MessageList messages={messages} currentUserId={auth.currentUser?.uid || getAuthUser()?.uid || ""} />
      
      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: selectedImage.uri }} 
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={removeSelectedImage}
          >
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <ChatInputBar 
        message={message} 
        onChangeText={setMessage} 
        onSend={sendMessage}
        onAttachment={handleAttachment}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD", // WhatsApp light background
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#128C7E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#D9FDD3",
    marginTop: 1,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logoutText: {
    fontSize: 20,
  },
  uploadingOverlay: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 14,
  },
  imagePreviewContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});