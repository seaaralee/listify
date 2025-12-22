// import react untuk membuat komponen
import React from "react";

// import haptics dari expo untuk efek getaran
import * as Haptics from "expo-haptics";

// import router untuk navigasi halaman
import { useRouter } from "expo-router";

// import komponen inti react native
import { FlatList, Pressable, View } from "react-native";

// import daftar warna background
import { backgroundColors } from "@/constants/Colors";

// import context untuk pembuatan list
import { useListCreation } from "@/context/ListCreationContext";

// komponen utama halaman pemilih warna
export default function ColorPickerScreen() {

  // inisialisasi router untuk navigasi
  const router = useRouter();

  // ambil fungsi setSelectedColor dari context
  const { setSelectedColor } = useListCreation();

  // fungsi ketika warna dipilih
  const handleColorSelect = (color: string) => {
    setSelectedColor(color); // simpan warna terpilih ke context
    router.back(); // kembali ke halaman sebelumnya
  }; // penutup fungsi handleColorSelect

  // return digunakan untuk merender tampilan
  return (
    // flatlist untuk menampilkan warna dalam bentuk grid
    <FlatList

      // data berupa array warna
      data={backgroundColors}

      // fungsi render setiap item warna
      renderItem={({ item }) => (
        // pressable agar warna bisa ditekan
        <Pressable

          // event saat warna ditekan
          onPress={() => {

            // cek jika platform ios
            if (process.env.EXPO_OS === "ios") {

              // getaran medium saat ditekan
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } // penutup if ios

            // panggil fungsi pilih warna
            handleColorSelect(item);

          }} // penutup fungsi onPress

          // style pressable agar isi berada di tengah
          style={{
            flex: 1, // ambil lebar kolom
            alignItems: "center", // rata tengah horizontal
            justifyContent: "center", // rata tengah vertikal
          }} // penutup object style
        >
          {/* view sebagai lingkaran warna */}
          <View
            style={{
              width: 40, // lebar lingkaran
              height: 40, // tinggi lingkaran
              borderRadius: 100, // membuat bentuk bulat
              backgroundColor: item, // warna sesuai item
            }} // penutup object style view
          />
          {/* penutup view warna */}
        </Pressable>
        // penutup pressable
      )} // penutup renderItem

      // jumlah kolom grid
      numColumns={5}

      // key unik untuk setiap item
      keyExtractor={(item) => item}

      // otomatis menyesuaikan inset konten
      automaticallyAdjustContentInsets

      // perilaku penyesuaian inset (ios)
      contentInsetAdjustmentBehavior="automatic"

      // inset bawah konten
      contentInset={{ bottom: 0 }}

      // inset scroll indicator
      scrollIndicatorInsets={{ bottom: 0 }}

      // style container isi flatlist
      contentContainerStyle={{
        padding: 16, // padding semua sisi
        gap: 16, // jarak antar item
        paddingBottom: 100, // jarak bawah agar tidak ketutup sheet
      }} // penutup contentContainerStyle
    />
    // penutup flatlist
  );
}
// penutup fungsi komponen colorpickerscreen
