// import hook useCallback dan useEffect dari React
 import { useCallback, useEffect } from "react";

// import fungsi randomUUID untuk generate ID unik
 import { randomUUID } from "expo-crypto";

// import fungsi debounce dari lodash untuk menunda eksekusi fungsi
 import { debounce } from "lodash";

// import hook buat ambil remote row id dari TinyBase UI React
 import { useRemoteRowId } from "tinybase/ui-react";

// import semua dari TinyBase UI React dengan namespace UiReact
 import * as UiReact from "tinybase/ui-react/with-schemas";

// import tipe dan fungsi utama dari TinyBase core
 import {
   Cell, // tipe Cell
   createMergeableStore, // buat store TinyBase yang bisa di-merge
   createRelationships, // buat relasi antar tabel
   Value, // tipe Value di TinyBase
 } from "tinybase/with-schemas";

// import hook custom buat ambil user id dan nickname
 import { useUserIdAndNickname } from "@/hooks/useNickname";

// import hook custom buat create persister client
 import { useCreateClientPersisterAndStart } from "@/stores/persistence/useCreateClientPersisterAndStart";

// import hook custom buat start server synchronizer
 import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";

// prefix unik untuk store ini, dipakai buat generate storeId per user
 const STORE_ID_PREFIX = "shoppingListStore-";

// schema untuk values tiap shopping list
 const VALUES_SCHEMA = {
   listId: { type: "string" }, // id list, tipe string
   name: { type: "string" }, // nama list, tipe string
   description: { type: "string" }, // deskripsi list, tipe string
   emoji: { type: "string" }, // emoji list, tipe string
   color: { type: "string" }, // warna list, tipe string
   createdAt: { type: "string" }, // tanggal pembuatan, string ISO
   updatedAt: { type: "string" }, // tanggal update terakhir, string ISO
 } as const; // as const supaya TypeScript tahu ini literal dan tipe property tidak bisa diubah

// schema untuk tabel TinyBase
 const TABLES_SCHEMA = {
   products: { // tabel "products" buat tiap item di shopping list
     id: { type: "string" }, // id produk, tipe string
     name: { type: "string" }, // nama produk
     quantity: { type: "number" }, // jumlah produk
     units: { type: "string" }, // satuan produk
     isPurchased: { type: "boolean", default: false }, // status beli, default false
     category: { type: "string", default: "" }, // kategori produk, default string kosong
     notes: { type: "string" }, // catatan tambahan
     createdBy: { type: "string" }, // siapa yang buat
     createdAt: { type: "string" }, // waktu buat
     updatedAt: { type: "string" }, // waktu update terakhir
   },
   collaborators: { // tabel "collaborators" buat simpan kolaborator list
     nickname: { type: "string" }, // nickname kolaborator
   },
 } as const; // as const supaya TypeScript tahu tipe property literal, tidak bisa diubah

// tipe gabungan schema untuk TinyBase
 type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

// tipe key dari VALUES_SCHEMA, misal "name", "description", dsb
 type ShoppingListValueId = keyof typeof VALUES_SCHEMA;

// tipe key dari kolom tabel "products", misal "id", "name", "quantity", dsb
 type ShoppingListProductCellId = keyof (typeof TABLES_SCHEMA)["products"];

// ekstrak hook-hook TinyBase UI React sesuai schema kita
 const {
   useCell, // hook buat ambil nilai sel tertentu di tabel
   useCreateMergeableStore, // hook buat bikin store TinyBase yang bisa di-merge
   useDelRowCallback, // hook buat dapetin callback hapus row di tabel
   useProvideRelationships, // hook buat provide relasi antar tabel
   useProvideStore, // hook buat provide store ke React context
   useRowCount, // hook buat ambil jumlah row di tabel
   useSetCellCallback, // hook buat dapetin callback set/update sel tertentu
   useSetValueCallback, // hook buat dapetin callback set value
   useSortedRowIds, // hook buat ambil row id yang sudah di-sort
   useStore, // hook buat ambil store TinyBase
   useCreateRelationships, // hook buat bikin relasi antar tabel
   useTable, // hook buat ambil seluruh tabel
   useValue, // hook buat ambil value tertentu
   useValuesListener, // hook buat listen perubahan value
 } = UiReact as UiReact.WithSchemas<Schemas>; // cast UiReact ke tipe dengan schema kita supaya TypeScript tau tipe store dan tabel

// hook buat generate storeId unik untuk tiap shopping list
 const useStoreId = (listId: string) => STORE_ID_PREFIX + listId; // gabungkan prefix store dengan listId

