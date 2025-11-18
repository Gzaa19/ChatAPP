import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  db,
} from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { saveAuthUser, clearAuthUser } from "../utils/authStorage";

export interface RegisterData {
  fullName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register user baru dengan Firebase Auth dan Firestore
 */
export const registerUser = async (data: RegisterData) => {
  try {
    // 1. Buat user dengan Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email.trim(),
      data.password
    );

    // 2. Update profile dengan display name
    await updateProfile(userCredential.user, {
      displayName: data.fullName.trim(),
    });

    // 3. Simpan data user ke Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      createdAt: new Date().toISOString(),
    });

    // 4. Simpan ke MMKV storage untuk display name
    const token = await userCredential.user.getIdToken();
    await saveAuthUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email || "",
      displayName: data.fullName.trim(),
      token,
    });

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat registrasi",
    };
  }
};

/**
 * Login user dengan Firebase Auth
 */
export const loginUser = async (data: LoginData) => {
  try {
    // 1. Login dengan Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email.trim(),
      data.password
    );

    // 2. Ambil data user dari Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();

    // 3. Simpan ke MMKV storage
    const token = await userCredential.user.getIdToken();
    await saveAuthUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email || "",
      displayName: userData?.fullName || userCredential.user.displayName || "",
      token,
    });

    return {
      success: true,
      user: userCredential.user,
      displayName: userData?.fullName || userCredential.user.displayName || "",
    };
  } catch (error: any) {
    let errorMessage = "Email atau password salah";

    if (error.code === "auth/user-not-found") {
      errorMessage = "User tidak ditemukan";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Password salah";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Format email tidak valid";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Logout user dari Firebase Auth
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    await clearAuthUser();

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Terjadi kesalahan saat logout",
    };
  }
};

/**
 * Validasi format email
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validasi nama lengkap (hanya huruf dan spasi)
 */
export const validateFullName = (name: string): boolean => {
  const re = /^[a-zA-Z\s]+$/;
  return re.test(name);
};

/**
 * Validasi nomor telepon (hanya angka, 10-15 digit)
 */
export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10,15}$/;
  return re.test(phone);
};
