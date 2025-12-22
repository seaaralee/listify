// halaman daftar (sign up) pakai email, password & verifikasi kode
// import react biar bisa bikin komponen
import * as React from "react";
// komponen dasar react native: view, teks, tombol, styling, input
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
} from "react-native";
// buat getar feedback pas interaksi (misal klik tombol)
import * as Haptics from "expo-haptics";
// buat navigasi halaman (misal ke login, home, dll)
import { useRouter } from "expo-router";
// scroll view kustom dengan padding/styling konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";
// buat daftar akun & cek error dari clerk
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
// tipe error dari clerk (biar typescript aman)
import { ClerkAPIError } from "@clerk/types";
// buat bikin background/button gradient (warna gradasi)
import { LinearGradient } from "expo-linear-gradient";
// ikon dari expo (misal mata, panah, dll)
import { Ionicons } from "@expo/vector-icons";
// wrapper buat hindari notch/area aman di hp (biar konten gak kepotong)
import { SafeAreaView } from "react-native-safe-area-context";

// komponen halaman daftar (sign up) pakai email & verifikasi kode
export default function SignUpScreen() {
  // ambil status clerk, fungsi signUp, dan setActive (buat aktifin session baru)
  const { isLoaded, signUp, setActive } = useSignUp();
  // buat navigasi (kembali, pindah halaman)
  const router = useRouter();

  // state buat email
  const [emailAddress, setEmailAddress] = React.useState("");
  // state buat password
  const [password, setPassword] = React.useState("");
  // state buat toggle lihat/sembunyi password
  const [showPassword, setShowPassword] = React.useState(false);
  // flag buat cek apakah lagi nunggu verifikasi email
  const [pendingVerification, setPendingVerification] = React.useState(false);
  // state buat kode verifikasi dari email
  const [code, setCode] = React.useState("");
  // nyimpen error dari clerk
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  // loading state pas proses
  const [isLoading, setIsLoading] = React.useState(false);

  // kirim data daftar & minta kode verifikasi ke email
  const onSignUpPress = async () => {
    // tunggu clerk siap
    if (!isLoaded) return;

    // kasih getar pas klik
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // aktifin loading
    setIsLoading(true);
    // bersihin error lama
    setErrors([]);

    // mulai proses daftar
    try {
      // kirim data ke clerk buat bikin user
      await signUp.create({ //
        emailAddress, // kirim email
        password, // kirim password
      }); // penutup create signUp

      // minta kode verifikasi dikirim ke email
      await signUp.prepareEmailAddressVerification({
        // pake strategi kode lewat email
        strategy: "email_code",
      }); // penutup prepareEmailAddressVerification

      // ganti ke layar verifikasi
      setPendingVerification(true);
    // tangkap error pas daftar
    } catch (err) {
      // tangkap error dari clerk
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
    } finally {
      // matiin loading
      setIsLoading(false); 
    } // penutup try-catch-finally
  }; // penutup onSignUpPress

  // verifikasi kode dari email & aktifin akun
  const onVerifyPress = async () => {
    // tunggu clerk siap
    if (!isLoaded) return;

    // aktifin loading
    setIsLoading(true);
    // bersihin error lama
    try {
      // kirim kode ke clerk buat verifikasi
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      // kalau sukses & status complete
      if (attempt.status === "complete") {
        // aktifin session baru
        await setActive({ session: attempt.createdSessionId });
        // alihkan ke home
        router.replace("/(index)");
      } // penutup if attempt.status

    // tangkap error pas verifikasi
    } catch (err) {  
      // tangkap error dari clerk
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
    } finally { 
      // matiin loading
      setIsLoading(false);
    } // penutup try-catch-finally
  }; // penutup onVerifyPress

  // tampilan setelah daftar: form verifikasi kode
  if (pendingVerification) {
    return (
      // wrapper biar konten aman di semua hp (gak kepotong notch)
      <SafeAreaView style={{ flex: 1 }}> 
        {/* scroll view biar bisa digeser pas keyboard muncul */}
        <BodyScrollView
          contentContainerStyle={{ // styling konten
            flexGrow: 1, // biar ngisi layar
            padding: 28, // padding semua sisi
            paddingTop: 40, // padding atas
            justifyContent: "space-between", // atur jarak vertikal
          }} // penutup contentContainerStyle
        // penutup BodyScrollView --->
        > 
          {/* scroll view biar bisa digeser pas keyboard muncul */}
          <View>
            {/* tombol balik ke form daftar */}
            <TouchableOpacity
              // kembali ke form daftar
              onPress={() => setPendingVerification(false)}
              // styling tombol
              style={{ marginBottom: 20 }}
            >
              {/* tombol kembali */}
              <Ionicons name="arrow-back-outline" size={24} color="#F681AD" />
              {/* penutup tombol kembali */}
            </TouchableOpacity>

            {/* halaman verifikasi */}
            <Text style={styles.title}>Sign Up</Text>
            {/* kasih tahu email tujuan */}
            <Text style={styles.subtitle}>
              Enter the verification code we sent to{"\n"}
              {/* atur style email tujuan */}
              <Text style={{ fontWeight: "600" }}>{emailAddress}</Text>
            {/* penutup email tujuan */}
            </Text>

            {/* input kode verifikasi */}
            <View style={{ marginBottom: 20 }}> 
              {/* label kode verifikasi */}
              <Text style={styles.label}>Verification Code</Text>

              {/* input kode verifikasi */}
              <View style={styles.inputWrapper}>
                <RNTextInput
                  value={code} // nilai kode
                  onChangeText={setCode} // update kode pas diubah
                  placeholder="Enter 6-digit code" // placeholder kode verifikasi
                  placeholderTextColor="#999" // warna placeholder
                  keyboardType="number-pad" // keyboard angka biar gampang input kode
                  style={[styles.input, { flex: 1 }]} // styling input kode
                />
              {/* penutup input kode verifikasi */}
              </View>
            {/* penutup view input kode verifikasi */}  
            </View>

            {/* tombol verifikasi pakai gradient */}
            <TouchableOpacity
              // pas klik, panggil fungsi verifikasi
              onPress={onVerifyPress} 
              // nonaktifin tombol kalau kode kosong atau lagi loading
              disabled={!code || isLoading}
            // penutup TouchableOpacity ---
            >
              <LinearGradient // background gradasi tombol
                colors={["#CA407A", "#CA407A"]} // warna gradasi
                style={styles.gradientButton} // styling tombol
              // penutup LinearGradient --
              >
                {/* tombol verifikasi */}
                <Text style={styles.buttonText}> 
                  {isLoading ? "Loading..." : "Verify"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* tampilin error kalau ada */}
            {errors.map((err) => (
              // tampilkan tiap error
              <Text key={err.message} style={{ color: "red", marginTop: 10 }}>
                {err.message}
              </Text>
            // penutup map
            ))} 
          {/* penutup view utama verifikasi */}  
          </View>
        {/* penutup BodyScrollView */}  
        </BodyScrollView>
        {/* penutup SafeAreaView */}
      </SafeAreaView>
    );// penutup return
  } // penutup if pendingVerification

  // tampilan utama: form daftar (email + password)
  return (
    // wrapper biar konten aman di semua hp (gak kepotong notch)
    <SafeAreaView style={{ flex: 1 }}>
      {/* scroll view biar bisa digeser pas keyboard muncul */}
      <BodyScrollView
        // styling konten
        contentContainerStyle={{ // styling konten
          flexGrow: 1, // biar ngisi layar
          padding: 28, // padding semua sisi
          paddingTop: 40, // padding atas
          justifyContent: "space-between", // atur jarak vertikal
        }} // penutup contentContainerStyle
      >
        {/* bagian atas: form daftar */}
        <View>
          {/* tombol balik ke halaman sebelumnya */}
          <TouchableOpacity
            onPress={() => router.back()} // navigasi kembali
            style={{ marginBottom: 20 }} // styling tombol
          // penutup TouchableOpacity --
          >
            {/* ikon panah kembali */}
            <Ionicons name="arrow-back-outline" size={24} color="#F681AD" />
          {/* penutup ikon panah kembali */}  
          </TouchableOpacity>

          {/* judul halaman daftar */}
          <Text style={styles.title}>Sign up</Text> 
          <Text style={styles.subtitle}>Create an account to continue!</Text>

          {/* input email */}
          <View style={{ marginBottom: 20 }}> 
            {/* label email */}
            <Text style={styles.label}>Email</Text>

            {/* wrapper input email(buat border & padding) */}
            <View style={styles.inputWrapper}>
              {/* input email */}
              <RNTextInput
                // isi dari input ini ambil dari state `emailAddress`
                value={emailAddress}
                // pakai keyboard khusus email (otomatis ada tombol @ dan .)
                keyboardType="email-address"
                // matikan kapital otomatis, email biasanya huruf kecil semua
                autoCapitalize="none"
                // update email pas diubah
                placeholder="Enter your email"
                // warna placeholder
                placeholderTextColor="#999"
                // pas teks diubah, update state email
                onChangeText={setEmailAddress}
                // border di-handle wrapper, jadi input gak usah border
                style={[styles.input, { borderWidth: 0, flex: 1 }]}
              />
            {/* penutup wrapper input email */}
            </View>
          {/* penutup view input email */}
          </View>

          {/* input password */}
          <View style={{ marginBottom: 20, gap: 6 }}>
            <Text style={styles.label}>Set Password</Text>

            {/* wrapper input password */}
            <View style={styles.inputWrapper}>
              {/* input password */}
              <RNTextInput
                // isi dari input ini ambil dari state `password`
                value={password}
                // sembunyiin teks kalau showPassword false
                secureTextEntry={!showPassword}
                // update password pas diubah
                onChangeText={setPassword}
                // placeholder password
                placeholder="Enter your password"
                // warna placeholder
                placeholderTextColor="#999"
                // border di-handle wrapper, jadi input gak usah border
                style={[styles.input, { borderWidth: 0, flex: 1 }]}
              />

              {/* tombol mata buat toggle status password (show/hide) */}
              <TouchableOpacity
                // Saat diklik, toggle nilai showPassword (true/false)
                onPress={() => setShowPassword(!showPassword)}
                // Pakai style dari stylesheet (eyeButton)
                style={styles.eyeButton}
              >
                {/* Ikon mata dari Ionicons */}
                <Ionicons
                  // ganti ikon: "eye" kalau hidden, "eye-off" kalau ditampilin
                  name={showPassword ? "eye-off" : "eye"}
                  size={22} // Ukuran ikon 22px
                  color="#736a6e" // Warna abu-abu lembut
                />
              {/* tutup TouchableOpacity (tombol mata) */}
              </TouchableOpacity> 
            {/* tutup View wrapper input password (input + ikon) */}
            </View>
          {/* tutup View bagian password */}
          </View>

          {/* tombol daftar */}
          <TouchableOpacity
            // Saat diklik, jalankan fungsi onSignUpPress
            onPress={onSignUpPress}
            // Nonaktifkan tombol kalau:
            // - email kosong ATAU
            // - password kosong ATAU
            // - sedang loading
            disabled={!emailAddress || !password || isLoading}
          >
            {/* Background gradasi untuk tombol */}
            <LinearGradient
              // Warna gradasi (dari ungu ke ungu lebih gelap)
              colors={["#CA407A", "#CA407A"]}
              // Pakai style dari stylesheet (gradientButton)
              style={styles.gradientButton}
            >
              {/* Teks tombol */}
              <Text style={styles.buttonText}>
                {/* Tampilin "Loading..." kalau isLoading true, 
                    kalau tidak tampilin "Register" */}
                {isLoading ? "Loading..." : "Register"}
              </Text>
            {/* tutup LinearGradient */}
            </LinearGradient>
          {/* tutup TouchableOpacity (tombol daftar) */}
          </TouchableOpacity>

          {/* tampilin error */}
          {errors.map((err) => (
            // setiap error jadi satu text merah
            <Text key={err.message} style={{ color: "red", marginTop: 10 }}>
              {/* error message */}
              {err.message}
            {/* tutup teks error */}
            </Text>
          // tutup loop errors.map
          ))}
          
        {/* tutup View utama form (email + password + tombol) */}
        </View>

        {/* Bagian footer: punya akun? langsung login */}
        <View style={[styles.footer, { marginBottom: 40 }]}> {/* Kombinasi style footer + margin bawah ekstra */}
          {/* Teks biasa */}
          <Text style={styles.footerText}>Already have an account? </Text>
          {/* Tombol Sign In */}
          <TouchableOpacity
            // Saat diklik, pindah ke halaman login email
            onPress={() => router.push("/(auth)/sign-in-email")}
          >
            {/* Teks Sign In yang bisa diklik */}
            <Text style={styles.signInText}>Sign In</Text>
          {/* Tutup TouchableOpacity (tombol Sign In) */}
          </TouchableOpacity>
        {/* tutup View footer */}
        </View>
      {/* tutup BodyScrollView (konten utama yang bisa di-scroll) */}
      </BodyScrollView>
    {/* tutup SafeAreaView (penanganan area aman di hp) */}
    </SafeAreaView>
  // tutup return JSX komponen
  );
// tutup fungsi komponen SignUpScreen
}

