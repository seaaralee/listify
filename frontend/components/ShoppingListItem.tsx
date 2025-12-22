import React from "react"; // import react untuk jsx dan komponen
// import haptics dari expo untuk feedback getaran
import * as Haptics from "expo-haptics";
// import Link dari expo-router untuk navigasi linkable
import { Link } from "expo-router";
// import komponen dasar react-native yang dipakai
import { Pressable, StyleSheet, View } from "react-native";
// import swipeable yang sudah di-reanimated dari gesture-handler
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
// import animasi dan helper dari reanimated
import Animated, { FadeIn, SharedValue, useAnimatedStyle } from "react-native-reanimated";
// import seluruh reanimated juga (digunakan untuk View ter-animasi)
import Reanimated from "react-native-reanimated";
// import warna konstan
import { appleRed } from "@/constants/Colors";
// import callback untuk menghapus shopping list dari store
import { useDelShoppingListCallback } from "@/stores/ShoppingListsStore";
// import selector hooks untuk shopping list
import {
  useShoppingListProductCount,
  useShoppingListUserNicknames,
  useShoppingListValue,
} from "@/stores/ShoppingListStore";

// import komponen teks yang mendukung tema
import { ThemedText } from "./ThemedText";
// import ikon simbol
import { IconSymbol } from "./ui/IconSymbol";

// komponen utama item daftar belanja
export default function ShoppingListItem({ listId }: { listId: string }) {
  // ambil nama list dari store
  const [name] = useShoppingListValue(listId, "name");
  // ambil emoji list dari store
  const [emoji] = useShoppingListValue(listId, "emoji");
  // ambil warna list dari store
  const [color] = useShoppingListValue(listId, "color");
  // ambil jumlah produk
  const productCount = useShoppingListProductCount(listId);
  // ambil nickname user yang terkait
  const userNicknames = useShoppingListUserNicknames(listId);

  // callback hapus list
  const deleteCallback = useDelShoppingListCallback(listId);

  // definisi aksi kanan untuk swipeable (icon trash)
  const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    // style animasi berdasarkan nilai drag
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 200 }],
    }));

    return (
      // pressable untuk area aksi hapus
      <Pressable
        // saat ditekan, beri haptics dan panggil delete
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          deleteCallback();
        }}
      >
        {/* view animasi untuk ikon hapus */}
        <Reanimated.View style={[styleAnimation, styles.rightAction]}>
          <IconSymbol name="trash.fill" size={24} color="white" />
        </Reanimated.View>
        {/* penutup reanimated.view */}
      </Pressable>
      // penutup pressable
    );
  }; // akhir definisi RightAction

  return (
    // animated wrapper yang masuk dengan efek fade
    <Animated.View entering={FadeIn} style={styles.cardWrapper}>
      {/* swipeable yang bisa digeser ke kiri untuk aksi */}
      <ReanimatedSwipeable
        // kunci berdasarkan id list
        key={listId}
        // gesekan/friction
        friction={2}
        // threshold untuk men-trigger aksi
        rightThreshold={40}
        // render aksi kanan
        renderRightActions={RightAction}
        // jangan overshoot ke kanan
        overshootRight={false}
      >
        {/* link ke halaman detail list, gunakan asChild untuk membungkus Pressable */}
        <Link href={{ pathname: "/list/[listId]", params: { listId } }} asChild>
          {/* pressable utama kartu */}
          <Pressable style={styles.card}>
            {/* baris atas kartu: emoji, judul, chevron */}
            <View style={styles.topRow}>
              {/* kotak emoji dengan background warna list */}
              <View style={[styles.emojiBox, { backgroundColor: color }]}>
                <ThemedText style={styles.emoji}>{emoji}</ThemedText>
              </View>
              {/* penutup view emojiBox */}

              {/* kolom teks tengah */}
              <View style={styles.centerText}>
                {/* judul list */}
                <ThemedText style={styles.title}>{name}</ThemedText>

                {/* jika ada user nicknames, tampilkan baris nick */}
                {userNicknames.length > 0 && (
                  <View style={styles.nickRow}>
                    {/* tampilkan maksimal 5 nickname sebagai lingkaran */}
                    {userNicknames.slice(0, 5).map((nick, i) => (
                      <NicknameCircle key={i} nickname={nick} color={color} index={i} />
                    ))}
                  </View>
                )} {/* penutup conditional nickRow */}
              </View>
              {/* penutup centerText */}

              {/* container untuk ikon chevron */}
              <View style={styles.chevronContainer}>
                <IconSymbol name="chevron.right" size={18} color="#CA407A" />
              </View>
              {/* penutup chevronContainer */}
            </View>
            {/* penutup topRow */}

            {/* baris bawah kartu: jumlah produk */}
            <View style={styles.bottomRow}>
              <ThemedText style={styles.productCount}>
                {productCount} products
              </ThemedText>
            </View>
            {/* penutup bottomRow */}
          </Pressable>
          {/* penutup pressable kartu */}
        </Link>
        {/* penutup Link */}
      </ReanimatedSwipeable>
      {/* penutup ReanimatedSwipeable */}
    </Animated.View>
    // penutup animated.wrapper
  );
} // akhir komponen ShoppingListItem

