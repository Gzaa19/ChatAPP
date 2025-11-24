# ChatME - React Native Chat Application

ChatME adalah aplikasi obrolan real-time yang dibangun menggunakan React Native dan Firebase. Aplikasi ini menawarkan antarmuka modern, autentikasi pengguna yang aman, dan penyimpanan lokal yang efisien untuk pengalaman pengguna yang mulus.

## Fitur Utama

- **Real-time Messaging**: Kirim dan terima pesan secara instan menggunakan Firebase Firestore.
- **Autentikasi Pengguna**: Login dan Registrasi aman dengan Firebase Authentication.
- **Penyimpanan Lokal Persisten**: Menggunakan MMKV untuk menyimpan sesi login, memungkinkan fitur auto-login yang cepat.
- **Dukungan Offline**: Banner notifikasi saat perangkat kehilangan koneksi internet.
- **Antarmuka Modern**: Desain UI yang bersih dan responsif mirip dengan aplikasi chat populer.
- **Navigasi Mulus**: Menggunakan React Navigation untuk transisi antar layar yang halus.

## Teknologi yang Digunakan

- **Core**: [React Native](https://reactnative.dev/) (v0.82), [TypeScript](https://www.typescriptlang.org/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **State & Storage**: [React Native MMKV](https://github.com/miouss/react-native-mmkv) (High performance storage)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Native Stack)
- **Icons**: [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- **Media**: [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)

## Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi LTS disarankan, >= 20)
- [JDK](https://www.oracle.com/java/technologies/javase-downloads.html) (Java Development Kit)
- [Android Studio](https://developer.android.com/studio) (untuk pengembangan Android)
- [Xcode](https://developer.apple.com/xcode/) (untuk pengembangan iOS, hanya macOS)
- React Native CLI environment yang sudah dikonfigurasi.

## Instalasi dan Menjalankan Project

1. **Clone repositori ini**
   ```bash
   git clone https://github.com/username/ChatApp.git
   cd ChatApp
   ```

2. **Instal dependensi**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Konfigurasi Firebase**
   - Buat project di Firebase Console.
   - Aktifkan Authentication (Email/Password) dan Firestore Database.
   - Salin konfigurasi Firebase Anda ke dalam file `firebase.ts` (pastikan file ini ada dan dikonfigurasi dengan benar).

4. **Jalankan Aplikasi**

   Start Metro Bundler:
   ```bash
   npm start
   ```

   Untuk Android:
   ```bash
   npm run android
   ```

   Untuk iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

## 📂 Susunan Project

```text
ChatApp/
├── components/         # Komponen UI yang dapat digunakan kembali (ChatInput, MessageList, dll)
├── hooks/              # Custom React Hooks (useAuth, dll)
├── screens/            # Layar utama aplikasi (Login, Register, Chat)
├── services/           # Layanan eksternal atau API calls
├── utils/              # Fungsi utilitas dan helper (authStorage, dll)
├── App.tsx             # Entry point aplikasi dan konfigurasi navigasi
├── firebase.ts         # Konfigurasi dan inisialisasi Firebase
└── package.json        # Daftar dependensi project
```

## Contoh Penggunaan

1. **Registrasi**: Buka aplikasi, pilih "Register", masukkan nama, email, dan password untuk membuat akun baru.
2. **Login**: Jika sudah punya akun, masuk menggunakan email dan password.
3. **Chatting**: Setelah login, Anda akan diarahkan ke Chat Room. Ketik pesan di bar input dan tekan kirim. Pesan akan muncul secara real-time.
4. **Logout**: (Jika fitur tersedia di UI) Gunakan tombol logout untuk keluar dan menghapus sesi lokal.

## Lisensi

Project ini dilisensikan di bawah lisensi **MIT**.

```text
MIT License

Copyright (c) 2025 ChatApp Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
