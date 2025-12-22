// import react karena kita bikin komponen functional
import React from "react"; // impor React (dibutuhkan untuk tipe React.FC dan JSX)

// import komponen dan tipe dari react-native yang dipakai
import {
  ActivityIndicator, // spinner saat loading
  Pressable, // tombol yang bisa ditekan
  StyleSheet, // helper untuk flatten style
  TextStyle, // tipe untuk style teks
  useColorScheme, // hook bawaan react-native untuk cek tema
  ViewStyle, // tipe untuk style view
} from "react-native"; // akhir import dari react-native

// import warna konstanta dari project
import { appleBlue, zincColors } from "@/constants/Colors"; // warna yang dipakai di komponen

// import komponen teks yang menyesuaikan tema
import { ThemedText } from "../ThemedText"; // text yang otomatis menyesuaikan tema

// tipe variant tombol: filled / outline / ghost
type ButtonVariant = "filled" | "outline" | "ghost"; // union type untuk varian

// ukuran tombol: sm / md / lg
type ButtonSize = "sm" | "md" | "lg"; // union type untuk ukuran

// definisi props untuk komponen button
interface ButtonProps {
  onPress?: () => void; // fungsi dipanggil saat ditekan
  variant?: ButtonVariant; // tipe visual tombol
  size?: ButtonSize; // ukuran tombol
  disabled?: boolean; // kalau true tombol dinonaktifkan
  loading?: boolean; // kalau true tampilkan spinner
  children: React.ReactNode; // isi teks atau node di dalam tombol
  style?: ViewStyle; // style tambahan untuk wrapper
  textStyle?: TextStyle; // style tambahan untuk teks
} // akhir interface ButtonProps (penutup interface)

// deklarasi komponen Button sebagai functional component
export const Button: React.FC<ButtonProps> = ({ // awal deklarasi komponen dan destruktur props
  onPress, // prop onPress
  variant = "filled", // default variant
  size = "md", // default size
  disabled = false, // default disabled false
  loading = false, // default loading false
  children, // isi tombol
  style, // style tambahan wrapper
  textStyle, // style tambahan teks
}) => { // buka blok fungsi komponen
  // cek tema dari sistem (dark / light)
  const colorScheme = useColorScheme(); // ambil tema dari sistem
  const isDark = colorScheme === "dark"; // boolean cepat untuk kondisi dark

  // definisi ukuran untuk tiap size
  const sizeStyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = { // mulai object sizeStyles
    sm: { height: 36, fontSize: 14, padding: 12 }, // kecil
    md: { height: 44, fontSize: 16, padding: 16 }, // medium
    lg: { height: 55, fontSize: 18, padding: 20 }, // besar
  }; // akhir sizeStyles (penutup object dan titik koma)

// fungsi untuk dapatkan style dasar berdasarkan variant
const getVariantStyle = () => { // deklarasi fungsi getVariantStyle
  const baseStyle: ViewStyle = { // base style umum untuk semua variant
    borderRadius: 12, // sudut agak melengkung
    flexDirection: "row", // susun isi secara horizontal (icon + teks misal)
    alignItems: "center", // vertical center
    justifyContent: "center", // horizontal center
  }; // akhir baseStyle object (penutup objek)

  // pilih style sesuai variant
  switch (variant) { // mulai switch berdasarkan prop variant
    // buat style tombol berisi (filled)
    case "filled": // case untuk variant "filled"
      // 
      return {
        ...baseStyle, // selalu bawa properti dasar
        backgroundColor: "#CA407A", // warna isi untuk filled
      }; // kembalikan style untuk filled (penutup objek dan return)

    case "outline": // case untuk variant "outline"
      return {
        ...baseStyle, // bawa properti dasar
        backgroundColor: "transparent", // transparan untuk outline
        borderWidth: 1, // garis pembatas
        borderColor: isDark ? zincColors[700] : zincColors[300], // warna border tergantung tema
      }; // kembalikan style untuk outline (penutup objek dan return)

    case "ghost": // case untuk variant "ghost"
      return {
        ...baseStyle, // bawa properti dasar
        backgroundColor: "transparent", // ghost cuma transparan tanpa border
      }; // kembalikan style untuk ghost (penutup objek dan return)

    default: // default fallback kalau variant tidak cocok
      // fallback kalau variant aneh atau undefined
      // pilih baseStyle supaya komponen masih punya tampilan default yang aman
      return baseStyle; // kembalikan baseStyle sebagai fallback
  } // akhir switch variant (penutup switch)
}; // akhir getVariantStyle (penutup fungsi dan titik koma)

  // fungsi untuk dapatkan warna teks berdasarkan state/variant
  const getTextColor = () => { // deklarasi fungsi getTextColor
    if (disabled) { // cek jika tombol disabled
      return isDark ? zincColors[500] : zincColors[400]; // warna netral saat disabled
    } // akhir blok if disabled

    switch (variant) { // switch lagi berdasarkan variant untuk menentukan warna teks
      case "filled": // jika variant filled
        return isDark ? zincColors[900] : zincColors[50]; // teks kontras di atas background filled
      case "outline": // jika variant outline
      case "ghost": // jika variant ghost (sengaja bergabung dengan case outline)
        return appleBlue; // outline/ghost pakai warna biru apple
    } // akhir switch variant pada getTextColor
  }; // akhir getTextColor (penutup fungsi dan titik koma)

  // render jsx tombol
  return ( // mulai return JSX
    <Pressable
      onPress={onPress} // event saat ditekan
      disabled={disabled || loading} // nonaktifkan saat disabled atau loading
      style={[ // mulai array style untuk Pressable
        getVariantStyle(), // style berdasarkan variant
        {
          height: sizeStyles[size].height, // tinggi sesuai size
          paddingHorizontal: sizeStyles[size].padding, // padding horizontal sesuai size
          opacity: disabled ? 0.5 : 1, // transparansi saat disabled
        }, // akhir object style dinamis
        style, // tambahkan style dari props terakhir supaya override bisa terjadi
      ]} // akhir array style
    > {/* akhir pembukaan tag Pressable (komentar JSX) */}
      {/* cek state loading untuk render spinner atau teks; komentar ini dalam bentuk JSX */}
      {loading ? ( // kalau loading true, render ActivityIndicator
        // kalau loading tampilkan spinner
        <ActivityIndicator color={getTextColor()} /> // spinner dengan warna teks yang sesuai
      ) : ( // jika tidak loading, tampilkan teks menggunakan ThemedText
        // kalau bukan loading tampilkan teks dengan komponen themed
        <ThemedText
          style={StyleSheet.flatten([ // gabungkan style menggunakan StyleSheet.flatten
            {
              fontSize: sizeStyles[size].fontSize, // ukuran font ikut size
              color: getTextColor(), // warna teks dari fungsi
              textAlign: "center", // teks rata tengah
              marginBottom: 0, // reset margin bawah default
              fontWeight: "700", // tebalkan teks
            }, // akhir objek style default teks
            textStyle, // gabungkan textStyle dari props
          ])} // akhir StyleSheet.flatten dan atribut style
        >
          {children} {/* isi tombol (bisa string atau node) */}
        </ThemedText> // penutupan tag ThemedText
      )} {/* akhir ternary loading */}
    </Pressable> /* penutupan tag Pressable */
  ); // akhir return JSX dan titik koma
}; // akhir deklarasi komponen Button dan penutupan blok fungsi

// export default supaya import default juga tersedia
export default Button; // ekspor default komponen Button (penutup file)