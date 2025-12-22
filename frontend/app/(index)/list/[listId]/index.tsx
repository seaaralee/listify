// import dasar react untuk membuat komponen react
import React from "react";

// modul haptics dari expo untuk efek getaran saat tombol ditekan
import * as Haptics from "expo-haptics";

// hook dari expo-router untuk membaca parameter url dan navigasi halaman
import { useLocalSearchParams, useRouter } from "expo-router";

// komponen inti react native: tombol tekan, view, gambar, dan styling
import { Pressable, View, Image, StyleSheet } from "react-native";

// library animasi react-native-reanimated
import Animated from "react-native-reanimated";

// ikon ionicons dari expo
import { Ionicons } from "@expo/vector-icons";

// komponen item produk di dalam shopping list
import ShoppingListProductItem from "@/components/ShoppingListProductItem";

// komponen teks yang otomatis menyesuaikan tema gelap / terang
import { ThemedText } from "@/components/ThemedText";

// scroll view custom dengan padding konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// hook zustand untuk mengambil data dari shopping list store
import {
  useShoppingListProductIds, // untuk mengambil array id produk
  useShoppingListValue, // untuk mengambil value list (nama, emoji, deskripsi)
} from "@/stores/ShoppingListStore";

// komponen utama halaman detail shopping list
export default function ListScreen() {

  // inisialisasi router untuk navigasi halaman
  const router = useRouter();
  
  // mengambil parameter listId dari url
  const { listId } = useLocalSearchParams() as { listId: string };
  
  // mengambil nama list dari zustand berdasarkan listId
  const [name] = useShoppingListValue(listId, "name");

  // mengambil emoji list
  const [emoji] = useShoppingListValue(listId, "emoji");

  // mengambil deskripsi list
  const [description] = useShoppingListValue(listId, "description");

  // object rute untuk halaman tambah produk
  const newProductHref = {
    pathname: "/list/[listId]/product/new", // path rute dinamis
    params: { listId }, // parameter listId yang dikirim
  } as const; // memastikan object bersifat readonly (typescript)

  // return digunakan untuk merender tampilan ke layar
  return (
    // view utama sebagai container halaman
    <View style={styles.container}>

      {/* header bagian atas halaman */}
      <View style={styles.header}>

        {/* tombol kembali ke halaman sebelumnya */}
        <Pressable
          onPress={() => router.back()} // ketika ditekan, kembali ke halaman sebelumnya
          style={styles.iconWrapper} // style ikon
        >
          {/* ikon panah kembali */}
          <Ionicons
            name="arrow-back-outline" // nama ikon
            size={24} // ukuran ikon
            color="#CA407A" // warna ikon
          />
        </Pressable>
        {/* penutup pressable tombol back */}

        {/* pembungkus judul list */}
        <View style={styles.titleWrapper}>

          {/* teks judul list */}
          <ThemedText style={styles.title}>
            {/* menampilkan emoji dan nama list */}
            {emoji} {name}
          </ThemedText>
          {/* penutup ThemedText */}

        </View>
        {/* penutup titleWrapper */}

        {/* container ikon bagian kanan header */}
        <View style={styles.rightIcons}>

          {/* tombol share list */}
          <Pressable
            style={styles.iconWrapper}
            onPress={() => {
              // getaran medium saat tombol ditekan
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              // navigasi ke halaman share list
              router.push({
                pathname: "/list/[listId]/share",
                params: { listId },
              });
            }}
          >
            {/* ikon share */}
            <Ionicons
              name="share-outline"
              size={24}
              color="#CA407A"
            />
          </Pressable>
          {/* penutup tombol share */}

          {/* tombol edit list */}
          <Pressable
            style={styles.iconWrapper}
            onPress={() => {
              // getaran medium
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              // pindah ke halaman edit list
              router.push({
                pathname: "/list/[listId]/edit",
                params: { listId },
              });
            }}
          >
            {/* ikon clipboard */}
            <Ionicons
              name="clipboard-outline"
              size={24}
              color="#CA407A"
            />
          </Pressable>
          {/* penutup tombol edit */}

          {/* tombol tambah produk */}
          <Pressable
            style={styles.iconWrapper}
            onPress={() => {
              // getaran medium
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

              // navigasi ke halaman tambah produk
              router.push(newProductHref);
            }}
          >
            {/* ikon tambah */}
            <Ionicons
              name="add-outline"
              size={24}
              color="#CA407A"
            />
          </Pressable>
          {/* penutup tombol tambah */}

        </View>
        {/* penutup container ikon kanan */}

      </View>
      {/* penutup header */}

      {/* flatlist animasi untuk menampilkan produk */}
      <Animated.FlatList

        // data berupa array id produk dari zustand
        data={useShoppingListProductIds(listId)}

        // render setiap item produk
        renderItem={({ item: productId }) => (
          // komponen item produk
          <ShoppingListProductItem
            listId={listId}
            productId={productId}
          />
        )}

        // agar konten bisa memenuhi layar saat kosong
        contentContainerStyle={{ flexGrow: 1 }}

        // menonaktifkan penyesuaian inset otomatis ios
        contentInsetAdjustmentBehavior="never"

        // header list (deskripsi)
        ListHeaderComponent={() =>
          description ? ( // cek apakah ada deskripsi
            <ThemedText style={styles.description}>
              {description} // isi teks deskripsi
            </ThemedText> // penutup teks
          ) : null // jika tidak ada, render kosong
        } // penutup ListHeaderComponent

        // tampilan saat list kosong
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}> {/* container utama kondisi kosong */}

            <Image
              source={require("@/assets/images/cart-add.png")} // gambar cart kosong
              style={styles.emptyImage} // style ukuran gambar
              resizeMode="contain" // gambar tidak terpotong
            /> {/* penutup image */}

            <ThemedText style={styles.emptyText}>
              Let’s add some item products! {/* teks info list kosong */}
            </ThemedText> {/* penutup teks */}

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // getaran
                router.push(newProductHref); // ke halaman tambah produk
              }}
            >
              <ThemedText style={styles.addProductText}>
                Add Product {/* teks tombol */}
              </ThemedText>
            </Pressable> {/* penutup tombol */}

          </View> // penutup emptyContainer
        )} // penutup ListEmptyComponent
      />
      {/* penutup flatlist */}

    </View>
    // penutup view container utama
  );
}
// penutup fungsi komponen listscreen

