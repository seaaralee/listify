// baca react dan hook state buat bikin komponen dinamis
import React, { useState } from "react";

// ambil stack navigator, baca param url, dan router buat navigasi
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

// komponen dasar: alert, deteksi platform, dan view (kotak)
import { Alert, Platform, View } from "react-native";

// teks yang otomatis ganti warna sesuai tema (gelap/terang)
import { ThemedText } from "@/components/ThemedText";

// scroll view kustom dengan padding konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// tombol kustom
import Button from "@/components/ui/button";

// ikon kaya di ios (sf symbols)
import { IconSymbol } from "@/components/ui/IconSymbol";

// input teks kustom
import TextInput from "@/components/ui/text-input";

// hook buat tambah produk ke shopping list (dari store zustand)
import { useAddShoppingListProductCallback } from "@/stores/ShoppingListStore";

// komponen utama halaman tambah item baru ke shopping list
export default function NewItemScreen() {
  // ambil listid dari url (misal /new-item?listid=123)
  const { listId } = useLocalSearchParams() as { listId: string };
  // state buat nama produk
  const [name, setName] = useState("");
  // state buat satuan (default kg)
  const [units, setUnits] = useState("kg");
  // state buat catatan tambahan
  const [notes, setNotes] = useState("");
  // state buat jumlah (default 1)
  const [quantity, setQuantity] = useState(1);

  // hook router buat navigasi
  const router = useRouter();
  // fungsi callback buat tambah produk ke list ini
  const addShoppingListProduct = useAddShoppingListProductCallback(listId);
  
  // fungsi buat tambah produk baru ke list
  const handleCreateProduct = () => {
    // cek apakah nama produk kosong (setelah hapus spasi di awal/akhir)
    if (!name.trim()) {
      // tampilin alert error kalau nama kosong
      Alert.alert(
        "📝 Product title required", // judul alert
        "🛒 Please provide a product title to add it to your shopping list.", // pesan alert
        [{ text: "OK" }] // tombol OK di alert
      );
      return; // hentikan fungsi kalau nama kosong
    // tutup if
    }

    // tambah produk ke shopping list dengan data lengkap
    addShoppingListProduct(name.trim(), quantity, units, notes);
    // kembali ke halaman sebelumnya (daftar belanja)
    router.back();
  // tutup fungsi handleCreateProduct
  };

  // mulai return tampilan komponen
  return (
    // fragment react (biar bisa return multiple elements tanpa wrapper tambahan)
    <>
      {/* sembunyiin header default dari stack navigator */}
      {/* komponen screen buat konfigurasi halaman ini */}
      <Stack.Screen
        // opsi khusus buat halaman ini
        options={{
          // matiin header di halaman ini
          headerShown: false,
        // tutup objek options
        }}
      // tutup Stack.Screen (self-closing)
      />

      {/* header kustom buat halaman ini (karena header default disembunyikan) */}
      <View
        // style untuk header kustom
        style={{
          flexDirection: "row", // susun item horizontal (cancel + title + save)
          alignItems: "center", // rata tengah vertikal
          justifyContent: "space-between", // sebar item ke kiri, tengah, kanan
          paddingTop: 50, // padding atas buat space status bar
          paddingHorizontal: 16, // padding kiri-kanan
          paddingBottom: 12, // padding bawah
          backgroundColor: "white", // background putih (cocok buat mode terang)
        // tutup objek style
        }}
      >
        {/* tombol cancel di kiri */}
        <Button
          variant="ghost" // style tanpa background penuh
          onPress={router.back} // kembali ke halaman sebelumnya
          textStyle={{ color: "#C73572" }} // warna teks ungu muda
        >
          {/* teks tombol cancel */}
          Cancel
        {/* tutup Button cancel */}
        </Button>

        {/* judul halaman di tengah */}
        <ThemedText
          // style untuk komponen (object style inline)
          style={{
            fontSize: 20, // ukuran font besar
            fontWeight: "600", // semi-bold
            color: "#C73572", // warna ungu muda
          // tutup objek style
          }}
        >
          {/* teks tombol tambah produk */}
          Add Product
        {/* tutup ThemedText judul */}
        </ThemedText>

        {/* tombol save di kanan */}
        <Button
          variant="ghost" // style tanpa background penuh
          onPress={handleCreateProduct} // panggil fungsi tambah produk saat diklik
          disabled={!name.trim()} // nonaktifkan kalau nama produk kosong
          textStyle={{ // prop buat styling teks di dalam tombol
            color: name.trim() ? "#006FFD" : "#BDBDBD", // biru kalau aktif, abu-abu kalau disabled
            fontWeight: "600", // semi-bold biar mencolok
          // tutup objek textStyle
          }}
        >
          {/* teks tombol simpan */}
          Save 
        {/* tutup Button save */}
        </Button> 
      {/* tutup View custom header */}
      </View> 

      {/* konten utama halaman (form input) */}
      <BodyScrollView
        // style untuk kontainer scroll (padding konsisten)
        contentContainerStyle={{
          padding: 16, // padding seragam di semua sisi
          paddingTop: 20, // padding atas tambahan buat jarak dari header
        // tutup objek contentContainerStyle
        }}
      >
        {/* input nama produk */}
        <TextInput
          label="Name" // label di atas input
          placeholder="Potatoes" // teks bantu saat input kosong
          value={name} // nilai input diambil dari state name
          onChangeText={setName} // update state saat teks berubah
          autoFocus // otomatis fokus saat halaman muncul
          returnKeyType="done" // ganti tombol enter jadi "Done" di keyboard
          onSubmitEditing={handleCreateProduct} // panggil fungsi simpan saat tekan done
          inputStyle={{ // prop buat styling input field di dalam komponen TextInput
            borderWidth: 1, // border setebal 1px
            borderColor: "#F1B7CF", // warna border ungu muda
            borderRadius: 10, // sudut melengkung 10px
            paddingHorizontal: 12, // padding horizontal dalam input
          // tutup inputStyle
          }}
        // tutup TextInput
        />

        {/* input satuan produk (kg, pcs, dll) */}
        <TextInput
          label="Units" // label di atas input
          placeholder="kg" // contoh satuan default
          value={units} // nilai saat ini dari state units
          onChangeText={setUnits} // update state saat teks berubah
          inputStyle={{
            borderWidth: 1, // border 1px
            borderColor: "#F1B7CF", // warna border ungu muda
            borderRadius: 10, // sudut melengkung 10px
            paddingHorizontal: 12, // padding kiri-kanan dalam input
          // tutup inputStyle
          }}
        // tutup TextInput
        />

        {/* bagian input jumlah (quantity) */}
        <View
          // style untuk baris jumlah (counter + teks)
          style={{
            flexDirection: "row", // susun item horizontal
            alignItems: "center", // rata tengah vertikal
            justifyContent: "space-between", // sebar item ke kiri dan kanan
            marginTop: 16, // jarak atas dari input units
          // tutup objek style
          }}
        >
          {/* teks tampilin jumlah + satuan */}
          <ThemedText>
            {/* contoh: "x2 kg" */}
            x{quantity} {units} 
          {/* tutup ThemedText */}
          </ThemedText> 

          {/* pengatur jumlah (counter) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* tombol kurang (-) */}
            <Button
              onPress={() => setQuantity(Math.max(0, quantity - 1))} // kurangi jumlah, minimal 0
              variant="ghost" // style tanpa background penuh
            >
              {/* ikon minus warna ungu muda */}
              <IconSymbol name="minus" color={"#F681AD"} />
            {/* tutup Button minus */}
            </Button> 
            
            {/* tombol tambah (+) */}
            <Button
              onPress={() => setQuantity(quantity + 1)} // tambah jumlah
              variant="ghost" // style tanpa background penuh
            >
              {/* ikon plus warna ungu muda */}
              <IconSymbol name="plus" color={"#F681AD"} /> 
            {/* tutup Button plus */}
            </Button>
          {/* tutup View counter */}
          </View> 
        {/* tutup View quantity section */}
        </View>

        {/* input catatan (opsional) */}
        <TextInput
          label="Notes" // label di atas input
          placeholder="Notes (optional)" // teks bantu saat kosong
          value={notes} // nilai saat ini dari state notes
          onChangeText={setNotes} // update state saat teks berubah
          multiline // aktifkan mode multiline (bisa bikin baris baru)
          numberOfLines={4} // batas 4 baris (tapi bisa scroll kalau lebih)
          textAlignVertical="top" // teks mulai dari atas (bukan tengah)
          inputStyle={{ // prop buat styling khusus input field (komponen custom)
            height: 100, // tinggi tetap 100px
            borderWidth: 1, // border 1px
            borderColor: "#F1B7CF", // warna border ungu muda
            borderRadius: 10, // sudut melengkung 10px
            paddingHorizontal: 12, // padding horizontal dalam input
          // tutup inputStyle
          }}
        // tutup TextInput
        />

        {/* tombol tambah produk khusus android (di bawah form) */}
        {Platform.OS !== "ios" && ( // tampilin hanya kalau bukan iOS
          <View style={{ marginTop: 24 }}> // jarak atas 24px dari form
            <Button
              onPress={handleCreateProduct} // jalankan fungsi simpan saat diklik
              disabled={!name.trim()} // nonaktif kalau nama kosong
              // style untuk background tombol
              style={{
                backgroundColor: "#CA407A", // warna background ungu muda
              // tutup objek style
              }}
              // style untuk teks di dalam tombol
              textStyle={{
                color: "#FFFFFF", // warna teks putih
                fontWeight: "600", // teks semi-bold
              // tutup objek textStyle
              }}
            >
              Add product
            {/* tutup Button */}
            </Button> 
          </View> // tutup View pembungkus tombol
        // tutup kondisi android
        )}
      {/* tutup BodyScrollView (konten utama yang bisa di-scroll) */}
      </BodyScrollView>
    {/* tutup fragment react (<>) */}
    </>
  // tutup return JSX komponen
  ); 
// tutup fungsi komponen NewItemScreen
}