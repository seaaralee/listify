import React from "react"; // ngambil react biar bisa bikin komponen jsx
import { View, ViewStyle } from "react-native"; // ngambil View dan tipe style ViewStyle dari react-native
import { ThemedText } from "./ThemedText"; // ngambil komponen teks yang udah pake tema

interface IconCircleProps { // mulai definisi tipe props buat komponen IconCircle
  emoji: string; // props emoji: string yang bakal ditampilin di tengah lingkaran
  backgroundColor?: string; // opsional: warna background kotak/lingkaran
  size?: number; // opsional: ukuran kotak (width & height)
  style?: ViewStyle; // opsional: style tambahan yang bisa di-merge ke View
} // tutup interface IconCircleProps

export function IconCircle({ // mulai deklarasi komponen bernama IconCircle yang diexport
  emoji, // ambil prop emoji dari objek props
  backgroundColor = "lightblue", // ambil backgroundColor, default "lightblue" kalo gak dikasih
  size = 48, // ambil size, default 48
  style, // ambil style tambahan kalau ada
}: IconCircleProps) { // tutup destructuring props dan kasih tipe IconCircleProps
  return ( // mulai return JSX
    <View
      style={[
        {
          backgroundColor, // pakai backgroundColor dari props
          width: size, // atur lebar sesuai size
          height: size, // atur tinggi sesuai size
          borderRadius: 12, // round corner biar mirip lingkaran/bulat
          alignItems: "center", // posisikan anak (emoji) secara horizontal di tengah
          justifyContent: "center", // posisikan anak (emoji) secara vertikal di tengah
        }, // tutup object style inline pertama
        style, // tambahin style tambahan dari props (di-merge di array)
      ]} // tutup array style
    >{/* tag buka View dengan style di atas, komentar ini pake {/* */} 
      <ThemedText style={{ fontSize: 22 }}>{emoji}</ThemedText> {/* ThemedText nampilin emoji di tengah, fontsize 22 */}
    </View> 
  ); // tutup return JSX, titik koma akhiri statement
} // tutup fungsi IconCircle