// hook buat dapetin callback untuk nambah produk ke shopping list
 export const useAddShoppingListProductCallback = (listId: string) => {
   const store = useStore(useStoreId(listId)); // ambil store TinyBase berdasarkan storeId dari listId
   const [userId] = useUserIdAndNickname(); // ambil userId dan nickname user saat ini

   return useCallback( // pakai useCallback supaya fungsi stabil antara render
     (name: string, quantity: number, units: string, notes: string) => { // parameter produk baru
       const id = randomUUID(); // generate ID unik untuk produk

       store.setRow("products", id, { // set row baru di tabel "products"
         id, // id produk
         name, // nama produk
         quantity, // jumlah produk
         units, // satuan produk
         notes, // catatan tambahan
         createdBy: userId, // user yang membuat produk
         createdAt: new Date().toISOString(), // waktu pembuatan
         updatedAt: new Date().toISOString(), // waktu update terakhir
       }); // tutup setRow

       return id; // kembalikan id produk baru
     }, // tutup fungsi parameter useCallback
     [store, listId] // dependency array, callback akan update kalau store atau listId berubah
   ); // tutup useCallback
 }; // tutup hook useAddShoppingListProductCallback

// hook buat dapetin callback untuk hapus produk di shopping list tertentu
 export const useDelShoppingListProductCallback = (
   listId: string, // id list
   productId: string // id produk
 ) => useDelRowCallback("products", productId, useStoreId(listId)); // panggil hook TinyBase untuk hapus row di tabel "products"

// hook buat ambil value tertentu dari shopping list beserta callback buat update
 export const useShoppingListValue = <ValueId extends ShoppingListValueId>(
   listId: string, // id list
   valueId: ValueId // key dari VALUES_SCHEMA, misal "name" atau "color"
 ): [
   Value<Schemas[1], ValueId>, // return value dari schema VALUES_SCHEMA
   (value: Value<Schemas[1], ValueId>) => void // callback buat set value
 ] => [
   useValue(valueId, useStoreId(listId)), // ambil value
   useSetValueCallback( // buat callback untuk set value
     valueId,
     (value: Value<Schemas[1], ValueId>) => value, // fungsi transform: return value apa adanya
     [], // dependency array kosong
     useStoreId(listId) // storeId sesuai list
   ),
 ];

// hook buat ambil semua ID produk di shopping list tertentu
export const useShoppingListProductIds = (
  listId: string, // id dari shopping list, tipe string, wajib diisi
  cellId: ShoppingListProductCellId = "createdAt", // kolom yang dipakai untuk sorting; default "createdAt" kalau tidak diberikan
  descending?: boolean, // opsional; kalau true, urut dari besar ke kecil
  offset?: number, // opsional; mulai ambil dari index tertentu
  limit?: number // opsional; jumlah maksimal row yang ingin diambil

) =>
  useSortedRowIds(
    "products", // tabel yang diambil
    cellId, // kolom untuk sort
    descending, // apakah sort descending
    offset, // offset index
    limit, // limit jumlah row
    useStoreId(listId) // storeId unik dari listId
  ); // tutup pemanggilan hook useSortedRowIds
  
// hook buat ambil jumlah produk di shopping list tertentu
export const useShoppingListProductCount = (listId: string) =>
  useRowCount("products", useStoreId(listId)); // ambil jumlah row di tabel "products" dari store list tertentu

// hook buat ambil value sel tertentu dari produk beserta callback set sel
export const useShoppingListProductCell = <
  CellId extends ShoppingListProductCellId // parameter generik CellId harus salah satu key tabel "products"
>(
  listId: string, // id shopping list
  productId: string, // id produk
  cellId: CellId // kolom di tabel "products" yang ingin diambil
): [
  Cell<Schemas[0], "products", CellId>, // value sel yang diambil
  (cell: Cell<Schemas[0], "products", CellId>) => void // callback buat set/update sel
] => [
  useCell("products", productId, cellId, useStoreId(listId)), 
  // ambil sel dari tabel "products", row productId, kolom cellId
  useSetCellCallback(
    "products", // tabel
    productId, // row id
    cellId, // kolom
    (cell: Cell<Schemas[0], "products", CellId>) => cell, 
    // fungsi transform: return sel apa adanya
    [], // dependency array kosong
    useStoreId(listId) // storeId untuk list
  ), // tutup useSetCellCallback
]; // tutup return array hook useShoppingListProductCell

// hook buat ambil nickname user yang bikin produk tertentu
export const useShoppingListProductCreatedByNickname = (
  listId: string, // id shopping list
  productId: string // id produk
) => {
  const userId = useRemoteRowId(
    "createdByNickname", // nama relasi ke tabel "collaborators"
    productId, // row id produk
    useStoreId(listId) // storeId dari list
  ); // ambil userId pembuat produk via relasi

  return useCell(
    "collaborators", // tabel "collaborators"
    userId, // row id user
    "nickname", // kolom yang ingin diambil
    useStoreId(listId) // storeId dari list
  ); // ambil nickname user pembuat produk
}; // tutup hook useShoppingListProductCreatedByNickname

// hook buat ambil semua nickname user di shopping list tertentu
export const useShoppingListUserNicknames = (listId: string) =>
  Object.entries(useTable("collaborators", useStoreId(listId))).map(
    ([, { nickname }]) => nickname // ambil hanya value nickname dari setiap row
  );

