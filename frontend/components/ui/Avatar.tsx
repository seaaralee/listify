// import react karena kita bikin komponen react
import React from "react";

// import view dan tipe style dari react-native
import { View, ViewStyle } from "react-native";

// import komponen teks yang menyesuaikan tema dari path lokal
import { ThemedText } from "@/components/ThemedText";

// import hook custom untuk tau tema (dark / light)
import { useColorScheme } from "@/hooks/useColorScheme";

// import konstanta warna zinc dari file constants
import { zincColors } from "@/constants/Colors";

// deklarasi interface props untuk komponen avatar
interface AvatarProps {
  name: string; // nama lengkap atau nama untuk ambil inisial
  size?: number; // ukuran avatar dalam px, opsional
  style?: ViewStyle; // style tambahan untuk view, opsional
} // akhir interface AvatarProps

// definisi komponen avatar yang diekspor
export function Avatar({ name, size = 32, style }: AvatarProps) {
  // dapatkan color scheme saat ini (misal "dark" atau "light")
  const colorScheme = useColorScheme();

  // boolean sederhana untuk cek mode gelap
  const isDark = colorScheme === "dark";

  // fungsi bantu: ambil inisial dari nama
  // mengambil huruf pertama kata pertama dan huruf pertama kata terakhir
  const getInitials = (name: string): string => {
    // bersihin spasi berlebih lalu pisah berdasarkan whitespace
    const words = name.trim().split(/\s+/);
    // kalau cuma satu kata, ambil huruf pertama
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } // tutup if satu kata

    // kalau lebih dari satu kata, gabung first char kata pertama + first char kata terakhir lalu jadi uppercase
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }; // akhir fungsi getInitials

  // ambil inisial dari nama yang dikirim lewat props
  const initials = getInitials(name);

  // return jsx untuk avatar
  return (
    // wrapper view bulat, style dasar + style tambahan dari props
    <View
      style={[
        {
          width: size, // lebar sesuai size
          height: size, // tinggi sesuai size
          borderRadius: size / 2, // bikin bulat
          backgroundColor: isDark ? zincColors[700] : zincColors[200], // warna latar beda buat dark/light
          alignItems: "center", // teks di tengah secara horizontal
          justifyContent: "center", // teks di tengah secara vertikal
        }, // tutup object style dasar
        style, // terima style tambahan dari props (di-append)
      ]} // tutup array style
    >
      {/* teks inisial, pakai komponen themed agar warnanya pas tema */}
      <ThemedText
        type="defaultSemiBold" // varian font yang dipakai
        style={{
          fontSize: size * 0.4, // ukuran font relatif terhadap size avatar
          color: isDark ? zincColors[300] : zincColors[600], // warna teks sesuai tema
        }} // tutup object style pada ThemedText
      >
        {initials} {/* tampilkan inisial di dalam teks */}
      {/* tutup ThemedText */}  
      </ThemedText>
    {/* tutup View wrapper */}  
    </View>
  ); // akhir return jsx dan tutup tanda kurung
} // tutup fungsi Avatar dan ekspor komponen