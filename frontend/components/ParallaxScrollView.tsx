import type { PropsWithChildren, ReactElement } from "react"; // import tipe untuk props dengan children dan elemen react
import { StyleSheet } from "react-native"; // import stylesheet untuk style
import Animated, { // import animated dan helper dari reanimated
  interpolate, // fungsi untuk interpolasi nilai
  useAnimatedRef, // hook untuk referensi teranimasi
  useAnimatedStyle, // hook untuk style teranimasi
  useScrollViewOffset, // hook untuk mendapatkan offset scroll
} from "react-native-reanimated"; // akhir import reanimated
import { ThemedView } from "@/components/ThemedView"; // import view yang menyesuaikan tema
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground"; // import helper untuk overflow tab bar
import { useColorScheme } from "@/hooks/useColorScheme"; // import hook tema custom

const HEADER_HEIGHT = 250; // konstanta tinggi header

type Props = PropsWithChildren<{ // tipe props komponen
  headerImage: ReactElement; // elemen gambar header
  headerBackgroundColor: { dark: string; light: string }; // warna background untuk tiap tema
}>; // penutup tipe props

export default function ParallaxScrollView({ // deklarasi komponen default
  children, // children konten
  headerImage, // gambar header
  headerBackgroundColor, // warna latar header
}: Props) { // anotasi tipe props dan buka blok fungsi
  const colorScheme = useColorScheme() ?? "light"; // dapatkan tema saat ini atau fallback ke light
  const scrollRef = useAnimatedRef<Animated.ScrollView>(); // referensi scroll view teranimasi
  const scrollOffset = useScrollViewOffset(scrollRef); // offset scroll yang terikat ke ref
  const bottom = useBottomTabOverflow(); // hitung overflow tab bar di bawah
  const headerAnimatedStyle = useAnimatedStyle(() => { // buat style teranimasi untuk header
    return { // kembalikan object style
      transform: [ // daftar transform yang diterapkan
        {
          translateY: interpolate( // terjemahkan secara vertikal berdasarkan offset
            scrollOffset.value, // input nilai offset
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT], // range input
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75] // range output
          ), // penutup interpolate translateY
        }, // penutup objek translateY
        {
          scale: interpolate( // skala header saat di-pull atau scroll
            scrollOffset.value, // input offset
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT], // range input
            [2, 1, 1] // range output skala
          ), // penutup interpolate scale
        }, // penutup objek scale
      ], // penutup array transform
    }; // penutup objek style yang dikembalikan
  }); // penutup useAnimatedStyle

  return ( // mulai return jsx
    <> {/* fragment pembungkus agar komentar bisa disisipkan bila perlu */} 
      {/* root view yang mengikuti tema */} 
      <ThemedView style={styles.container}>
        {/* scroll view teranimasi */}
        <Animated.ScrollView
          ref={scrollRef} // assign ref ke scroll view
          scrollEventThrottle={16} // throttle event scroll supaya animasi halus
          scrollIndicatorInsets={{ bottom }} // sesuaikan inset indikator scroll agar tidak tertutup tab
          contentContainerStyle={{ paddingBottom: bottom }} // tambahkan padding bottom sesuai overflow
        >
          {/* header yang teranimasi */}
          <Animated.View
            style={[
              styles.header, // style statis header
              { backgroundColor: headerBackgroundColor[colorScheme] }, // warna background sesuai tema
              headerAnimatedStyle, // style teranimasi yang dihitung di atas
            ]}
          >
            {headerImage} {/* render elemen gambar header */}
          </Animated.View> {/* penutup animated.view header */}

          {/* konten utama */}
          <ThemedView style={styles.content}>{children}</ThemedView> {/* penutup themedview content */}
        </Animated.ScrollView> {/* penutup animated.scrollview */}
      </ThemedView> {/* penutup themedview root */}
    </> 
  ); // akhir return jsx
} // akhir fungsi komponen

const styles = StyleSheet.create({ // buat stylesheet
  container: { // style untuk container utama
    flex: 1, // ambil seluruh ruang
  }, // penutup container

  header: { // style untuk header
    height: HEADER_HEIGHT, // tinggi header sesuai konstanta
    overflow: "hidden", // sembunyikan bagian yang meluber
  }, // penutup header

  content: { // style untuk konten
    flex: 1, // isi sisa ruang
    padding: 32, // padding di semua sisi
    gap: 16, // jarak antar elemen (jika didukung)
    overflow: "hidden", // sembunyikan overflow konten
  }, // penutup content
}); // penutup StyleSheet.create