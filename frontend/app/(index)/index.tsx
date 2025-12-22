// import haptics dari expo untuk efek getaran
import * as Haptics from "expo-haptics";

// import stack navigator dan router untuk navigasi
import { Stack, useRouter } from "expo-router";

// import komponen inti react native
import { FlatList, Pressable, StyleSheet, Image, Text, View } from "react-native";

// komponen item shopping list
import ShoppingListItem from "@/components/ShoppingListItem";

// scroll view custom
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// komponen ikon custom
import { IconSymbol } from "@/components/ui/IconSymbol";

// hook  untuk mengambil semua id shopping list
import { useShoppingListIds } from "@/stores/ShoppingListsStore";

// asset gambar cart kosong
import cartAddImg from "@/assets/images/cart-add.png";

// komponen utama halaman home
export default function HomeScreen() {
  // inisialisasi router untuk navigasi
  const router = useRouter();
  // ambil array id shopping list dari store
  const shoppingListIds = useShoppingListIds();

  // handler tombol tambah list
  const handleNewListPress = () => {
    // getaran medium saat tombol ditekan
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // pindah ke halaman buat list baru
    router.push("/list/new");
  }; // penutup fungsi handleNewListPress

  // handler tombol profile
  const handleProfilePress = () => {
    // getaran medium
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // pindah ke halaman profile
    router.push("/profile");
  }; // penutup fungsi handleProfilePress

  // komponen tampilan saat list kosong
  const renderEmptyList = () => (
    // scroll view agar konten bisa discroll
    <BodyScrollView contentContainerStyle={styles.emptyStateContainer}>
      {/* gambar cart */}
      <Image source={cartAddImg} style={styles.cartImage} />
      {/* teks kondisi kosong */}
      <Text style={styles.emptyText}>
        Nothing to see your shopping list now :( {"\n"}
        Let's add some shopping list!
      </Text>
      {/* tombol tambah list */}
      <Pressable onPress={handleNewListPress}>
        <Text style={styles.addListText}>Add List</Text>
      </Pressable>
    </BodyScrollView>
  ); // penutup renderEmptyList

  // tombol header kiri (profile)
  const renderHeaderLeft = () => (
    <Pressable
      onPress={handleProfilePress} // saat ditekan buka profile
      style={styles.headerIconWrapper} // style wrapper ikon
      hitSlop={10} // memperbesar area klik
    >
      <View style={styles.roundIcon}>
        <IconSymbol name="person" size={20} color="#CA407A" />
      </View>
    </Pressable>
  ); // penutup renderHeaderLeft

  // tombol header kanan (tambah list)
  const renderHeaderRight = () => (
    <Pressable
      onPress={handleNewListPress} // saat ditekan tambah list
      style={styles.headerIconWrapper}
      hitSlop={10}
    >
      <View style={styles.roundIcon}>
        <IconSymbol name="plus" size={20} color="#CA407A" />
      </View>
    </Pressable>
  ); // penutup renderHeaderRight

  // return utama komponen
  return (
    <>
      {/* konfigurasi header stack */}
      <Stack.Screen
        options={{
          headerTransparent: true, // header transparan
          headerTitle: "", // judul header dikosongkan
          headerLeft: renderHeaderLeft, // tombol kiri
          headerRight: renderHeaderRight, // tombol kanan
          headerStyle: { backgroundColor: "transparent" }, // background header
          headerShadowVisible: false, // hilangkan shadow
        }}
      />

      {/* judul custom di bawah header */}
      <View style={styles.customHeader} pointerEvents="none">
        <Text style={styles.customTitle}>Listify</Text>
      </View>

      {/* daftar shopping list */}
      <FlatList
        data={shoppingListIds} // data berupa array id list
        renderItem={({ item: listId }) => (
          <ShoppingListItem listId={listId} />
        )} // render setiap item list
        contentContainerStyle={styles.listContainer} // style kontainer list
        ListEmptyComponent={renderEmptyList} // tampilan saat kosong
        contentInsetAdjustmentBehavior="automatic" // penyesuaian inset ios
      />
    </>
  ); // penutup return fragment
} // penutup fungsi HomeScreen

// stylesheet untuk halaman home
const styles = StyleSheet.create({
  // style kontainer list
  listContainer: {
    paddingTop: 8, // jarak atas
    padding: 8, // padding keseluruhan
  },

  // wrapper ikon header
  headerIconWrapper: {
    paddingTop: 16, // jarak atas
    paddingHorizontal: 8, // jarak kiri kanan
  },

  // ikon bulat di header
  roundIcon: {
    width: 36, // lebar
    height: 36, // tinggi
    borderRadius: 20, // bentuk bulat
    backgroundColor: "#F1B7CF", // warna background
    justifyContent: "center", // posisi vertikal tengah
    alignItems: "center", // posisi horizontal tengah
  },

  // container judul custom
  customHeader: {
    paddingTop: 80, // jarak dari atas layar
    paddingHorizontal: 32, // padding kiri kanan
    paddingBottom: 16, // padding bawah
  },

  // teks judul custom
  customTitle: {
    fontSize: 32, // ukuran teks besar
    fontWeight: "800", // tebal
    color: "#C73572", // warna pink
    paddingTop: 16, // jarak atas teks
  },

  // container empty state
  emptyStateContainer: {
    alignItems: "center", // konten tengah horizontal
    justifyContent: "center", // konten tengah vertikal
    paddingTop: 100, // jarak dari atas
    gap: 12, // jarak antar elemen
  },

  // gambar cart kosong
  cartImage: {
    width: 110, // lebar gambar
    height: 110, // tinggi gambar
    resizeMode: "contain", // jaga rasio gambar
    tintColor: "#E28CB3", // warna tint
  },

  // teks empty state
  emptyText: {
    textAlign: "center", // teks rata tengah
    color: "#777", // warna abu
    fontSize: 14, // ukuran teks
    lineHeight: 18, // jarak antar baris
    marginTop: 4, // jarak atas
  },

  // teks tombol tambah list
  addListText: {
    color: "#C73572", // warna teks
    fontSize: 15, // ukuran teks
    fontWeight: "600", // ketebalan
    marginTop: 6, // jarak atas
  },
}); // penutup StyleSheet.create
