// mengambil parameter dari url / route lokal (misalnya listId)
import { useLocalSearchParams } from "expo-router";

// komponen bawaan react native untuk share, styling, dan view
import { Share, StyleSheet, View } from "react-native";

// library untuk membuat qr code
import QRCode from "react-native-qrcode-svg";

// komponen teks yang menyesuaikan tema (terang / gelap)
import { ThemedText } from "@/components/ThemedText";

// scroll view custom dengan padding bawaan
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// tombol custom
import Button from "@/components/ui/button";

// status bar dari expo
import { StatusBar } from "expo-status-bar";

/* ====== GANTI UKURAN TEKS DI SINI ====== */
// object untuk menyimpan ukuran font agar mudah diatur
const FONT = {
  title: 24,        // ukuran judul
  subtitle: 14,     // ukuran subjudul
  scan: 14,         // ukuran teks "scan qr code"
  or: 13,           // ukuran teks "or"
  share: 14,        // ukuran teks tombol share
  disclaimer: 12,   // ukuran teks disclaimer
};

// komponen utama halaman share list
export default function ShareListScreen() {

  // mengambil listId dari parameter url
  const { listId } = useLocalSearchParams() as { listId: string };

  // fungsi untuk membagikan kode list menggunakan fitur share bawaan hp
  const handleShareListCode = async () => {

    // pesan yang akan dibagikan
    const shareMessage = `🛒 Join my shopping list!

Paste this code in the app:

${listId}`;

    try {
      // membuka dialog share (whatsapp, telegram, dll)
      await Share.share({ message: shareMessage });
    } catch (error) {
      // menampilkan error jika gagal share
      console.error("Error sharing list code:", error);
    }
  };

  // return adalah bagian yang menampilkan ui ke layar
  return (
    // scroll view utama agar konten bisa discroll
    <BodyScrollView contentContainerStyle={styles.container}>
      
      {/* mengatur warna status bar */}
      <StatusBar style="dark" />

      {/* card utama */}
      <View style={styles.card}>

        {/* judul halaman */}
        <ThemedText style={styles.title}>
          Invite Collaborators
        </ThemedText>

        {/* subjudul penjelasan */}
        <ThemedText style={styles.subtitle}>
          Share your list with family and friends to collaborate in real-time
        </ThemedText>

        {/* teks scan qr */}
        <ThemedText style={styles.scanText}>
          Scan QR code
        </ThemedText>

        {/* pembungkus qr code */}
        <View style={styles.qrWrapper}>
          {/* qr code berisi deep link dengan listId */}
          <QRCode
            size={200}
            value={`groceries-shopping-list://list/new?listId=${listId}`}
          />
        </View>

        {/* teks pemisah */}
        <ThemedText style={styles.orText}>or</ThemedText>

        {/* tombol share kode */}
        <Button
          onPress={handleShareListCode} // ketika ditekan akan memanggil fungsi share
          variant="ghost"
          style={styles.shareBtn}
        >
          {/* teks di dalam tombol */}
          <ThemedText style={styles.shareText}>
            Share List Code
          </ThemedText>
        </Button>

        {/* teks peringatan */}
        <ThemedText style={styles.disclaimer}>
          only share your list with people you trust. Anyone with the code can
          join and edit your list
        </ThemedText>

      </View>
      {/* penutup view card */}

    </BodyScrollView>
    // penutup body scroll view
  );
}
// penutup fungsi komponen

/* ====== STYLES ====== */
// kumpulan style untuk komponen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,                 // agar scroll view bisa memanjang
    backgroundColor: "#FFF0F5",  // warna background
    alignItems: "center",        // konten rata tengah horizontal
    paddingTop: 24,              // jarak atas
    paddingBottom: 50,           // jarak bawah
  },

  card: {
    width: "90%",                // lebar card
    backgroundColor: "#FFF0F5",  // warna card
    borderRadius: 20,            // sudut membulat
    paddingVertical: 28,         // padding atas bawah
    paddingHorizontal: 20,       // padding kiri kanan
    alignItems: "center",        // isi card rata tengah
  },

  title: {
    fontSize: FONT.title,        // ukuran font judul
    fontWeight: "700",           // ketebalan font
    color: "#000",               // warna teks
    marginBottom: 8,             // jarak bawah
  },

  subtitle: {
    textAlign: "center",         // teks rata tengah
    paddingHorizontal: 16,       // padding kiri kanan
    fontSize: FONT.subtitle,     // ukuran font
    color: "#666",               // warna teks
    marginBottom: 12,            // jarak bawah
    lineHeight: FONT.subtitle + 2, // jarak antar baris
  },

  scanText: {
    fontSize: FONT.scan,         // ukuran font
    color: "#C73572",            // warna pink
    fontWeight: "500",           // ketebalan sedang
    marginBottom: 16,            // jarak bawah
  },

  qrWrapper: {
    backgroundColor: "#FFF",     // background putih
    padding: 16,                 // padding dalam
    borderRadius: 16,            // sudut membulat
    marginBottom: 20,            // jarak bawah
  },

  orText: {
    fontSize: FONT.or,           // ukuran font
    color: "#888",               // warna abu
    marginBottom: 16,            // jarak bawah
  },

  shareBtn: {
    paddingHorizontal: 10,       // padding kiri kanan
    paddingVertical: 4,          // padding atas bawah
  },

  shareText: {
    fontSize: FONT.share,        // ukuran font
    color: "#C73572",            // warna pink
    fontWeight: "600",           // ketebalan font
  },

  disclaimer: {
    fontSize: FONT.disclaimer,   // ukuran font kecil
    color: "#C73572",            // warna pink
    textAlign: "center",         // teks rata tengah
    marginTop: 20,               // jarak atas
    lineHeight: 16,              // jarak antar baris
  },
});
// penutup styles
