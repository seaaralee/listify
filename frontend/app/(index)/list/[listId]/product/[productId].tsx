// baca react biar bisa bikin komponen
import React from "react";

// ambil router buat navigasi & use local search params buat baca url
import { router, useLocalSearchParams } from "expo-router";

// komponen dasar: view (kotak) & touchableopacity (tombol)
import { View, TouchableOpacity } from "react-native";

// atur tampilan status bar (area atas hp)
import { StatusBar } from "expo-status-bar";

// teks yang ganti warna otomatis sesuai tema (gelap/terang)
import { ThemedText } from "@/components/ThemedText";

// scroll view kustom dengan padding konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";

// input teks kustom (lebih rapi)
import TextInput from "@/components/ui/text-input";

// ikon kaya di ios (sf symbols)
import { IconSymbol } from "@/components/ui/IconSymbol";

// avatar kecil bentuk lingkaran
import { Avatar } from "@/components/ui/Avatar";

// deteksi tema sekarang (light/dark)
import { useColorScheme } from "@/hooks/useColorScheme";

// palet warna (zinc = abu-abu, colors = kustom)
import { zincColors, Colors } from "@/constants/Colors";

// ubah tanggal jadi teks manusiawi ("2 jam lalu")
import { formatFriendlyDate } from "@/utils/dateUtils";

// ambil data produk & user dari store (reactive)
import {
  useShoppingListProductCell,
  useShoppingListProductCreatedByNickname,
  useShoppingListUserNicknames,
} from "@/stores/ShoppingListStore";

// komponen utama halaman detail produk
export default function ProductScreen() {
  // ambil listid dan productid dari url (misal /product?listid=123&productid=456)
  const { listId, productId } = useLocalSearchParams() as {
    listId: string;
    productId: string;
  // tutup tipe casting
  };

  // cek apakah produk masih ada dengan mengambil nama produk
  const [name] = useShoppingListProductCell(listId, productId, "name");

  // efek samping: jalan setiap listid atau nama berubah
  React.useEffect(() => {
    // kalau produk udah dihapus (nama undefined), alihkan ke daftar
    if (name === undefined) {
      router.replace(`/list/${listId}`);
    // tutup if
    }
  // dependensi: jalan lagi kalau listid atau nama berubah
  }, [listId, name]);

  // pengecekan awal: kalau produk udah ilang, tampilin kosong
  if (name === undefined) {
    return null;
  // tutup if
  }

  // kalau masih ada, tampilin konten utama
  return <ProductContent listId={listId} productId={productId} />;
// tutup komponen ProductScreen
}

