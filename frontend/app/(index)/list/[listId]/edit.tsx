// baca react dan hook effect (buat side effect seperti haptics)
import React, { useEffect } from "react";

// modul haptics (getaran) dari expo
import * as Haptics from "expo-haptics";

// stack navigator, baca param url, dan router buat navigasi
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

// komponen dasar react native: tombol, style, teks, dan view
import { Pressable, StyleSheet, Text, View } from "react-native";

// scroll view kustom dengan padding konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// tombol kustom dengan style seragam
import Button from "@/components/ui/button";

// input teks kustom dengan validasi
import TextInput from "@/components/ui/text-input";

// context buat alur pembuatan list baru
import { useListCreation } from "@/context/ListCreationContext";

// ambil state shopping list dari store
import { useShoppingListValue } from "@/stores/ShoppingListStore";

// atur tampilan status bar (area atas hp)
import { StatusBar } from "expo-status-bar";

// komponen utama halaman detail daftar belanja
export default function ListScreen() {
  // hook router buat navigasi
  const router = useRouter();
  // ambil listid dari url (misal /list?listid=123)
  const { listId } = useLocalSearchParams() as { listId: string };

  // state nama list (terhubung ke store zustand)
  const [name, setName] = useShoppingListValue(listId, "name");
  // state deskripsi list
  const [description, setDescription] = useShoppingListValue(
    listId,
    "description"
  // tutup parameter useShoppingListValue
  );
  // state emoji list (icon di header)
  const [emoji, setEmoji] = useShoppingListValue(listId, "emoji");
  // state warna background list
  const [color, setColor] = useShoppingListValue(listId, "color");

  // ambil state dan setter dari context pembuatan list
  const { selectedEmoji, selectedColor, setSelectedColor, setSelectedEmoji } =
    useListCreation(); // context buat alur buat list baru

  // inisialisasi context dengan nilai list saat ini
  useEffect(() => {
    // set emoji dan warna di context sesuai nilai list
    setSelectedEmoji(emoji);
    setSelectedColor(color);
    // cleanup: reset context saat komponen dilepas
    return () => {
      setSelectedEmoji(""); // kosongkan emoji
      setSelectedColor(""); // kosongkan warna
    // tutup fungsi cleanup
    };
  // jalan ulang efek hanya kalau listid berubah
  }, [listId]);

  // efek: update data list saat nilai context berubah
  useEffect(() => {
    // update emoji kalau context berubah dan berbeda dari nilai sekarang
    if (selectedEmoji && selectedEmoji !== emoji) setEmoji(selectedEmoji);
    // update warna kalau context berubah dan berbeda dari nilai sekarang
    if (selectedColor && selectedColor !== color) setColor(selectedColor);
  // jalan ulang efek kalau selectedEmoji atau selectedColor berubah
  }, [selectedEmoji, selectedColor]);

  // handler saat tombol emoji diklik
  const handleEmojiPress = () => {
    // cek OS: haptics hanya untuk iOS
    if (process.env.EXPO_OS === "ios") {
      // getaran medium saat pilih emoji
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // tutup if
    }
    // navigasi ke halaman pemilih emoji
    router.push("/emoji-picker");
  // tutup fungsi handleEmojiPress
  };

  // handler saat tombol warna diklik
  const handleColorPress = () => {
    // cek OS: haptics hanya untuk iOS
    if (process.env.EXPO_OS === "ios") {
      // getaran medium saat pilih warna
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // tutup if
    }
    // navigasi ke halaman pemilih warna
    router.push("/color-picker");
  // tutup fungsi handleColorPress
  };

  // mulai return tampilan komponen
  return (
    // fragment react (biar bisa return multiple elements)
    <>
      {/* konfigurasi header kustom untuk stack navigator */}
      <Stack.Screen
        // prop buat konfigurasi halaman di stack navigator
        options={{
          // tombol cancel di kiri header
          headerLeft: () => (
            <Button variant="ghost" onPress={router.back}>
              Cancel
            </Button> // tutup Button cancel
          // tutup fungsi headerLeft
          ),
        // tutup objek options
        }}
      // tutup Stack.Screen (self-closing)
      />
      {/* atur status bar jadi terang (ikon gelap) dengan animasi halus */}
      <StatusBar style="light" animated />
      {/* scroll view utama dengan style dari stylesheet */}
      <BodyScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* pembungkus input dengan style khusus */}
        <View style={styles.inputContainer}>
          {/* input teks buat nama list */}
          <TextInput
            label="Name" // label di atas input
            placeholder="Potatoes" // teks contoh saat kosong
            value={name} // nilai saat ini dari state
            onChangeText={setName} // handler perubahan teks
            returnKeyType="done" // ubah tombol enter jadi "Done"
            containerStyle={styles.titleInputContainer} // style khusus kontainer
          // tutup TextInput (akan ditutup di baris selanjutnya)
          />
          {/* tombol pilih emoji (dibungkus Pressable biar bisa klik) */}
          <Pressable
            onPress={handleEmojiPress} // panggil fungsi saat diklik
            style={[styles.emojiButton, { borderColor: color }]} // style dasar + border sesuai warna list
          >
            {/* kontainer dalam buat atur ukuran emoji */}
            <View style={styles.emojiContainer}>
              {/* tampilin emoji yang dipilih (misal 🥔) */}
              <Text>{emoji}</Text> 
            {/* tutup kontainer emoji */}
            </View> 
          {/* tutup tombol emoji */}
          </Pressable> 

          {/* tombol pilih warna (dibungkus Pressable) */}
          <Pressable
            onPress={handleColorPress} // panggil fungsi saat diklik
            style={[styles.colorButton, { borderColor: color }]} // style dasar + border sesuai warna
          >
            {/* kontainer dalam buat preview warna */}
            <View style={styles.colorContainer}>
              {/* kotak kecil yang backgroundnya sesuai warna dipilih */}
              <View style={[styles.colorPreview, { backgroundColor: color }]} />
            {/* tutup kontainer warna */}
            </View>
          {/* tutup tombol warna */}
          </Pressable>
        {/* tutup pembungkus utama (inputContainer) */}
        </View>
        {/* input teks multiline buat deskripsi list */}
        <TextInput
          label="Description" // label di atas input
          placeholder="Potatoes are good" // teks contoh saat kosong
          textAlignVertical="top" // teks mulai dari atas (bukan tengah)
          value={description} // nilai saat ini dari state
          multiline // aktifkan mode multiline (bisa bikin baris baru)
          numberOfLines={4} // batas 4 baris (tapi bisa scroll kalau lebih)
          onChangeText={setDescription} // handler update saat teks berubah
        // tutup TextInput (self-closing)
        />
      {/* tutup BodyScrollView (konten utama yang bisa di-scroll) */}
      </BodyScrollView>
    {/* tutup fragment react (<>) */}
    </>
  // tutup return JSX komponen
  );
