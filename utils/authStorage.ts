import { storage } from "../firebase";

const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_SESSION_KEY = "auth_session";

export interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  token?: string;
  lastLogin?: number;
}

/**
 * Save user data dan auth session ke MMKV
 */
export const saveAuthUser = (user: StoredUser) => {
  const userData = {
    ...user,
    lastLogin: Date.now(),
  };

  storage.set(AUTH_USER_KEY, JSON.stringify(userData));

  if (user.token) {
    storage.set(AUTH_TOKEN_KEY, user.token);
  }

  storage.set(AUTH_SESSION_KEY, "active");
};

/**
 * Get user data dari MMKV
 */
export const getAuthUser = (): StoredUser | null => {
  try {
    const userData = storage.getString(AUTH_USER_KEY);
    if (!userData) {
      return null;
    }

    const user = JSON.parse(userData);
    const token = storage.getString(AUTH_TOKEN_KEY);
    const session = storage.getString(AUTH_SESSION_KEY);

    if (session !== "active") {
      return null;
    }

    return { ...user, token };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
};

/**
 * Clear semua auth data dari MMKV
 */
export const clearAuthUser = () => {
  storage.remove(AUTH_USER_KEY);
  storage.remove(AUTH_TOKEN_KEY);
  storage.remove(AUTH_SESSION_KEY);
};

/**
 * Check apakah user sudah login (ada session aktif)
 */
export const isUserLoggedIn = (): boolean => {
  const session = storage.getString(AUTH_SESSION_KEY);
  const hasUser = storage.contains(AUTH_USER_KEY);
  return session === "active" && hasUser;
};

/**
 * Update user display name
 */
export const updateUserDisplayName = (displayName: string) => {
  const user = getAuthUser();
  if (user) {
    saveAuthUser({
      ...user,
      displayName,
    });
  }
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
  return storage.getString(AUTH_TOKEN_KEY) || null;
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (): boolean => {
  const user = getAuthUser();
  if (!user || !user.lastLogin) return true;

  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const isExpired = (now - user.lastLogin) > THIRTY_DAYS;

  if (isExpired) {
    clearAuthUser();
  }

  return isExpired;
};
