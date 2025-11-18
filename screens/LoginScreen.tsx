import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  auth,
  signInWithEmailAndPassword,
  db,
} from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { saveAuthUser } from "../utils/authStorage";
import AuthHeader from "../components/AuthHeader";
import LogoContainer from "../components/LogoContainer";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    setLoading(true);

    try {
      // Login dengan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Ambil data user dari Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      let displayName = userCredential.user.displayName || "User";

      if (userDoc.exists()) {
        const userData = userDoc.data();
        displayName = userData.username || userData.fullName || displayName;
      }

      // Get auth token
      const token = await userCredential.user.getIdToken();

      // Simpan user data ke MMKV untuk auto-login
      saveAuthUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName: displayName,
        token: token,
      });

      navigation.replace("Chat", { name: displayName });
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Email atau password salah";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "Akun tidak ditemukan. Silakan daftar terlebih dahulu.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Password salah";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Tidak ada koneksi internet";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan. Coba lagi nanti.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="ChatME" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <LogoContainer 
            emoji="💬"
            title="ChatME"
            subtitle="Simple. Secure. Reliable messaging."
          />

          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <CustomInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
              editable={!loading}
            />

            <CustomButton
              title="LOG IN"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.switchTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    gap: 15,
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#667781",
    fontSize: 14,
  },
  switchTextBold: {
    color: "#128C7E",
    fontWeight: "600",
  },
});
