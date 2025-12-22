import React from "react"; // ngimpor React biar bisa bikin komponen JSX
import * as Haptics from "expo-haptics"; // buat getar/haptic feedback di iOS
import { useRouter } from "expo-router"; // buat navigasi antar halaman
import { Pressable, StyleSheet, View } from "react-native"; // komponen dasar RN: tombol, view, styling
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable"; // buat swipe kanan/kiri dengan animasi
import Reanimated, { 
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"; // buat animasi smooth dan shared values
import { appleRed, borderColor } from "@/constants/Colors"; // warna-warna yang dipakai di app
import {
  useDelShoppingListProductCallback,
  useShoppingListProductCell,
  useShoppingListValue,
} from "@/stores/ShoppingListStore"; // hook buat akses dan ubah data shopping list
import { ThemedText } from "./ThemedText"; // komponen teks yang otomatis adaptasi tema
import { IconSymbol } from "./ui/IconSymbol"; // komponen icon lokal

export default function ShoppingListProductItem({ // deklarasi fungsi komponen utama dan langsung diekspor
  listId, // parameter props: id list
  productId, // parameter props: id produk
}: { // buka deklarasi tipe props
  listId: string; // tipe data listId adalah string
  productId: string; // tipe data productId adalah string
}) { // buka body fungsi komponen ShoppingListProductItem

  const router = useRouter(); // buat navigasi ke halaman detail produk
  const [name] = useShoppingListProductCell(listId, productId, "name"); // ambil nama produk
  const [color] = useShoppingListValue(listId, "color"); // ambil warna list biar checkbox ikut warnanya
  const [isPurchased, setIsPurchased] = useShoppingListProductCell( // ambil status beli dan setter-nya
    listId, // id list
    productId, // id produk
    "isPurchased" // ambil properti isPurchased
  ); // ambil status beli, dan fungsi buat toggle
  const deleteCallback = useDelShoppingListProductCallback(listId, productId); // fungsi buat hapus produk

  // ini fungsi buat tombol swipe kanan (trash)
  const RightAction = ( // deklarasi fungsi RightAction
    prog: SharedValue<number>, // parameter: progress swipe (SharedValue dari Reanimated)
    drag: SharedValue<number> // parameter: jarak drag swipe (SharedValue dari Reanimated)
  ) => { // buka body fungsi RightAction
    const styleAnimation = useAnimatedStyle(() => { // bikin style animasi pakai hook Reanimated
      return { // mulai object return untuk style animasi
        transform: [{ translateX: drag.value + 80 }], // geser elemen horizontal sesuai drag + offset 80
      }; // tutup object return
    }); // tutup useAnimatedStyle

    return ( // mulai return JSX untuk fungsi RightAction
      <Pressable // buka tombol tekan (Pressable) untuk aksi hapus
        onPress={() => { // event handler onPress: fungsi dijalankan saat tombol ditekan
          if (process.env.EXPO_OS === "ios") { // cek platform, kalau iOS
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // mainkan haptic feedback jenis error
          } // tutup if
          deleteCallback(); // panggil fungsi hapus produk
        }} // tutup fungsi onPress
      > {/* buka isi Pressable */}

        {/* buka View animasi untuk tombol swipe kanan, gabung style animasi + style statis */}
        <Reanimated.View style={[styleAnimation, styles.rightAction]}> 
          {/* ikon tong sampah, self-closing tag */}
          <IconSymbol name="trash.fill" size={24} color="white" /> 
        {/* tutup Reanimated.View */}
        </Reanimated.View>
      {/* tutup tombol Pressable yang membungkus animasi tombol swipe */}
      </Pressable>
    ); // tutup return JSX di fungsi RightAction
  }; // tutup fungsi RightAction

  return ( // mulai return JSX utama komponen
    <ReanimatedSwipeable // buka komponen swipeable (bisa swipe kanan/kiri)
      key={productId} // biar React bisa nge-track item list
      friction={2} // seberapa berat swipe
      enableTrackpadTwoFingerGesture // swipe dua jari di trackpad
      rightThreshold={40} // jarak minimal swipe buat trigger
      renderRightActions={RightAction} // panggil fungsi swipe kanan
      overshootRight={false} // matiin efek overshoot kanan
      enableContextMenu // biar context menu bisa muncul
      containerStyle={{ // mulai object style untuk container swipeable
        paddingBottom: 12, // padding bawah container
        paddingHorizontal: 16, // padding kiri dan kanan container
      }} // padding luar swipeable
    >
      <View // buka komponen View, sebagai container untuk baris item shopping list
        style={{ // mulai object style inline untuk View
          flexDirection: "row", // susun anak-anak secara horizontal (baris)
          alignItems: "center", // posisikan anak-anak di tengah secara vertikal
          gap: 8, // beri jarak 8px antar elemen anak
        }} // tutup object style
      > {/* buka isi View */}

        <Pressable // buka tombol (Pressable) yang bisa ditekan
          onPress={() => { // event handler: fungsi dijalankan saat tombol ditekan
            if (process.env.EXPO_OS === "ios") { // cek platform, kalau iOS
              Haptics.notificationAsync( // panggil haptic feedback
                Haptics.NotificationFeedbackType.Success // jenis haptic: success
              ); // tutup pemanggilan fungsi haptic
            } // tutup if
            setIsPurchased(!isPurchased); // toggle status beli: kalau sebelumnya true jadi false, sebaliknya
          }} // tutup fungsi onPress
        > {/* buka isi Pressable */}

          <IconSymbol // buka komponen ikon
            name={isPurchased ? "checkmark.circle.fill" : "circle"} // centang kalau udah beli, lingkaran kosong kalau belum
            size={28} // ukuran ikon 28px
            color={color} // pake warna list
          />
        {/* tutup tombol Pressable untuk toggle status beli */}
        </Pressable>
        <Pressable // buka komponen tombol tekan (Pressable)
          onPress={() => { // properti onPress: fungsi yang dijalankan saat tombol ditekan
            router.push({ // panggil router untuk navigasi ke halaman baru
              pathname: "/list/[listId]/product/[productId]", // path halaman detail produk dengan param dynamic
              params: { listId, productId }, // kirim parameter listId dan productId ke halaman
            }); // tutup object router.push
          }} // tutup fungsi onPress
          style={styles.swipeable} // style utama swipeable item
        >
          <ThemedText // buka komponen teks bertema (ThemedText)
            type="defaultSemiBold" // tipe teks semi-bold, artinya agak tebal tapi tidak seberat bold penuh
            numberOfLines={1} // kalau panjang, potong dengan ...
            ellipsizeMode="tail" // kalau teks kepanjangan, potong di akhir dan tambahkan "..." di ujung
            style={{ // mulai object style inline untuk teks
              maxWidth: "95%", // maksimal lebar teks 95% dari container, supaya nggak nabrak sisi kanan
              opacity: isPurchased ? 0.5 : 1, // setengah transparan kalau sudah dibeli
              textDecorationLine: isPurchased ? "line-through" : "none", // coret teks kalau sudah dibeli
            }} // tutup komponen
          >
            {name} {/* tampilkan nama produk */}
          </ThemedText>
        {/* tutup tombol (Pressable) yang isinya nama produk dan navigasi ke detail */}
        </Pressable>
      {/* tutup View utama baris item shopping list (yang nge-wrap checkbox + nama produk)   */}
      </View>
    </ReanimatedSwipeable> // tutup komponen swipeable, yang memungkinkan swipe kanan untuk hapus
  ); // tutup return JSX utama komponen ShoppingListProductItem
} // tutup fungsi komponen ShoppingListProductItem


const styles = StyleSheet.create({ // bikin object style lokal buat komponen ini
  swipeable: { // style utama untuk container item shopping list
    flexGrow: 1, // boleh mengembang kalau ada ruang
    flexShrink: 1, // boleh mengecil kalau sempit
    flexDirection: "row", // anak-anak di baris
    alignItems: "center", // posisinya tengah vertikal
    justifyContent: "space-between", // jarak antar elemen merata
    borderBottomWidth: StyleSheet.hairlineWidth, // garis tipis bawah
    borderBottomColor: borderColor, // warna garis bawah ambil dari konstanta borderColor
    gap: 8, // jarak antar elemen
    paddingVertical: 8, // padding atas bawah
  },
  rightAction: { // style untuk tombol aksi kanan (trash)
    width: 80, // lebar tombol hapus
    height: 40, // tinggi tombol hapus
    backgroundColor: appleRed, // warna merah
    alignItems: "center", // icon di tengah horizontal
    justifyContent: "center", // icon di tengah vertikal
  },
}); // tutup StyleSheet.create
