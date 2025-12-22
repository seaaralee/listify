// import react agar bisa membuat komponen
import React from "react";
// import view dasar dari react-native
import {
  // komponen layout dasar
  View,
  // komponen untuk menampilkan teks
  Text,
  // komponen untuk menampilkan gambar
  Image,
  // utilitas untuk membuat style
  StyleSheet,
  // komponen tombol yang bisa ditekan
  TouchableOpacity,
  // utilitas untuk mengambil ukuran layar
  Dimensions,
} from "react-native";
// import komponen gradasi dari expo
import { LinearGradient } from "expo-linear-gradient";
// import hook navigasi dari expo-router
import { useRouter } from "expo-router";
// ambil lebar layar device
const { width } = Dimensions.get("window");
// deklarasi komponen landing screen
export default function LandingScreen() {
  // inisialisasi router untuk navigasi halaman
  const router = useRouter();

  // mulai return jsx
  return (
    // container gradasi sebagai background 
    <LinearGradient
      // daftar warna untuk gradasi background
      colors={["#FFDAE7", "#f8e7f4ff", "#f3deeeff", "#FFDAE7"]}
      // titik awal gradasi (kanan atas) 
      start={{ x: 1, y: 0 }}
      // titik akhir gradasi (kanan bawah) 
      end={{ x: 1, y: 1 }}
      // posisi masing-masing warna dalam gradasi 
      locations={[0, 0.4, 0.7, 1]}
      // style utama container 
      style={styles.container}
    >
      {/* tengah: gambar + teks */}
      {/* wrapper untuk bagian tengah */}
      <View style={styles.middleSection}>
        {/* gambar ikon splash */}
        <Image
          // sumber gambar dari assets 
          source={require("@/assets/images/splash-icon.png")}
          // style gambar
          style={styles.image}
        />
        {/* judul atau teks utama (kosong sekarang) */}
        <Text style={styles.title}></Text>
      </View>
      {/* penutup view middleSection */}

      {/* bawah: tombol + link */}
      {/* wrapper untuk bagian bawah */}
      <View style={styles.bottomSection}>
        {/* tombol get started */}
        <TouchableOpacity
          // style tombol
          style={styles.getStartedButton}
          // navigasi ke halaman sign up saat ditekan 
          onPress={() => router.push("/(auth)/sign-up")}
        >
          {/* teks tombol */}
          <Text style={styles.getStartedText}>GET STARTED</Text>
        </TouchableOpacity>
        {/* penutup tombol get started */}

        {/* footer dengan link sign in */}
        <View style={styles.footer}>
          {/* teks biasa di footer */}
          <Text style={styles.footerText}>Already have an account? </Text>
          {/* tombol kecil untuk sign in */}
          <TouchableOpacity
            // navigasi ke halaman sign in saat ditekan 
            onPress={() => router.push("/(auth)/sign-in-email")}
          >
            {/* teks link sign in */}
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          {/* penutup touchable sign in */}
        </View>
        {/* penutup view footer */}
      </View>
      {/* penutup view bottomSection */}

    {/* penutup lineargradient */}
    </LinearGradient>
  ); // akhir return
} // akhir komponen landing screen

// membuat objek gaya
const styles = StyleSheet.create({
  // style container utama
  container: {
    // ambil semua ruang vertikal
    flex: 1,
    // beri jarak antar anak (atas dan bawah)
    justifyContent: "space-between",
    // rata tengah secara horizontal
    alignItems: "center",
    // padding kiri kanan
    paddingHorizontal: 24,
    // padding atas bawah
    paddingVertical: 40,
  }, // penutup container

  // bagian tengah layar
  middleSection: {
    // isi mengambil ruang maksimal
    flex: 1,
    // atur isi secara vertikal
    justifyContent: "center",
    // atur isi secara horizontal
    alignItems: "center",
  }, // penutup middleSection

  // gaya untuk gambar
  image: {
    // lebar gambar proporsional dengan layar
    width: width * 0.74,
    // tinggi gambar proporsional dengan layar
    height: width * 0.5,
    // jarak atas gambar
    marginTop: 70,
    // jarak bawah gambar
    marginBottom: 0,
    // agar gambar tidak terdistorsi
    resizeMode: "contain",
  }, // penutup image

  // gaya untuk teks judul
  title: {
    // ukuran font
    fontSize: 30,
    // ketebalan font
    fontWeight: "700",
    // warna teks
    color: "#000",
    // rata tengah
    textAlign: "center",
    // jarak atas teks
    marginTop: 8,
  }, // penutup title

  // bagian bawah layar
  bottomSection: {
    // selebar kontainer
    width: "100%",
    // atur isi secara horizontal
    alignItems: "center",
    // jarak bawah layar
    marginBottom: 100,
  }, // penutup bottomSection

  // gaya untuk tombol get started
  getStartedButton: {
    // warna latar belakang tombol
    backgroundColor: "#C73572",
    // jarak vertikal dalam tombol
    paddingVertical: 14,
    // radius sudut tombol
    borderRadius: 10,
    // tombol selebar kontainer
    width: "100%",
    // atur isi secara horizontal
    alignItems: "center",
    // jarak bawah tombol
    marginBottom: 18,
  }, // penutup getStartedButton

  // teks pada tombol get started
  getStartedText: {
    // warna teks
    color: "#fff",
    // ukuran font
    fontSize: 20,
    // ketebalan font
    fontWeight: "600",
  }, // penutup getStartedText

  // bagian footer
  footer: {
    // atur elemen secara horizontal
    flexDirection: "row",
    // atur isi secara horizontal
    justifyContent: "center",
  }, // penutup footer

  // teks biasa di footer
  footerText: {
    // warna teks footer
    color: "#be6e8fff",
    // ukuran font
    fontSize: 14,
  }, // penutup footerText

  // teks link sign in
  signInText: {
    // warna link
    color: "#C73572",
    // ukuran font
    fontSize: 14,
    // ketebalan font
    fontWeight: "500",
  }, // penutup signInText
}); // penutup StyleSheet.create