// komponen utama / store provider untuk shopping list
export default function ShoppingListStore({
  listId, // id shopping list
  useValuesCopy, // hook untuk ambil/set valuesCopy dari parent store
}: { // mulai blok tipe TypeScript untuk props (ngasih tahu bentuk props yang diterima)
  listId: string; // tipe untuk listId: harus string
  useValuesCopy: (id: string) => [string, (valuesCopy: string) => void]; // tipe untuk useValuesCopy: fungsi yang nerima id dan balik [string, setter]
}) { // tutup deklarasi props + tipe, buka badan fungsi komponen
  const storeId = useStoreId(listId); // storeId unik untuk sub-store ini
  const [userId, nickname] = useUserIdAndNickname(); // ambil userId & nickname user saat ini
  const [valuesCopy, setValuesCopy] = useValuesCopy(listId); // ambil valuesCopy & setter dari parent store

  // deklarasi konstanta `store` dan panggil hook `useCreateMergeableStore`, kasih callback yang nge-return store baru
  const store = useCreateMergeableStore(() =>
    // panggil fungsi `createMergeableStore()` buat bikin instance TinyBase store yang bisa di-merge
    createMergeableStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA) 
    // bikin store TinyBase baru dengan schema produk & values
  );

  // Provide store lebih awal supaya hook lain bisa referensi dengan aman
  useProvideStore(storeId, store);

  // Debounce callback untuk setValuesCopy supaya tidak menulis terlalu sering
  const debouncedSetValuesCopy = useCallback(
    debounce((values: string) => { // panggil debounce dari lodash, argumen pertama: fungsi yang mau ditunda; ini fungsi terima param values (tipe string)
      setValuesCopy(values); // update valuesCopy
    }, 300), // delay 300ms
    [setValuesCopy] // dependency array untuk useCallback: kalo referensi setValuesCopy berubah, buat ulang fungsi debouncedSetValuesCopy
  );  // tutup pemanggilan useCallback dan akhiri statement dengan semicolon

  // pastikan debounce dibatalkan saat komponen unmount
  useEffect(() => {
    return () => {
      debouncedSetValuesCopy.cancel && debouncedSetValuesCopy.cancel(); 
      // hentikan debounce supaya tidak memory-leak atau setState setelah unmount
    };
  }, [debouncedSetValuesCopy]);

  // listener untuk perubahan values agar update parent 'lists store' copy
  useValuesListener(
    () => {
      const storeData = {
        tables: {
          products: store.getTable("products"), // ambil tabel products
          collaborators: store.getTable("collaborators"), // ambil tabel collaborators
        },
        values: {
          ...store.getValues(), // ambil semua values
          listId, // sertakan id list
        },
      };
      debouncedSetValuesCopy(JSON.stringify(storeData)); 
      // simpan ke parent store secara terdebounce
    }, // tutup fungsi callback yang dijalanin pas values berubah, koma ini pisahin argumen pertama dari argumen kedua
    [debouncedSetValuesCopy], // dependency array: kalo debouncedSetValuesCopy berubah, listener bakal di-recreate
    false, // listen secara non-recursive: false artinya gak denger perubahan deep/nested, cuma level atas
    store // store target yang mau kita dengerin (ini argumen terakhir buat useValuesListener)
  ); // tutup pemanggilan useValuesListener, tanda ");" nutup semua argumen + function call
  // Persist store (jika belum tersimpan), lalu pastikan user saat ini ditambahkan sebagai collaborator
  useCreateClientPersisterAndStart(
    storeId,
    store,
    valuesCopy,
    async () => {
      // Ambil data values dari valuesCopy untuk inisialisasi values di sub-store
      try {
        const initialData = JSON.parse(valuesCopy); // parsing dari parent store
        // Periksa apakah ini pemuatan awal dari Store Induk
        if (initialData && initialData.name) {
          store.setValues(initialData); // set values awal
        }
      } catch (e) { // tutup try, mulai catch kalo parse JSON gagal
        console.warn(
          "Failed to parse initialValues in ShoppingListStore:",
          e
        ); // kalau gagal parse, tampilkan warning
      } // akhir blok catch

      // Tambahkan user sebagai collaborator setelah loading/inisialisasi
      store.setRow("collaborators", userId, { nickname });
    }
  );  // tutup useCreateClientPersisterAndStart

  // Start server synchronizer
  useCreateServerSynchronizerAndStart(storeId, store);

  // Buat relationship antara products(createdBy) dan collaborators
  const relationships = useCreateRelationships(store, (s) =>
    createRelationships(s).setRelationshipDefinition(
      "createdByNickname", // nama relasi
      "products", // tabel sumber
      "collaborators", // tabel target
      "createdBy" // kolom di products yang jadi foreign key
    )
  ); // tutup useCreateRelationships

  // provide relationships ke store id biar hook lain bisa pake relationship tersebut
  useProvideRelationships(storeId, relationships); 

  return null; // komponen provider tidak render apa-apa
} // akhir export default ShoppingListStore
