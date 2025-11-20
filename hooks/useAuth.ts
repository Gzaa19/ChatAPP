import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import { getAuthUser, saveAuthUser } from "../utils/authStorage";

/**
 * Custom hook untuk manage auth state dengan Firebase persistence
 * Firebase Auth otomatis restore session setelah app restart
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Load stored user name dari MMKV untuk display cepat
    const storedUser = getAuthUser();
    if (storedUser) {
      setUserName(storedUser.displayName);
    }

    // Firebase onAuthStateChanged akan trigger otomatis saat:
    // 1. App start dan ada user yang sudah login (from AsyncStorage persistence)
    // 2. User login/logout
    // 3. Token refresh
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // User sudah login (bisa dari persistence atau login baru)
        const displayName = firebaseUser.displayName || storedUser?.displayName || "User";
        setUserName(displayName);

        // Update MMKV storage dengan data terbaru
        try {
          const token = await firebaseUser.getIdToken();
          await saveAuthUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: displayName,
            token,
          });
        } catch (error) {
          console.error("Error saving auth user:", error);
        }
      } else {
        // User logout atau tidak ada session
        setUserName("");
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
