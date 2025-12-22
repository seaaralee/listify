// halaman login pakai email & password
// import react biar bisa bikin komponen
import React from "react";
// buat getar feedback pas input/sukses (haptic feedback)
import * as Haptics from "expo-haptics";
// buat navigasi halaman
import { useRouter } from "expo-router";
// komponen dasar react native: styling, view, teks, tombol, input
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
// scroll view kustom dengan padding/styling konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";
// buat login dan cek error dari clerk
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
// tipe error dari clerk buat type safety
import { ClerkAPIError } from "@clerk/types";
// ikon dari expo (buat mata show/hide password, dll)
import { Ionicons } from "@expo/vector-icons";

// komponen buat halaman login pakai email & password
export default function SignInEmail() {
  // ambil fungsi sign in, setActive (buat aktifin session), dan status load clerk
  const { signIn, setActive, isLoaded } = useSignIn();
  // buat navigasi (kembali, pindah halaman, dll)
  const router = useRouter();

  // state buat email
  const [emailAddress, setEmailAddress] = React.useState("");
  // state buat password
  const [password, setPassword] = React.useState("");
  // state buat nampilin/sembunyiin password
  const [showPassword, setShowPassword] = React.useState(false);
  // loading state pas lagi proses login
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  // nyimpen error dari clerk
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  // fungsi utama login
  const onSignInPress = React.useCallback(async () => {
    // tunggu clerk selesai load
    if (!isLoaded) return;

    // kasih getar feedback pas klik login
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // aktifin loading
    setIsSigningIn(true);
    // bersihin error sebelumnya
    setErrors([]);

    // coba proses login
    try {
      // coba login ke clerk
      const attempt = await signIn.create({
        identifier: emailAddress, // email
        password, // password
      });

      // kalau sukses dan session udah siap
      if (attempt.status === "complete") {
        // aktifin session baru
        await setActive({ session: attempt.createdSessionId });
        // alihkan ke halaman utama (home)
        router.replace("/(index)");
        // kalau gagal
      }
      // tangkap error kalo ada
    } catch (err) {
      // kalau error dari clerk, simpen pesannya
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      // penutup try-catch
    } finally {
      // matiin loading apapun hasilnya
      setIsSigningIn(false);
      // penutup if (!isLoaded)
    }
    // dependensi buat useCallback
  }, [isLoaded, emailAddress, password]);

  // render tampilan halaman
  return (
    // layout utama dengan scroll
    <BodyScrollView contentContainerStyle={styles.container}>
      {/* tombol kembali ke halaman sebelumnya */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        {/* ikon panah kembali */}
        <Ionicons name="arrow-back-outline" size={24} color="#F681AD" />
      </TouchableOpacity>

      {/* ikon kecil di pojok kiri atas */}
      <View style={styles.iconWrapper}>
        {/* ikon tas */}
        <Ionicons name="bag-handle" size={20} color="#C73572" />
      </View>

      {/* judul halaman */}
      <Text style={styles.title}>Sign in to your{"\n"}Account</Text>
      {/* subjudul deskripsi */}
      <Text style={styles.subtitle}>
        Enter your email and password to log in
      </Text>

      {/* bagian form */}
      <View style={styles.formSection}>
        {/* input email */}
        <View>
          {/* label untuk input email */}
          <Text style={styles.label}>Email</Text>
          {/* input email */}
          <RNTextInput
            value={emailAddress} // isi dengan email
            onChangeText={setEmailAddress} // terima perubahan text
            placeholder="Enter your email" // placeholder
            placeholderTextColor="#999" //  warna placeholder
            autoCapitalize="none" // matiin auto kapital (email biasanya lowercase)
            keyboardType="email-address" // keyboard khusus email
            style={styles.input} // gaya input
          />
        </View>

        {/* input password (ada tombol mata) */}
        <View style={{ marginBottom: 20 }}>
          {/* label untuk input password */}
          <Text style={styles.label}>Set Password</Text>

          {/* wrapper buat input + ikon mata */}
          <View style={styles.inputWrapper}>
            {/* input password */}
            <RNTextInput
              // isi dengan password
              value={password}
              // sembunyiin teks kalau showPassword false
              secureTextEntry={!showPassword} // sembunyiin karakter
              onChangeText={setPassword} // terima perubahan text
              placeholder="Enter your password" // placeholder
              placeholderTextColor="#999" // warna placeholder
              style={styles.inputNoBorder} // gaya input tanpa border
            />

            {/* tombol mata buat toggle show/hide password */}
            <TouchableOpacity
              // pas ditekan, toggle state showPassword
              onPress={() => setShowPassword(!showPassword)}
              // gaya tombol mata
              style={styles.eyeButton}
            >
              {/* ikon mata buat toggle show/hide password */}
              <Ionicons
                // ganti ikon tergantung state (eye kalau hidden, eye-off kalau ditampilin)
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#736a6e"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* tampilin error dari clerk */}
        {errors.map((error) => (
          // teks error individual
          <Text key={error.longMessage} style={styles.errorText}>
            {/* pesan error dari clerk */}
            {error.longMessage}
            {/* tutup teks error*/}
          </Text>
          // tutup loop error
        ))}

        {/* tombol lupa password */}
        <TouchableOpacity
          // style buat posisi rata kanan
          style={styles.forgotWrapper}
          // saat diklik, piindah ke halaman reset password
          onPress={() => router.push("/reset-password")}
        >
          {/* tesk lupa password */}
          <Text style={styles.forgotText}>Forgot Password ?</Text>
          {/* tutup tombol lupa password */}
        </TouchableOpacity>

        {/* tombol login utama */}
        <TouchableOpacity
          // nonaktif kalau belum isi email/password atau lagi loading
          disabled={!emailAddress || !password || isSigningIn}
          // saat diklik, jalankan fungsi login
          onPress={onSignInPress}
          // style dasar + efek redup saat disabled
          style={[
            styles.loginButton,
            // berikan efek transparan saat disabled
            (!emailAddress || !password || isSigningIn) && { opacity: 0.6 },
          ]}
        >
          {/* tesk tombol login */}
          <Text style={styles.loginText}>Log In</Text>
          {/* tutup tombol login */}
        </TouchableOpacity>
        {/* tutup bagian form */}
      </View>

      {/* bagian footer: punya akun atau belum */}
      <View style={styles.signupWrapper}>
        {/* tesk ajakan sign up */}
        <Text style={styles.signupLabel}>Don't have an account? </Text>
        {/* tombol sign up */}
        <TouchableOpacity onPress={() => router.push("/sign-up")}>
          {/* teks sign in bisa diklik */}
          <Text style={styles.signupText}>Sign Up</Text>
          {/* tutup tombol sign up */}
        </TouchableOpacity>
        {/*tutup footer */}
      </View>
      {/* tutup scroll view utama */}
    </BodyScrollView>
    // tutup fungsi komponen
  );
}

// styling komponen (pakai StyleSheet biar lebih cepat & rapi)
const styles = StyleSheet.create({
  // style kontainer utama
  container: {
    flexGrow: 1, // memungkinkan scroll jika konten panjang
    paddingHorizontal: 28, // jarak kiri-kanan 28px
    paddingTop: 67, // jarak atas 67px (untuk status bar)
    paddingBottom: 30, // jarak bawah 30px
  },

  // style tombol kembali (panah back)
  backButton: {
    marginBottom: 20, // jarak bawah 20px ke elemen berikutnya
  },

  // style wrapper ikon kecil di pojok kiri atas
  iconWrapper: { 
    alignSelf: "flex-start", // posisi di kiri (bukan tengah)
    marginBottom: 12, // jarak bawah 12px ke judul
  },

  // style judul halaman
  title: {
    fontSize: 32, // ukuran font besar (32px)
    fontWeight: "700", // tebal (bold)
    marginBottom: 6, // jarak bawah 6px ke subjudul
  },

  // style subjudul deskripsi
  subtitle: {
    fontSize: 14, // ukuran font sedang
    color: "#6e6e6e", // warna abu-abu lembut
    marginBottom: 24, // jarak bawah 24px ke form
  },

  // style bagian form (email, password, dll)
  formSection: {
    marginTop: 10, // jarak atas 10px dari subjudul
    gap: 20, // jarak antar elemen form 20px
  },

  // style label form (Email, Password, dll)
  label: {
    fontSize: 14, // ukuran font label
    fontWeight: "500", // semi-tebal biar mencolok
    marginBottom: 6, // jarak bawah 6px ke input
  },

  /* style input biasa (email) */
  input: {
    borderWidth: 1, // border setebal 1px
    borderColor: "#E0E0E0", // warna border abu-abu terang
    borderRadius: 8, // sudut melengkung 8px
    paddingHorizontal: 12, // padding kiri-kanan dalam input
    height: 48, // tinggi input seragam
    backgroundColor: "#fff", // background putih bersih
    fontSize: 15, // ukuran font teks input
  },

  /* wrapper buat input password + ikon mata */
  inputWrapper: {
    flexDirection: "row", // posisi input & ikon sejajar horizontal
    alignItems: "center", // rata tengah vertikal
    borderWidth: 1, // border seperti input biasa
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#fff", // background putih
    paddingHorizontal: 12, // padding dalam wrapper
    height: 48, // tinggi sama dengan input biasa
  },

  /* input dalam wrapper (tanpa border sendiri) */
  inputNoBorder: {
    flex: 1, // ambil semua space tersisa di wrapper
    fontSize: 15, // ukuran font teks
  },

  /* tombol ikon mata buat toggle password */
  eyeButton: {
    paddingHorizontal: 4, // padding kiri-kanan kecil biar gak mepet
    justifyContent: "center", // posisi vertikal tengah
    alignItems: "center", // posisi horizontal tengah
  },

  // wrapper teks "lupa password"
  forgotWrapper: {
    alignItems: "flex-end", // rata kanan
    marginTop: -4, // geser 4px ke atas biar lebih rapet ke input
  },

  // style teks "lupa password"
  forgotText: {
    color: "#C73572", // warna ungu muda (primary color)
    fontSize: 13, // ukuran font kecil
  },

  // style tombol login utama
  loginButton: {
    marginTop: 10, // jarak atas 10px dari form
    paddingVertical: 14, // padding atas-bawah dalam tombol
    borderRadius: 10, // sudut lebih melengkung
    backgroundColor: "#C73572", // warna background ungu muda
    alignItems: "center", // teks di tengah tombol
  },

  // style teks dalam tombol login
  loginText: {
    color: "white", // teks putih
    fontSize: 18, // ukuran font besar
    fontWeight: "600", // semi-tebal biar jelas
  },

  // wrapper bagian footer (sign up)
  signupWrapper: {
    flexDirection: "row", // teks & link sejajar horizontal
    justifyContent: "center", // rata tengah horizontal
    marginTop: 28, // jarak atas 28px dari tombol login
  },

  // style teks biasa di footer
  signupLabel: {
    color: "#6e6e6e", // warna abu-abu
    fontSize: 14, // ukuran font normal
  },

  // style teks link "Sign Up" di footer
  signupText: {
    color: "#C73572", // warna ungu muda (sama dengan tombol)
    fontSize: 14, // ukuran font normal
    fontWeight: "600", // semi-tebal biar kelihatan kayak link
  },

  // style teks error (merah di bawah form)
  errorText: {
    color: "red", // warna merah buat error
    marginTop: -4, // geser 4px ke atas biar lebih deket form
    fontSize: 13, // ukuran font kecil
  },
});
