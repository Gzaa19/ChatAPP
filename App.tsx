import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ChatScreen from "./screens/ChatScreen";
import { auth, onAuthStateChanged } from "./firebase";
import { User } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { getAuthUser, StoredUser } from "./utils/authStorage";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Chat: { name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Firebase Auth akan otomatis restore session jika ada
    // MMKV hanya untuk menyimpan display name
    const storedUser = getAuthUser();
    if (storedUser) {
      setUserName(storedUser.displayName);
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      
      // Update userName dari Firebase user jika ada
      if (u && u.displayName) {
        setUserName(u.displayName);
      }
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Hanya pakai Firebase auth state, bukan MMKV
  const initialRoute = user ? "Chat" : "Login";
  const chatName = userName || user?.displayName || "User";

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