// komponen pembantu: tampilin isi detail produk
function ProductContent({
  listId,
  productId,
}: {
  listId: string;
  productId: string;
}) {
  // ambil & bind state nama produk
  const [name, setName] = useShoppingListProductCell(listId, productId, "name");
  // ambil & bind jumlah (number)
  const [quantity, setQuantity] = useShoppingListProductCell(
    listId,
    productId,
    "quantity"
  // tutup parameter
  );
  // ambil & bind satuan (pcs, kg, dll)
  const [units, setUnits] = useShoppingListProductCell(
    listId,
    productId,
    "units"
  // tutup parameter
  );
  // ambil & bind catatan (bisa kosong)
  const [notes, setNotes] = useShoppingListProductCell(
    listId,
    productId,
    "notes"
  // tutup parameter
  );
  // ambil nickname pembuat (langsung dari relasi)
  const createdBy = useShoppingListProductCreatedByNickname(listId, productId);
  // ambil waktu pembuatan (timestamp)
  const [createdAt] = useShoppingListProductCell(
    listId,
    productId,
    "createdAt"
  // tutup parameter
  );
  // ambil semua nickname user di list ini
  const userNicknames = useShoppingListUserNicknames(listId);
  // deteksi tema: light atau dark
  const colorScheme = useColorScheme();
  // boolean: true kalau mode gelap aktif
  const isDark = colorScheme === "dark";

  // fungsi buat buka halaman undang kolaborator
  const handleInviteCollaborators = () => {
    // pindah ke halaman share list
    router.push(`/list/${listId}/share`);
  // tutup fungsi
  };

  // mulai return jsx (tampilan utama)
  return (
    // body scrollable dengan padding bawah ekstra (biar gak kepotong keyboard)
    <BodyScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 100,
      // tutup objek style
      }}
    >
      {/* atur status bar jadi terang (ikon gelap) */}
      <StatusBar style="light" animated />
      
      {/* header bagian "umum" */}
      <SectionHeader title="GENERAL" />

      {/* pembungkus field umum (nama, jumlah, satuan, catatan) */}
      <View style={{ gap: 20, marginBottom: 64 }}>
        {/* field nama produk (editable) */}
        <FieldItem 
        // teks label di sebelah kiri field
        label="Product name" 
        // nilai saat ini (state name)
        value={name} 
        // fungsi update saat teks berubah (langsung set state)
        onChangeText={setName} 
        // tutup fieldItem
        />
        {/* field jumlah (input teks, tapi diubah ke number pas diset) */}
        <FieldItem
        // teks label di sebelah kiri field
        label="Quantity"
        // tampilin nilai quantity sebagai teks (karena input cuma nerima string)
        value={quantity.toString()}
        // pas user ngetik, ubah teks jadi angka lagi sebelum disimpen
        onChangeText={(value) => setQuantity(Number(value))}
        // tutup fieldItem
        />
        {/* field satuan */}
        <FieldItem label="Units" value={units} onChangeText={setUnits} />
        
        {/* field catatan (multiline, tinggi) */}
        <View style={{ gap: 12 }}>
          {/* label "Notes" dengan ikon (kalau ada) */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
              Notes
            </ThemedText>
          {/* tutup View label */}
          </View>
          {/* input teks besar buat catatan */}
          <TextInput
        // nilai input diambil dari state `notes`, kalau kosong tampilin string kosong
        value={notes || ""}
        // input bisa diedit (true = user boleh ngetik)
        editable={true}
        // saat teks berubah, update state `notes` langsung
        onChangeText={setNotes}
        // styling dasar input (bukan ghost mode)
        variant="default"
        // teks bantu kalau input masih kosong
        placeholder="Add a note..."
        // aktifin mode multiline (bisa bikin baris baru)
        multiline
        // batas maksimal 4 baris (tapi bisa scroll kalau lebih)
        numberOfLines={4}
        // styling khusus untuk input teks
        inputStyle={{
          // tinggi minimal 120px biar cukup buat catatan
          minHeight: 120,
          // teks mulai dari atas (bukan tengah)
          textAlignVertical: "top",
          // padding atas 12px biar gak mepet ke border
          paddingTop: 12,
          // background abu-abu gelap di mode gelap, terang di mode terang
          backgroundColor: isDark ? zincColors[800] : zincColors[50],
          // sudut melengkung 8px
          borderRadius: 8,
        // tutup inputStyle
        }}
        // styling wrapper luar input (border & background)
        containerStyle={{
          // background abu-abu gelap di mode gelap, terang di mode terang
          backgroundColor: isDark ? zincColors[800] : zincColors[50],
          // sudut melengkung 8px (sama dengan input dalam)
          borderRadius: 8,
          // ketebalan border 1px
          borderWidth: 1,
          // warna border lebih gelap di mode gelap, terang di mode terang
          borderColor: isDark ? zincColors[700] : zincColors[200],
        // tutup containerStyle
        }}
      // tutup TextInput (karena self-closing tag)
      />
    {/* tutup View pembungkus notes (label + input) */}
    </View>
  {/* tutup View pembungkus bagian GENERAL (semua field umum) */}
  </View>

      {/* header bagian metadata (info teknis produk) */}
      <SectionHeader title="META" />
      {/* pembungkus field meta dengan jarak antar elemen & margin bawah */}
      <View style={{ gap: 20, marginBottom: 20 }}>
        {/* field "created by" - gak bisa diedit, tampilin nickname pembuat */}
        <FieldItem label="Created by" value={createdBy ?? "unknown"} />
        {/* field "created at" - format tanggal jadi teks manusiawi */}
        <FieldItem
          label="Created at"
          value={createdAt ? formatFriendlyDate(createdAt) : "unknown"}
        // tutup FieldItem
        />
      {/* tutup View pembungkus META */}
      </View>

      {/* header bagian kolaborasi (siapa aja yang bisa akses produk ini) */}
      <SectionHeader title="SHARING" />
      {/* pembungkus bagian sharing dengan jarak antar elemen */}
      <View style={{ gap: 16 }}>
        {/* bagian avatar user */}
        <View style={{ 
          flexDirection: "row", // susun avatar horizontal
          alignItems: "center", // rata tengah vertikal
          flexWrap: "wrap", // pindah baris kalau kebanyakan avatar
          gap: 12 // jarak antar avatar 12px
                  }}>
          {/* render avatar untuk setiap user di list */}
          {userNicknames.map((nickname) => (
            // setiap avatar pakai nickname sebagai key dan prop name 
            <Avatar key={nickname} name={nickname} size={36} />
          // tutup map avatar
          ))}
          
          {/* tombol untuk menambah kolaborator baru */}
          <TouchableOpacity
            // saat diklik, panggil fungsi undang kolaborator 
            onPress={handleInviteCollaborators}
            //  style untuk tombol plus bergaris putus-putus 
            style={{
              width: 36, // lebar 36px
              height: 36, // tinggi 36px
              borderRadius: 18, // jadi lingkaran sempurna
              backgroundColor: isDark ? zincColors[700] : zincColors[200], // abu-abu gelap/terang sesuai tema
              alignItems: "center", // ikon di tengah horizontal
              justifyContent: "center", // ikon di tengah vertikal
              borderWidth: 2, // ketebalan border 2px
              borderColor: isDark ? zincColors[600] : zincColors[300], // warna border sesuai tema
              borderStyle: "dashed", // garis putus-putus
            // tutup style tombol
            }}
          // tutup pembuka TouchableOpacity
          >
            {/* ikon plus di dalam tombol */}
            <IconSymbol
              name="plus" // nama ikon SF Symbols
              size={16} // ukuran ikon 16px
              color={isDark ? zincColors[400] : zincColors[500]} // warna abu-abu lembut sesuai tema
            // tutup IconSymbol
            />
          {/* tutup TouchableOpacity (tombol plus) */}
          </TouchableOpacity>
        {/* tutup View baris avatar & tombol plus */}
        </View>
        
        {/* baris nama user di bawah avatar (dipisah koma) */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {/* loop semua nickname user */}
          {userNicknames.map((nickname, index) => (
            // teks untuk setiap nama user
            <ThemedText 
              key={nickname} // key unik untuk optimasi react
              type="default" // tipe teks default (bukan bold/italic)
              style={{ // style untuk teks nama user (warna & ukuran)
                color: isDark ? zincColors[400] : zincColors[600], // abu-abu lembut sesuai tema
                fontSize: 14 // ukuran font kecil
              // tutup style
              }}
            >
              {/* tampilin nickname user saat ini */}
              {nickname}
              {/* kasih koma kalau bukan user terakhir */}
              {index < userNicknames.length - 1 ? ", " : ""}
            {/* tutup teks nickname */}
            </ThemedText>
          // tutup map user names
          ))}
        {/* tutup View baris nama user */}
        </View>
      {/* tutup View pembungkus SHARING (avatar + nama) */}
      </View>
    {/* tutup BodyScrollView (konten utama yang bisa di-scroll) */}
    </BodyScrollView>
  // tutup return JSX dari ProductContent
  );
// tutup fungsi komponen ProductContent
}

