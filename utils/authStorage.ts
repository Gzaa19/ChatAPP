import { storage } from "../firebase";

const AUTH_USER_KEY = "auth_user";
const AUTH_TOKEN_KEY = "auth_token";

export interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  token?: string;
}

export const saveAuthUser = (user: StoredUser) => {
  storage.set(AUTH_USER_KEY, JSON.stringify(user));
  if (user.token) {
    storage.set(AUTH_TOKEN_KEY, user.token);
  }
};

export const getAuthUser = (): StoredUser | null => {
  const userData = storage.getString(AUTH_USER_KEY);
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    const token = storage.getString(AUTH_TOKEN_KEY);
    return { ...user, token };
  } catch {
    return null;
  }
};

export const clearAuthUser = () => {
  storage.remove(AUTH_USER_KEY);
  storage.remove(AUTH_TOKEN_KEY);
};

export const isUserLoggedIn = (): boolean => {
  return storage.contains(AUTH_USER_KEY);
};
