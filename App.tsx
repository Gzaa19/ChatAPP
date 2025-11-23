import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChatScreen from "./screens/ChatScreen";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuth } from "./hooks/useAuth";
import { isUserLoggedIn, getAuthUser } from "./utils/authStorage";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chat: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, loading, userName } = useAuth();
  const [initialRoute, setInitialRoute] = useState<"Login" | "Chat">("Login");
  const [isReady, setIsReady] = useState(false);

  // Determine initial route based on MMKV storage
  useEffect(() => {
    const checkAuth = async () => {
      const hasSession = isUserLoggedIn();
      const storedUser = getAuthUser();

      if (hasSession && storedUser) {
        setInitialRoute("Chat");
      } else {
        setInitialRoute("Login");
      }

      setIsReady(true);
    };

    checkAuth();
  }, []);

  // Show loading screen only briefly
  // Don't wait for Firebase Auth if we have MMKV session
  if (!isReady || (loading && !isUserLoggedIn())) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#075E54"
      }}>
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#128C7E",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Text style={{ fontSize: 50 }}>💬</Text>
        </View>
        <Text style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#FFFFFF",
          marginBottom: 10,
          letterSpacing: 1,
        }}>ChatME</Text>
        <ActivityIndicator size="large" color="#25D366" style={{ marginTop: 10 }} />
      </View>
    );
  }

  const storedUser = getAuthUser();
  const chatName = storedUser?.displayName || userName || user?.displayName || "User";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={{ name: chatName }}
          options={{
            title: "Chat Room",
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
