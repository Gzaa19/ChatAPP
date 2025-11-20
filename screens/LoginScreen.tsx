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
import { loginUser, validateEmail } from "../services/authService";
import AuthHeader from "../components/AuthHeader";
import LogoContainer from "../components/LogoContainer";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    const result = await loginUser({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (result.success) {
      navigation.replace("Chat", { name: result.displayName || "User" });
    } else {
      Alert.alert("Error", result.error || "Terjadi kesalahan saat login");
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
              placeholder="Gmail"
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
