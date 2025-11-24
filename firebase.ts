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
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  initializeAuth,
  // @ts-ignore - getReactNativePersistence exists but not in type definitions
  getReactNativePersistence,
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

export const storage = createMMKV({
  id: "chatapp-storage",
  encryptionKey: "chatapp-secure-key-2024",
});

const MMKVStorage = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(MMKVStorage),
});

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
  updateDoc,
  doc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
};
