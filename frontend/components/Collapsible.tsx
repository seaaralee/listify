import { PropsWithChildren, useState } from "react"; // ngimpor tipe PropsWithChildren dan hook useState dari react
import { StyleSheet, TouchableOpacity } from "react-native"; // ngimpor StyleSheet dan TouchableOpacity dari react-native
import { ThemedText } from "@/components/ThemedText"; // ngimpor komponen teks yang punya styling tema
import { ThemedView } from "@/components/ThemedView"; // ngimpor view yang ikut tema (light/dark)
import { IconSymbol } from "@/components/ui/IconSymbol"; // ngimpor komponen ikon custom
import { Colors } from "@/constants/Colors"; // ngimpor konstanta warna
import { useColorScheme } from "@/hooks/useColorScheme"; // ngimpor hook buat tau tema saat ini (light/dark)

export function Collapsible({ // mulai deklarasi komponen bernama Collapsible yang diexport
  children, // prop children: isi yang bisa dilipat
  title, // prop title: judul yang muncul di heading
}: PropsWithChildren & { title: string }) { // tipe props: gabungan PropsWithChildren + object dengan title string
  const [isOpen, setIsOpen] = useState(false); // state isOpen: false = tertutup, true = buka
  const theme = useColorScheme() ?? "light"; // ambil tema (light/dark), kalo null pakai "light"

  return ( // mulai render JSX
    <ThemedView> {/* bungkus pake ThemedView biar ikut tema */} 
      <TouchableOpacity
        style={styles.heading} // pake style heading dari StyleSheet di bawah
        onPress={() => setIsOpen((value) => !value)} // toggle isOpen pas ditekan
        activeOpacity={0.8} // set opacity saat ditekan supaya ada efek sentuh
      >
        <IconSymbol
          name="chevron.right" // pakai ikon chevron kanan
          size={18} // ukuran ikon 18
          weight="medium" // bobot ikon medium
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon} // warna ikon tergantung tema
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }} // rotasi ikon 90deg kalo terbuka biar nunjuk ke bawah
        /> {/* tutup IconSymbol */}

        <ThemedText type="defaultSemiBold">{title}</ThemedText> {/* tampilkan judul pake ThemedText */}
      </TouchableOpacity> {/* tutup TouchableOpacity heading */}
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>} {/* kalo isOpen true, render isi dalam ThemedView dengan style content */}
    </ThemedView> 
  ); // akhir return JSX
} // akhir fungsi Collapsible

const styles = StyleSheet.create({ // mulai deklarasi styles pake StyleSheet.create
  heading: { // style untuk baris heading (ikon + judul)
    flexDirection: "row", // susun isi heading secara horizontal
    alignItems: "center", // rata tengah vertikal
    gap: 6, // jarak antar elemen di dalam heading
  }, // akhir object heading
  content: { // style untuk konten yang muncul saat terbuka
    marginTop: 6, // jarak atas dari heading
    marginLeft: 24, // indentasi ke kanan supaya mirip nested
  }, // akhir object content
}); // akhir StyleSheet.create dan penutupan konstanta styles