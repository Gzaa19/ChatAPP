import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { createMMKV } from "react-native-mmkv";

const firebaseConfig = {
  apiKey: "AIzaSyD7c2lNMscIxy-2evVvaHnnyL4HAJKZue0",
  authDomain: "chatapp-b334f.firebaseapp.com",
  projectId: "chatapp-b334f",
  storageBucket: "chatapp-b334f.firebasestorage.app",
  messagingSenderId: "508792122452",
  appId: "1:508792122452:ios:2a52fa86d90e649e5551c1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize MMKV storage untuk app data (messages, etc)
export const storage = createMMKV({
  id: "chatapp-storage",
  encryptionKey: "chatapp-secure-key-2024",
});

// Initialize Auth
// Firebase Web SDK di React Native OTOMATIS menggunakan @react-native-async-storage/async-storage
// untuk auth persistence. Tidak perlu setup manual!
// Auth state akan otomatis persist setelah app restart/refresh
const auth = getAuth(app);

export const messagesCollection = collection(
  db,
  "messages"
) as CollectionReference<DocumentData>;

export {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
};
