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
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!validateFullName(fullName)) {
      Alert.alert("Error", "Full name can only contain letters and spaces");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("Error", "Phone number must contain only digits (10-15 characters)");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and confirmation password do not match");
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
      Alert.alert("Success", "Account successfully created!", [
        {
          text: "OK",
          onPress: () => navigation.replace("Chat", { name: fullName.trim() }),
        },
      ]);
    } else {
      Alert.alert("Error", result.error || "An error occurred during registration");
    }
  };

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join ChatME today</Text>
        </View>
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
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>👤</Text>
            </View>
          </View>

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

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

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
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#075E54",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#D9FDD3",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECE5DD",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 42,
  },
  formContainer: {
    gap: 14,
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
