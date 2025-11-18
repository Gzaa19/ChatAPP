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
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7c2lNMscIxy-2evVvaHnnyL4HAJKZue0",
  authDomain: "chatapp-b334f.firebaseapp.com",
  projectId: "chatapp-b334f",
  storageBucket: "chatapp-b334f.firebasestorage.app",
  messagingSenderId: "508792122452",
  appId: "1:508792122452:ios:2a52fa86d90e649e5551c1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  signInAnonymously,
  onAuthStateChanged,
};
