// import react
import React from "react";
// import stylesheet helper dan text input dari react-native
import {
  // import stylesheet helper
  StyleSheet,
  // import textinput sebagai RNTextInput untuk membedakan tipe
  TextInput as RNTextInput,
  // import tipe props textinput dari react-native
  TextInputProps as RNTextInputProps,
  // import tipe style untuk teks
  TextStyle,
  // import hook untuk mengetahui tema
  useColorScheme,
  // import view untuk wrapper
  View,
  // import tipe style untuk view
  ViewStyle,
} from "react-native";
// import warna zincColors dari konstanta project
import { zincColors } from "@/constants/Colors";
// import komponen teks yang menyesuaikan tema
import { ThemedText } from "../ThemedText";

// definisi variant input
type InputVariant = "default" | "filled" | "outlined" | "ghost";
// definisi ukuran input
type InputSize = "sm" | "md" | "lg";

// interface props untuk komponen textinput
interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  // label opsional di atas input
  label?: string;
  // error message opsional di bawah input
  error?: string;
  // variant visual input
  variant?: InputVariant;
  // ukuran input
  size?: InputSize;
  // style wrapper container opsional
  containerStyle?: ViewStyle;
  // style untuk elemen input opsional
  inputStyle?: TextStyle;
  // apakah input dinonaktifkan
  disabled?: boolean;
} // penutup interface

// deklarasi komponen textinput sebagai functional component
export const TextInput: React.FC<TextInputProps> = ({
  // ambil prop label
  label,
  // ambil prop error
  error,
  // ambil variant dengan default
  variant = "default",
  // ambil size dengan default
  size = "md",
  // ambil containerStyle
  containerStyle,
  // ambil inputStyle
  inputStyle,
  // ambil disabled dengan default false
  disabled = false,
  // ambil sisa props untuk diteruskan ke RNTextInput
  ...props
}) => {
  // dapatkan tema dari sistem
  const colorScheme = useColorScheme();
  // boolean untuk kondisi dark
  const isDark = colorScheme === "dark";

  // definisi style berdasarkan ukuran
  const sizeStyles: Record<
    InputSize,
    { height?: number; fontSize: number; padding: number }
  > = {
    // ukuran small
    sm: { fontSize: 16, padding: 8 },
    // ukuran medium
    md: { height: 50, fontSize: 16, padding: 14 },
    // ukuran large
    lg: { height: 55, fontSize: 32, padding: 16 },
  }; // penutup sizeStyles

  // fungsi untuk menentukan style variant
  const getVariantStyle = () => {
    // style dasar untuk container input
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      backgroundColor: isDark ? zincColors[900] : "rgba(255, 255, 255, 1)",
    };

    // pilih style tambahan berdasarkan variant
    switch (variant) {
      // case filled
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[700] : zincColors[100],
        }; // penutup return case filled
      // case outlined
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? zincColors[600] : zincColors[200],
        }; // penutup return case outlined
      // case ghost
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        }; // penutup return case ghost
      // default fallback
      default:
        return baseStyle; // kembalikan baseStyle sebagai fallback
    } // penutup switch
  }; // penutup fungsi getVariantStyle

  // fungsi untuk menentukan warna teks
  const getTextColor = () => {
    // jika dinonaktifkan, gunakan warna netral
    if (disabled) {
      return isDark ? zincColors[500] : zincColors[400];
    } // penutup if disabled
    // jika tidak disabled, pilih warna berdasarkan tema
    return isDark ? zincColors[50] : zincColors[900];
  }; // penutup fungsi getTextColor

  // mulai render komponen
  return (
    // wrapper utama container
    <View style={[styles.container, containerStyle]}>
      {/* render label jika ada */}
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {/* wrapper input dengan style variant dan disabled */}
      <View style={[getVariantStyle(), disabled && styles.disabled]}>
        {/* elemen textinput react-native */}
        <RNTextInput
          // gabungkan style default berdasarkan size dan warna teks, lalu inputStyle dari props
          style={[
            {
              height: sizeStyles[size].height,
              fontSize: sizeStyles[size].fontSize,
              padding: sizeStyles[size].padding,
              color: getTextColor(),
            },
            inputStyle,
          ]}
          // warna placeholder berdasarkan tema
          placeholderTextColor={isDark ? zincColors[500] : zincColors[400]}
          // nonaktifkan editable saat disabled
          editable={!disabled}
          // sebar semua props tersisa ke RNTextInput
          {...props}
        />
        {/* end rntextinput */}
      </View>
      {/* render error jika ada */}
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
    // end wrapper utama
  ); // penutup return jsx
}; // penutup deklarasi komponen TextInput

// style sheet statis
const styles = StyleSheet.create({
  // style container utama
  container: {
    marginBottom: 16,
  },
  // style untuk label
  label: {
    marginBottom: 4,
  },
  // style untuk pesan error
  error: {
    color: "#ef4444", // red-500
    marginTop: 4,
  },
  // style untuk disabled state
  disabled: {
    opacity: 0.5,
  },
}); // penutup stylesheet

// export default untuk impor default
export default TextInput; // akhir file