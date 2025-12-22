// komponen layout buat halaman-halaman autentikasi (login/daftar)
// import komponen Redirect dan Stack dari expo-router buat navigasi
import { Redirect, Stack } from "expo-router";
// import hook useAuth dari clerk buat cek status login user
import { useAuth } from "@clerk/clerk-expo";

// komponen layout buat halaman-halaman autentikasi (login/daftar)
export default function AuthRoutesLayout() {
  // ambil status: apakah auth sudah siap & apakah user sudah login
  const { isLoaded, isSignedIn } = useAuth();

  // kalau data auth belum siap, tampilin kosong dulu
  if (!isLoaded) return null;

  // kalau user sudah login, langsung lempar ke halaman utama
  if (isSignedIn) return <Redirect href="/(index)" />;

  // kalau belum login, tampilin halaman-halaman auth
  return (
    // navigator stack (bisa balik halaman pake tombol back)
    <Stack
      screenOptions={{ // pengaturan umum buat semua halaman di stack ini
        headerShown: false,  // sembunyiin header di semua halaman
        // khusus android: tambahin pengaturan khusus (saat ini kosong)
        ...(process.env.EXPO_OS === "android" 
          ? { 
            // di sini buat tambah pengaturan android kalo perlu
            }
          // penutup if android
          : {}), 
      // penutup screenOptions  
      }} 
    >
      {/* halaman utama auth (welcome screen) */}
      <Stack.Screen
        // halaman landing/sign in utama
        name="index" 
        // nama route dan opsi header
        options={{ headerTitle: "Welcome back!", headerShown: false }} 
      /> 

      {/* halaman login pakai email */}
      <Stack.Screen
        // halaman sign in dengan email & password
        name="sign-in-email" 
        // opsi judul header
        options={{ headerTitle: "Sign in with Email" }} 
      /> 

      {/* halaman daftar akun baru */}
      <Stack.Screen name="sign-up" options={{ headerTitle: "Sign up" }} /> 
      {/* halaman reset password */}
      <Stack.Screen
        // halaman reset password
        name="reset-password" 
        // opsi judul header
        options={{ headerTitle: "Reset password" }} 
      /> 
      {/* halaman privacy policy (saat ini disembunyiin) */}
      {/* <Stack.Screen
        name="privacy-policy"
        options={{ headerTitle: "Privacy Policy" }}
      /> */} 
    </Stack> 
  //
  );
// penutup komponen AuthRoutesLayout
}