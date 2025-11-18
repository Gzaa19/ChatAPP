import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  registerUser,
  validateEmail,
  validateFullName,
  validatePhone,
} from "../services/authService";
import LogoContainer from "../components/LogoContainer";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    // Validasi input
    if (!fullName.trim() || !username.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    if (!validateFullName(fullName)) {
      Alert.alert("Error", "Nama lengkap hanya boleh berisi huruf dan spasi");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("Error", "Nomor HP hanya boleh berisi angka (10-15 digit)");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi password tidak sama");
      return;
    }

    setLoading(true);

    const result = await registerUser({
      fullName: fullName.trim(),
      username: username.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert("Berhasil", "Akun berhasil dibuat!", [
        {
          text: "OK",
          onPress: () => navigation.replace("Chat", { name: fullName.trim() }),
        },
      ]);
    } else {
      Alert.alert("Error", result.error || "Terjadi kesalahan saat registrasi");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LogoContainer 
            emoji="👤"
            title="Create Account"
          />

          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={(text: string) => {
                const filtered = text.replace(/[^a-zA-Z\s]/g, '');
                setFullName(filtered);
              }}
              keyboardType="default"
              editable={!loading}
            />

            <CustomInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />

            <CustomInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text: string) => {
                const filtered = text.replace(/[^0-9]/g, '');
                setPhone(filtered);
              }}
              keyboardType="number-pad"
              editable={!loading}
            />

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

            <CustomInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
              editable={!loading}
            />

            <CustomButton
              title="SIGN UP"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
            />

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.switchTextBold}>Log in</Text>
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
  header: {
    backgroundColor: "#075E54",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  backButton: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 30,
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
