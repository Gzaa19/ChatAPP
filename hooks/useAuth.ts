import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "../firebase";
import { User } from "firebase/auth";
import {
  getAuthUser,
  saveAuthUser,
  clearAuthUser,
  isUserLoggedIn,
  isSessionExpired
} from "../utils/authStorage";

/**
 * Custom hook untuk manage auth state dengan MMKV persistence
 */
export const useAuth = () => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    let authTimeout: ReturnType<typeof setTimeout>;

    // Check MMKV first for faster initial load
    const initAuth = () => {
      if (isSessionExpired()) {
        clearAuthUser();
        setInitializing(false);
        return;
      }

      const storedUser = getAuthUser();
      if (storedUser) {
        setUserName(storedUser.displayName);
        // Don't set user yet, wait for Firebase to confirm
      }
    };

    initAuth();

    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const storedUser = getAuthUser();
        const displayName = firebaseUser.displayName || storedUser?.displayName || "User";

        setUser(firebaseUser);
        setUserName(displayName);

        try {
          const token = await firebaseUser.getIdToken();
          await saveAuthUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: displayName,
            token,
          });
        } catch (error) {
          console.error("Error saving to MMKV:", error);
        }

        setInitializing(false);
      } else {
        setUser(null);
        setUserName("");

        const hasStoredUser = isUserLoggedIn();
        if (hasStoredUser) {
          await clearAuthUser();
        }

        setInitializing(false);
      }
    });

    // Timeout to prevent infinite loading
    authTimeout = setTimeout(() => {
      if (initializing) {
        setInitializing(false);
      }
    }, 1500); // Reduced from 3000ms to 1500ms for faster loading

    return () => {
      unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  return {
    user,
    loading: initializing,
    userName,
    isAuthenticated: !!user || isUserLoggedIn(),
  };
};