// komponen header kecil buat tiap bagian (general/meta/sharing)
function SectionHeader({ title }: { title: string }) {
  // deteksi tema sekarang (light/dark)
  const colorScheme = useColorScheme();
  // boolean true kalau mode gelap aktif
  const isDark = colorScheme === "dark";
  
  // return teks header dengan styling khusus
  return (
    // komponen teks yang otomatis ganti warna sesuai tema (gelap/terang)
    <ThemedText 
      type="defaultSemiBold" // teks semi-bold
      style={{ 
        fontSize: 12, // ukuran font kecil
        color: isDark ? zincColors[400] : zincColors[500], // abu-abu lembut sesuai tema
        letterSpacing: 0.5, // jarak huruf dikit biar rapi
        marginBottom: 16, // jarak bawah ke konten
        marginTop: 20, // jarak atas dari konten sebelumnya
      // tutup style
      }}
    >
      {/* tampilin judul bagian (misal "META") */}
      {title}
    </ThemedText> // tutup teks header
  // tutup return
  );
// tutup komponen SectionHeader
}

// komponen field baris (label di kiri, nilai/input di kanan)
function FieldItem({
  label, // teks label di sebelah kiri
  value, // nilai yang ditampilin di kanan
  onChangeText, // fungsi callback kalau input berubah (optional)
  showEditIcon = false, // flag tampilin ikon pensil (default false)
}: {
  label: string; // wajib: string untuk label
  value: string; // wajib: string untuk nilai
  onChangeText?: (value: string) => void; // optional: fungsi handler perubahan teks
  showEditIcon?: boolean; // optional: boolean flag ikon pensil
}) {
  // deteksi tema sekarang (light/dark)
  const colorScheme = useColorScheme();
  // boolean true kalau mode gelap aktif
  const isDark = colorScheme === "dark";
  
  // mulai return tampilan komponen
  return (
    // pembungkus utama field (baris horizontal)
    <View
      // style untuk layout flex row
      style={{
        flexDirection: "row", // susun anak horizontal
        justifyContent: "space-between", // label kiri, input kanan
        alignItems: "center", // rata tengah vertikal
        gap: 12, // jarak antar elemen 12px
        minHeight: 44, // tinggi minimal biar nyaman diklik
      // tutup objek style
      }}
    // tutup pembuka View
    >
      {/* bagian kiri: label + (opsional) ikon pensil */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
        {/* teks label utama (semi-bold) */}
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
          {/* tampilin teks label dari prop */}
          {label} 
        {/* tutup ThemedText label */}
        </ThemedText>
        {/* kondisi: tampilin ikon pensil hanya kalau showEditIcon true DAN onChangeText tersedia */}
        {showEditIcon && onChangeText && (
          // ikon pensil kecil di sebelah label
          <IconSymbol
            name="pencil" // nama ikon SF Symbols
            size={16} // ukuran 16px
            color={isDark ? zincColors[400] : zincColors[500]} // warna abu-abu lembut sesuai tema
          // tutup IconSymbol
          />
        // tutup kondisi ikon pensil
        )}
      {/* tutup View bagian kiri (label + ikon) */}
      </View>
      
      {/* bagian kanan: input teks kecil (hanya tampilin nilai atau input editable) */}
      <TextInput
        value={value} // nilai teks yang ditampilin
        editable={onChangeText !== undefined} // aktifkan edit hanya kalau ada fungsi handler
        onChangeText={onChangeText} // handler perubahan teks (kalau ada)
        variant="ghost" // style tanpa border/bground berlebihan
        placeholder="..." // teks bantu kalau kosong
        size="sm" // ukuran kecil
        containerStyle={{ maxWidth: "60%", minWidth: 100 }} // batas lebar kontainer
        inputStyle={{ 
          padding: 0, // tanpa padding dalam
          margin: 0, // tanpa margin
          textAlign: "right", // teks rata kanan
          fontSize: 16, // ukuran font normal
          color: isDark ? zincColors[300] : zincColors[600], // warna teks sesuai tema
        // tutup inputStyle
        }}
      // tutup TextInput (self-closing)
      />
    {/* tutup View utama pembungkus field (label + input) */}
    </View>
  // tutup return JSX dari FieldItem
  );
// tutup komponen FieldItem
}
