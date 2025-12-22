// import modul reanimated, import side-effect saja (tidak pakai variabel)
import "react-native-reanimated";

// ambil hook useEffect dari react
import { useEffect } from "react";

// hook untuk load font dari expo
import { useFonts } from "expo-font";

// Slot adalah tempat router akan render layar anak
import { Slot } from "expo-router";

// api splash screen dari expo untuk kontrol tampilan loading
import * as SplashScreen from "expo-splash-screen";

// kontrol system bars (status/navigation bar) agar bisa edge-to-edge
import { SystemBars } from "react-native-edge-to-edge";

// root view khusus untuk gesture handler
import { GestureHandlerRootView } from "react-native-gesture-handler";

// import token cache lokal (alias @)
import { tokenCache } from "@/cache";

// hook custom untuk dapatkan warna tema (dark / light)
import { useColorScheme } from "@/hooks/useColorScheme";

// komponen clerk untuk authentication di expo
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";

// import tema dan provider dari react navigation
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native"; // theme bawaan dan tipe Theme

// status bar dari expo (menangani style status bar)
import { StatusBar } from "expo-status-bar";

// ambil publishable key dari variabel lingkungan, tanda ! berarti kita yakin nilainya ada
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// hentikan splash screen agar tidak auto-hide sebelum asset siap
SplashScreen.preventAutoHideAsync();

// deklarasi komponen utama yang diekspor default
export default function RootLayout() {
  // dapatkan preferensi tema (string "dark" atau "light")
  const colorScheme = useColorScheme();

  // load font, useFonts mengembalikan array, kita ambil nilai loaded
  const [loaded] = useFonts({
    // require path ke file font lokal
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  }); // tutup objek konfigurasi font

  // efek samping: kalau font sudah ter-load, sembunyikan splash screen
  useEffect(() => { 
    if (loaded) {
      // sembunyikan splash screen secara async
      SplashScreen.hideAsync();
    } // tutup if loaded
  }, [loaded]); // dependency array berisi loaded, jadi efek jalan saat loaded berubah

  // jika font belum siap, jangan render apa-apa (splash screen tetap terlihat)
  if (!loaded) { // cek loaded false
    return null; // render null supaya app gak tampil sebelum siap
  } // tutup if !loaded

  // cek publishableKey, kalau tidak ada, lempar error supaya developer tahu
  if (!publishableKey) { // jika key kosong
    throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"); // hentikan dan beri pesan jelas
  } // tutup if !publishableKey

  // buat tema custom untuk mode terang
  const CustomDefaultTheme: Theme = {
    ...DefaultTheme, // ambil properti dari default theme bawaan
    dark: false, // jelaskan ini bukan tema gelap
    colors: {
      primary: "rgb(0, 122, 255)", // warna utama (system blue)
      background: "#fff", // warna latar belakang terang
      card: "rgb(255, 255, 255)", // warna kartu/surface
      text: "rgb(0, 0, 0)", // warna teks gelap
      border: "rgb(216, 216, 220)", // warna border/pemisah
      notification: "rgb(255, 59, 48)", // warna notifikasi
    }, // tutup colors
  }; // tutup CustomDefaultTheme

  // buat tema custom untuk mode gelap
  const CustomDarkTheme: Theme = {
    ...DarkTheme, // ambil properti dari dark theme bawaan
    colors: {
      primary: "rgb(10, 132, 255)", // warna utama di dark mode
      background: "rgb(1, 1, 1)", // latar belakang sangat gelap (bagus untuk oled)
      card: "rgb(28, 28, 30)", // warna kartu gelap
      text: "rgb(255, 255, 255)", // teks terang supaya terbaca
      border: "rgb(44, 44, 46)", // warna border gelap
      notification: "rgb(255, 69, 58)", // warna notifikasi di dark mode
    }, // tutup colors
  }; // tutup CustomDarkTheme

  // mulai render JSX
  return (
    // clerk provider memberikan context auth ke seluruh aplikasi
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* status bar dari expo, style "auto" biar menyesuaikan tema */}
      <StatusBar style="auto" animated />
      {/* tunggu clerk siap dulu sebelum render anak-anak */}
      <ClerkLoaded>
        {/* theme provider pilih tema berdasarkan colorScheme */}
        <ThemeProvider
          value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
        >
          {/* root view untuk gesture handler, wajib untuk gesture */}
          <GestureHandlerRootView>
            {/* tempat router akan render layar yang aktif */}
            <Slot />
            {/* kontrol system bars, style auto biar sesuai tema */}
            <SystemBars style={"auto"} />
          {/* tutup GestureHandlerRootView */}  
          </GestureHandlerRootView>
        {/* tutup ThemeProvider */}
        </ThemeProvider>
      {/* tutup ClerkLoaded */}  
      </ClerkLoaded>
    {/* tutup ClerkProvider */}
    </ClerkProvider> 
  ); // tutup return JSX dan tanda kurungnya
} // tutup fungsi RootLayout dan file
