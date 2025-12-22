// halaman utama auth (landing sign in)
// komponen dan hook yang dibutuhkan
import React from "react";

// buat getar feedback pas input/sukses (haptic feedback)
import * as Haptics from "expo-haptics";

// navigasi halaman
import { useRouter, Href } from "expo-router";

// komponen landing dengan opsi sign in
import { Platform } from "react-native";

// buat login dan cek error dari clerk
import { isClerkAPIResponseError, useSignIn, useSSO } from "@clerk/clerk-expo";

// utilitas buka browser (untuk SSO)
import * as WebBrowser from "expo-web-browser";

// tipe error dari clerk buat type safety
import * as AuthSession from "expo-auth-session";

// tipe error dari clerk buat type safety
import { ClerkAPIError } from "@clerk/types";

// komponen landing dengan opsi sign in
import Landing from "@/components/Landing";

// menyelesaikan sesi autentikasi web yang tertunda (jika ada)
WebBrowser.maybeCompleteAuthSession();

// komponen utama halaman sign in
export default function SignIn() {
  // ambil fungsi startSSOFlow buat SSO
  const { startSSOFlow } = useSSO();
  // inisialisasi router buat navigasi halaman
  const { setActive } = useSignIn();
  // inisialisasi router buat navigasi halaman
  const router = useRouter();
  // state buat nyimpen error dari clerk
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  // fungsi buat sign in dengan Google (masih aktif tapi nggak dipake di android)
  const handleSignInWithGoogle = React.useCallback(async () => {
    // kasih getar pas klik di android biar ada feedback
    if (process.env.EXPO_OS === "android") {
      // jalankan getar medium 
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // penutup if android 
    }
    // coba proses SSO dengan Google
    try {
      // mulai alur login google via clerk
      const result = await startSSOFlow({
        // pakai strategi google
        strategy: "oauth_google",
        // url redirect setelah login (harus didaftarin di clerk dashboard)
        redirectUrl: AuthSession.makeRedirectUri({ path: "(auth)" }),
      // penutup startSSOFlow
      });

      // kalau berhasil dan dapat session id, aktifin session tersebut
      if (result.createdSessionId && result.setActive) {
        // aktifin session baru
        await result.setActive({ session: result.createdSessionId });
        // navigasi ke halaman utama aplikasi
        router.replace("/(index)");
      // penutup if result
      }

    // penutup try
    } catch (err) {
      // tangkap error dari clerk
      if (isClerkAPIResponseError(err)) {
        // simpan error di state
        setErrors(err.errors);
      // penutup if isClerkAPIResponseError 
      }
      // log error buat debugging
      console.error(JSON.stringify(err, null, 2));
    // penutup catch  
    }
  // dependensi buat useCallback
  }, [startSSOFlow, router]);

  // fungsi navigasi ke halaman lain (misal ke login email)
  const onNavigatePress = React.useCallback(
    // fungsi terima href tujuan
    (href: string) => {
      // kasih getar pas klik di android biar ada feedback
      if (process.env.EXPO_OS === "android") {
        // jalankan getar medium  
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // penutup if android
      }
      // navigasi ke halaman tujuan
      router.push(href as Href);
    // penutup fungsi
    },
    // dependensi: router aja
    [router]
  // penutup useCallback
  );
  // render halaman landing dengan opsi sign in
  return (
    // komponen landing dengan tombol sign in
    <Landing
      // props untuk tombol sign in dengan email
      onEmailSignIn={() => onNavigatePress("/sign-in-email")} 
    />
  // penutup return
  );
// penutup komponen SignIn
}