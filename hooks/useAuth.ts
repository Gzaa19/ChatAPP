import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import { getAuthUser } from "../utils/authStorage";

/**
 * Custom hook untuk manage auth state
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Firebase Auth akan otomatis restore session jika ada
    // MMKV hanya untuk menyimpan display name
    const storedUser = getAuthUser();
    if (storedUser) {
      setUserName(storedUser.displayName);
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Update userName dari Firebase user jika ada
      if (firebaseUser && firebaseUser.displayName) {
        setUserName(firebaseUser.displayName);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    userName,
    isAuthenticated: !!user,
  };
};
