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
import { loginUser } from "../services/authService";
import AuthHeader from "../components/AuthHeader";
import LogoContainer from "../components/LogoContainer";
import CustomInput from "../components/ui/CustomInput";
import CustomButton from "../components/ui/CustomButton";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    setLoading(true);

    const result = await loginUser({
      username: username.trim(),
      password,
    });

    setLoading(false);

    if (result.success) {
      navigation.replace("Chat", { name: result.displayName || "User" });
    } else {
      Alert.alert("Error", result.error || "An error occurred during login");
    }
  };

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient Effect */}
      <View style={styles.headerGradient}>
        <Text style={styles.appName}>ChatME</Text>
        <Text style={styles.tagline}>Connect with friends</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💬</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="LOG IN"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

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
    backgroundColor: "#FFFFFF",
  },
  headerGradient: {
    backgroundColor: "#075E54", // WhatsApp dark green
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#D9FDD3",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "400",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 30,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ECE5DD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 48,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111B21",
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 15,
    color: "#667781",
    fontWeight: "400",
  },
  formContainer: {
    gap: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#128C7E",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#8696A0",
    fontSize: 13,
    fontWeight: "500",
  },
  switchButton: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  switchText: {
    color: "#667781",
    fontSize: 15,
  },
  switchTextBold: {
    color: "#128C7E",
    fontWeight: "700",
  },
});