// tutup komponen ListScreen
}

// definisi style khusus halaman ini (menggunakan StyleSheet untuk optimasi)
const styles = StyleSheet.create({
  // style konten dalam scroll view (padding seragam di semua sisi)
  scrollViewContent: {
    padding: 16, // padding seragam di semua sisi konten
  // tutup scrollViewContent
  },
  // pembungkus input nama + emoji + warna (susun horizontal dengan rata tengah)
  inputContainer: {
    flexDirection: "row", // susun anak horizontal (nama + emoji + warna)
    alignItems: "center", // rata tengah vertikal
    gap: 8, // jarak antar elemen 8px
  // tutup inputContainer
  },
  // kontainer input nama (ambil space tersisa, bisa menyusut kalau perlu)
  titleInputContainer: {
    flexGrow: 1, // input nama ambil space tersisa
    flexShrink: 1, // bisa menyusut kalau space kurang
  // tutup titleInputContainer
  },
  // tombol emoji (lingkaran dengan border tebal)
  emojiButton: {
    padding: 1, // padding dalam tombol emoji
    borderWidth: 3, // border tebal 3px (biar terlihat jelas)
    borderRadius: 100, // lingkaran sempurna
    marginTop: 16, // jarak atas dari input nama
  // tutup emojiButton
  },
  // kontainer dalam emoji (atur ukuran dan posisi)
  emojiContainer: {
    width: 28, // lebar kontainer emoji
    height: 28, // tinggi kontainer emoji
    alignItems: "center", // emoji di tengah horizontal
    justifyContent: "center", // emoji di tengah vertikal
  // tutup emojiContainer
  },
  // tombol warna (mirip emojiButton tapi terpisah biar bisa style beda)
  colorButton: {
    marginTop: 16, // jarak atas sama dengan emojiButton
    padding: 1, // padding dalam tombol warna
    borderWidth: 3, // border tebal 3px
    borderRadius: 100, // lingkaran sempurna
  // tutup colorButton
  },
  // kontainer dalam preview warna (atur ukuran dan posisi)
  colorContainer: {
    width: 28, // lebar kontainer warna
    height: 28, // tinggi kontainer warna
    alignItems: "center", // preview di tengah horizontal
    justifyContent: "center", // preview di tengah vertikal
  // tutup colorContainer
  },
  // kotak preview warna (lingkaran dalam border)
  colorPreview: {
    width: 24, // lebar kotak preview warna
    height: 24, // tinggi kotak preview
    borderRadius: 100, // lingkaran sempurna
  // tutup colorPreview
  },
// tutup objek styles
});