// Buat objek style dengan StyleSheet.create (lebih efisien daripada inline style)
const styles = StyleSheet.create({
  // Style judul halaman
  title: {
    fontSize: 32, // Ukuran font besar
    fontWeight: "700", // Bold
    marginBottom: 6, // Jarak bawah 6px
  }, // <-- Tutup objek title & pemisah style berikutnya

  // Style subjudul
  subtitle: {
    color: "#777", // Warna abu-abu
    marginBottom: 30, // Jarak bawah besar
    fontSize: 14, // Ukuran font normal
    lineHeight: 20, // Tinggi baris teks
  }, // <-- Tutup objek subtitle & pemisah style berikutnya

// Style label form
  label: {
    fontSize: 14, // Ukuran font label
    fontWeight: "500", // Semi-bold
    marginBottom: 6, // Jarak bawah 6px
  }, // <-- Tutup objek label & pemisah style berikutnya

  // Style wrapper input (border + background)
  inputWrapper: {
    flexDirection: "row", // Susun horizontal (input + ikon)
    alignItems: "center", // Rata tengah vertikal
    borderWidth: 1, // Border setebal 1px
    borderColor: "#E0E0E0", // Warna border abu-abu terang
    borderRadius: 8, // Sudut melengkung
    backgroundColor: "#fff", // Background putih
    paddingHorizontal: 12, // Padding kiri-kanan dalam
  }, // <-- Tutup objek inputWrapper & pemisah style berikutnya

  // Style input dasar (tinggi & font)
  input: {
    height: 48, // Tinggi seragam 48px
    fontSize: 15, // Ukuran font normal
  }, // <-- Tutup objek input & pemisah style berikutnya

  // Style tombol ikon mata
  eyeButton: {
    padding: 4, // Padding seragam 4px di sekeliling
    justifyContent: "center", // Rata tengah vertikal
    alignItems: "center", // Rata tengah horizontal
  }, // <-- Tutup objek eyeButton & pemisah style berikutnya

  // Style tombol gradasi
  gradientButton: {
    height: 48, // Tinggi 48px
    borderRadius: 8, // Sudut melengkung
    justifyContent: "center", // Teks di tengah vertikal
    alignItems: "center", // Teks di tengah horizontal
    width: "100%", // Lebar penuh
    marginTop: 8, // Jarak atas 8px
  }, // <-- Tutup objek gradientButton & pemisah style berikutnya

  // Style teks tombol
  buttonText: {
    color: "#fff", // Warna putih
    fontSize: 16, // Ukuran font sedang
    fontWeight: "600", // Semi-bold
  }, // <-- Tutup objek buttonText & pemisah style berikutnya

  // Style wrapper footer
  footer: {
    flexDirection: "row", // Susun horizontal (teks + link)
    justifyContent: "center", // Rata tengah horizontal
  }, // <-- Tutup objek footer & pemisah style berikutnya

  // Style teks biasa di footer
  footerText: {
    color: "#000", // Warna hitam
  }, // <-- Tutup objek footerText & pemisah style berikutnya

  // Style teks link Sign In
  signInText: {
    color: "#CA407A", // Warna ungu muda
    fontWeight: "600", // Semi-bold biar kelihatan kayak link
  }, // <-- Tutup objek signInText (ini style terakhir di dalam StyleSheet)
}); // <-- Tutup seluruh objek StyleSheet.create()