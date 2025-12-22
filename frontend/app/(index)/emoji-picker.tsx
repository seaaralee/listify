// import react untuk membuat komponen react
import React from "react";

// import haptics dari expo untuk efek getaran
import * as Haptics from "expo-haptics";

// hook router dari expo-router untuk navigasi
import { useRouter } from "expo-router";

// komponen inti react native
import { FlatList, Pressable, Text } from "react-native";

// daftar emoji dari file constants
import { emojies } from "@/constants/Colors";

// context untuk pembuatan list (menyimpan emoji terpilih)
import { useListCreation } from "@/context/ListCreationContext";

// komponen utama halaman emoji picker
export default function EmojiPickerScreen() {

  // inisialisasi router untuk navigasi
  const router = useRouter();

  // ambil fungsi setSelectedEmoji dari context
  const { setSelectedEmoji } = useListCreation();

  // fungsi saat emoji dipilih
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji); // simpan emoji ke context
    router.back(); // kembali ke halaman sebelumnya
  }; // penutup fungsi handleEmojiSelect

  // return untuk menampilkan ui
  return (
    // flatlist untuk menampilkan emoji dalam grid
    <FlatList

      // data berupa array emoji
      data={emojies}

      // render tiap item emoji
      renderItem={({ item }) => (
        // pressable agar emoji bisa ditekan
        <Pressable

          // handler saat emoji ditekan
          onPress={() => {

            // cek jika platform ios
            if (process.env.EXPO_OS === "ios") {

              // beri getaran medium di ios
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            // panggil fungsi pilih emoji
            handleEmojiSelect(item);

          }} // penutup fungsi onPress

          // style pressable
          style={{
            flex: 1, // tiap item ambil ruang sama rata
            alignItems: "center", // emoji rata tengah horizontal
            justifyContent: "center", // emoji rata tengah vertikal
          }} // penutup object style
        >
          {/* teks emoji */}
          <Text style={{ fontSize: 40 }}>
            {item} {/* emoji yang sedang dirender */}
          </Text>
          {/* penutup Text */}
        </Pressable>
        // penutup Pressable
      )} // penutup renderItem

      // jumlah kolom emoji (grid 5 kolom)
      numColumns={5}

      // key unik untuk setiap item (pakai emoji itu sendiri)
      keyExtractor={(item) => item}

      // otomatis menyesuaikan inset konten (ios)
      automaticallyAdjustContentInsets

      // perilaku penyesuaian inset
      contentInsetAdjustmentBehavior="automatic"

      // inset konten bagian bawah
      contentInset={{ bottom: 0 }}

      // inset indikator scroll
      scrollIndicatorInsets={{ bottom: 0 }}

      // style container flatlist
      contentContainerStyle={{
        padding: 16, // padding keseluruhan
        paddingBottom: 100, // padding bawah agar tidak ketutup
      }} // penutup contentContainerStyle
    />
    // penutup FlatList
  );
}
// penutup fungsi komponen EmojiPickerScreen