// object style menggunakan stylesheet
const styles = StyleSheet.create({

  // style container utama
  container: {
    flex: 1, // memenuhi seluruh layar
    backgroundColor: "white", // warna background
  },

// style header bagian atas
header: {
  flexDirection: "row", // susunan elemen horizontal
  alignItems: "center", // elemen sejajar vertikal di tengah
  justifyContent: "space-between", // kiri - tengah - kanan
  paddingTop: 50, // jarak dari atas layar
  paddingHorizontal: 16, // padding kiri dan kanan
  paddingBottom: 12, // padding bawah header
  backgroundColor: "white", // warna background header
},

// pembungkus judul list
titleWrapper: {
  flex: 1, // ambil sisa ruang di tengah
  alignItems: "center", // judul di tengah horizontal
},

// style teks judul
title: {
  color: "#CA407A", // warna teks pink
  fontWeight: "600", // ketebalan semi-bold
  fontSize: 16, // ukuran teks
},

// container ikon kanan
rightIcons: {
  flexDirection: "row", // ikon berjajar horizontal
  alignItems: "center", // sejajar vertikal
  gap: 16, // jarak antar ikon
},

// wrapper tiap ikon
iconWrapper: {
  width: 24, // lebar area klik
  height: 24, // tinggi area klik
  alignItems: "center", // posisi horizontal tengah
  justifyContent: "center", // posisi vertikal tengah
},

// style teks deskripsi list
description: {
  paddingHorizontal: 16, // padding kiri kanan
  fontSize: 14, // ukuran teks
  color: "gray", // warna teks
},

// container saat list kosong
emptyContainer: {
  flex: 1, // isi tinggi layar
  alignItems: "center", // konten rata tengah
  paddingTop: 260, // dorong konten ke tengah layar
  gap: 8, // jarak antar elemen
},

// style gambar kosong
emptyImage: {
  width: 69, // lebar gambar
  height: 64, // tinggi gambar
  opacity: 0.8, // transparansi
},

// teks saat list kosong
emptyText: {
  color: "gray", // warna teks
  marginTop: 10, // jarak atas
  fontSize: 14, // ukuran teks
},

// teks tombol tambah produk
addProductText: {
  color: "#CA407A", // warna teks
  fontSize: 15, // ukuran teks
  marginTop: 10, // jarak atas
  fontWeight: "600", // ketebalan teks
},

}); // penutup StyleSheet.create