// nickname circle — sudah benar di dalam file ini, tidak perlu di-import
export const NicknameCircle = ({
  // prop nickname string
  nickname,
  // prop warna background
  color,
  // prop index untuk offset margin
  index,
}: {
  // tipe nickname
  nickname: string;
  // tipe color
  color: string;
  // tipe index
  index: number;
}) => {
  // fungsi komponen mengembalikan view kecil
  return (
    // lingkaran kecil menampilkan inisial nickname 
    <View
      // gabungan style statis dan dinamis 
      style={[
        // style lingkaran dasar
        styles.nicknameCircle,
        // tambahkan background color dan margin negatif jika bukan item pertama
        { backgroundColor: color, marginLeft: index > 0 ? -6 : 0 },
      ]}
    >
      {/* teks inisial nickname, diambil huruf pertama lalu uppercase */}
      <ThemedText style={styles.nicknameText}>
        {nickname[0].toUpperCase()}
      </ThemedText>
    </View>
    // penutup view nickname circle 
  );
// akhir NicknameCircle  
}; 

// style sheet komponen
const styles = StyleSheet.create({
  // wrapper kartu
  cardWrapper: {
    // padding horizontal wrapper
    paddingHorizontal: 16,
    // jarak bawah antar kartu
    marginBottom: 12,
  }, // penutup cardWrapper

  // style kartu utama
  card: {
    // latar putih kartu
    backgroundColor: "white",
    // radius sudut kartu
    borderRadius: 16,
    // padding di dalam kartu
    padding: 12,
    // lebar border kartu
    borderWidth: 2,
    // warna border kartu
    borderColor: "#F5B6D3",
  }, // penutup card

  // baris atas
  topRow: {
    // susun anak secara horizontal
    flexDirection: "row",
    // align center vertikal
    alignItems: "center",
  }, // penutup topRow

  // kotak emoji
  emojiBox: {
    // lebar kotak emoji
    width: 60,
    // tinggi kotak emoji
    height: 60,
    // radius sudut kotak emoji
    borderRadius: 14,
    // center content vertikal
    justifyContent: "center",
    // center content horizontal
    alignItems: "center",
  }, // penutup emojiBox

  // style teks emoji
  emoji: {
    // ukuran font emoji
    fontSize: 24,
  }, // penutup emoji

  // kolom teks tengah
  centerText: {
    // biarkan mengambil ruang tersisa
    flex: 1,
    // jarak dari emoji
    marginLeft: 12,
  }, // penutup centerText

  // judul list
  title: {
    // warna judul
    color: "#CA407A",
    // ukuran font judul
    fontSize: 16,
    // ketebalan font judul
    fontWeight: "600",
  }, // penutup title

  // baris nickname
  nickRow: {
    // susun nickname secara horizontal
    flexDirection: "row",
    // jarak atas nick row
    marginTop: 4,
  }, // penutup nickRow

  // lingkaran nickname
  nicknameCircle: {
    // lebar lingkaran
    width: 22,
    // tinggi lingkaran
    height: 22,
    // radius agar bulat
    borderRadius: 20,
    // center isi vertikal
    justifyContent: "center",
    // center isi horizontal
    alignItems: "center",
    // border tipis putih agar terlihat di overlap
    borderWidth: 1,
    // warna border putih
    borderColor: "white",
  }, // penutup nicknameCircle

  // teks dalam lingkaran nickname
  nicknameText: {
    // warna teks inisial
    color: "white",
    // ukuran font inisial
    fontSize: 12,
    // ketebalan font inisial
    fontWeight: "600",
    // line height agar teks vertikal center presisi
    lineHeight: 22,
  }, // penutup nicknameText

  // container chevron
  chevronContainer: {
    // padding horizontal kecil untuk area chevron
    paddingHorizontal: 6,
  }, // penutup chevronContainer

  // baris bawah
  bottomRow: {
    // jarak atas dari konten atas
    marginTop: 8,
    // garis pemisah atas
    borderTopWidth: 1,
    // warna garis pemisah
    borderTopColor: "#F4C4DA",
    // padding top setelah garis
    paddingTop: 6,
  }, // penutup bottomRow

  // teks jumlah produk
  productCount: {
    // warna teks jumlah produk
    color: "#444",
    // ukuran font jumlah produk
    fontSize: 13,
  }, // penutup productCount

  // aksi kanan saat swipe (background merah)
  rightAction: {
    // lebar aksi kanan
    width: 200,
    // tinggi menyesuaikan parent
    height: "100%",
    // warna background aksi (merah)
    backgroundColor: appleRed,
    // center isi vertikal
    justifyContent: "center",
    // center isi horizontal
    alignItems: "center",
  }, // penutup rightAction
}); // penutup StyleSheet.create