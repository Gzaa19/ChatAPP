# Auth Persistence Flow

## 🔐 Cara Kerja Auth Persistence

### Firebase Auth + AsyncStorage
Firebase Web SDK di React Native **otomatis** menggunakan `@react-native-async-storage/async-storage` untuk menyimpan auth state.

### Flow Diagram:
```
User Login/Register
    ↓
Firebase Auth (signIn/createUser)
    ↓
Firebase SDK auto-save ke AsyncStorage
    ↓
Auth Token + Session disimpan persistent
    ↓
App Restart/Refresh
    ↓
Firebase SDK auto-restore dari AsyncStorage
    ↓
onAuthStateChanged trigger dengan user data
    ↓
User langsung ke Chat Screen (tanpa login ulang)
```

## 📂 Implementation

### 1. **firebase.ts**
```typescript
// Firebase otomatis handle persistence dengan AsyncStorage
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
```

### 2. **hooks/useAuth.ts**
```typescript
// Listen to auth state changes
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // User sudah login (dari persistence atau login baru)
    // Firebase SDK otomatis restore session saat app start
    setUser(firebaseUser);
    
    // Update MMKV untuk display name (optional)
    await saveAuthUser({...});
  }
});
```

### 3. **App.tsx**
```typescript
const { user, loading } = useAuth();

// Jika user sudah login (from AsyncStorage), langsung ke Chat
const initialRoute = user ? "Chat" : "Login";
```

## 🔄 Storage Architecture

### AsyncStorage (Firebase Auth)
- ✅ Auth token & refresh token
- ✅ User session
- ✅ Auto persistence by Firebase SDK
- ✅ Cross-platform (iOS/Android)

### MMKV (App Data)
- ✅ Display name (for quick access)
- ✅ Cached messages
- ✅ App preferences
- ✅ Fast synchronous access

## 🎯 Benefits

1. **Auto-Login**: User tetap login setelah app restart
2. **Token Management**: Firebase handle token refresh otomatis
3. **Security**: Token encryption handled by Firebase
4. **Cross-Platform**: Works on iOS and Android
5. **No Extra Code**: Firebase SDK handle semuanya

## ⚠️ Important Notes

- AsyncStorage untuk Firebase Auth (auto by SDK)
- MMKV untuk app data yang butuh fast sync access
- `onAuthStateChanged` trigger otomatis saat app start jika ada session
- Tidak perlu manual check MMKV untuk auth state
- Firebase SDK auto-refresh expired tokens

## 🧪 Testing

1. Login ke app
2. Close app completely (kill from task manager)
3. Reopen app
4. User langsung masuk ke Chat Screen tanpa login ulang ✅
