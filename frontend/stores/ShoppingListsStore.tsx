// File: stores/ShoppingListsStore.tsx

// import React dan hook useCallback & useMemo dari React
 import React, { useCallback, useMemo } from "react";

// import fungsi randomUUID untuk bikin ID unik
 import { randomUUID } from "expo-crypto";

// import semua dari tinybase/ui-react dengan namespace UiReact
 import * as UiReact from "tinybase/ui-react/with-schemas";

// import fungsi untuk bikin store TinyBase dan schema kosong
 import { createMergeableStore, NoValuesSchema } from "tinybase/with-schemas";

// import hook custom untuk persister client
 import { useCreateClientPersisterAndStart } from "@/stores/persistence/useCreateClientPersisterAndStart";

// import hook untuk ambil data user dari Clerk
 import { useUser } from "@clerk/clerk-expo";

// import store shopping list lokal
 import ShoppingListStore from "./ShoppingListStore";

// import hook custom untuk sinkronisasi ke server
 import { useCreateServerSynchronizerAndStart } from "./synchronization/useCreateServerSynchronizerAndStart";

// deklarasi prefix unik untuk store ini
 const STORE_ID_PREFIX = "shoppingListsStore-";

// schema untuk tabel TinyBase
 const TABLES_SCHEMA = {
   lists: { // tabel "lists"
     id: { type: "string" }, // kolom "id" bertipe string
     valuesCopy: { type: "string" }, // kolom "valuesCopy" bertipe string
   },
 } as const; // as const supaya TypeScript tahu ini literal dan tidak bisa diubah

// ---------- EXTRACT TINYBASE HOOKS ----------

// ekstrak hook-hook TinyBase dari UiReact, sesuai schema tabel kita
 const {
   useCell, // hook buat ambil nilai sel tertentu
   useDelRowCallback, // hook buat dapetin callback hapus baris
   useProvideStore, // hook buat provide store ke React context
   useRowIds, // hook buat ambil semua ID baris di tabel tertentu
   useSetCellCallback, // hook buat dapetin callback untuk set/update sel
   useStore, // hook buat ambil store
   useTable, // hook buat ambil seluruh tabel
 } = UiReact as UiReact.WithSchemas<[typeof TABLES_SCHEMA, NoValuesSchema]>; // cast UiReact ke tipe dengan schema kita supaya TypeScript tau tipe store dan tabel

// ---------- STORE ID (stable) ----------

// hook buat generate ID unik untuk store, stabil per user
 const useStoreId = () => {
   const { user } = useUser(); // ambil data user dari Clerk
   return STORE_ID_PREFIX + (user?.id ?? "guest"); // gabungkan prefix store dengan user id, kalau nggak ada user pakai "guest"
 }; // penutup hook

// ---------- MAIN HOOKS ----------

// hook buat dapetin callback untuk menambah shopping list baru
 export const useAddShoppingListCallback = () => {
   const storeId = useStoreId(); // ambil storeId unik per user
   const store = useStore(storeId); // ambil store TinyBase berdasarkan storeId

   return useCallback( // pakai useCallback supaya fungsi tetap stabil antara render
     (name: string, description: string, emoji: string, color: string) => { // parameter untuk shopping list baru
       const id = randomUUID(); // generate ID unik untuk baris baru

       store.setRow("lists", id, { // set row baru di tabel "lists"
         id, // id baris
         valuesCopy: JSON.stringify({ // simpan data shopping list sebagai JSON string
           id, // id
           name, // nama list
           description, // deskripsi
           emoji, // emoji
           color, // warna
           createdAt: new Date().toISOString(), // waktu buat list
           updatedAt: new Date().toISOString(), // waktu update terakhir
         }), // tutup JSON.stringify dan object valuesCopy
       }); // tutup setRow untuk tabel "lists" dan baris baru

       return id; // kembalikan id baris baru
     }, // tutup fungsi parameter useCallback
     [store] // dependency array: useCallback akan update kalau store berubah
   ); // tutup useCallback
 }; // tutup hook useAddShoppingListCallback

// hook buat dapetin callback untuk "join" ke shopping list yang sudah ada
 export const useJoinShoppingListCallback = () => {
   const storeId = useStoreId(); // ambil storeId unik per user
   const store = useStore(storeId); // ambil store TinyBase berdasarkan storeId

   return useCallback( // pakai useCallback supaya fungsi stabil
     (listId: string) => { // parameter: id list yang akan di-join
       store.setRow("lists", listId, { // set row baru / update row di tabel "lists"
         id: listId, // id baris sama dengan listId
         valuesCopy: "{}", // buat valuesCopy kosong sebagai string JSON
       }); // tutup setRow
     }, // tutup fungsi parameter useCallback
     [store] // dependency array: update callback kalau store berubah
   ); // tutup useCallback
 }; // tutup hook useJoinShoppingListCallback

// ---------- VALUES COPY ----------

// hook buat ambil dan set valuesCopy dari baris tertentu di tabel "lists"
 export const useValuesCopy = (id: string) => {
   const storeId = useStoreId(); // ambil storeId unik per user

   return [ // return array berisi dua hook TinyBase
     useCell("lists", id, "valuesCopy", storeId), // ambil nilai valuesCopy dari baris id
     useSetCellCallback( // ambil callback buat set/update valuesCopy
       "lists", // nama tabel
       id, // id baris
       "valuesCopy", // kolom yang di-set
       (valuesCopy: string) => valuesCopy, // fungsi transform: return value apa adanya
       [], // dependency array kosong untuk callback
       storeId // storeId untuk hook
     ), // tutup useSetCellCallback
   ]; // tutup array return
 }; // tutup hook useValuesCopy

// hook buat dapetin callback untuk hapus shopping list berdasarkan id
 export const useDelShoppingListCallback = (id: string) =>
   useDelRowCallback("lists", id, useStoreId()); // panggil hook TinyBase buat hapus row di tabel "lists" dengan storeId unik

// hook buat ambil semua ID baris dari tabel "lists"
 export const useShoppingListIds = () => useRowIds("lists", useStoreId()); // kembalikan array semua row id

// hook buat ambil semua valuesCopy dari tabel "lists" sebagai array object
 export const useShoppingListsValues = () => {
   const storeId = useStoreId(); // ambil storeId unik per user

   return Object.values(useTable("lists", storeId)) // ambil semua baris tabel "lists" sebagai array
     .map(({ valuesCopy }) => { // iterasi tiap row, ambil valuesCopy
       try {
         return JSON.parse(valuesCopy); // parse string JSON menjadi object
       } catch { // kalau gagal parse
         return {}; // kembalikan object kosong
       } // tutup catch
     }); // tutup map
 }; // tutup hook useShoppingListsValues

// ---------- MAIN PROVIDER ----------

// komponen utama ShoppingListsStore yang menyiapkan store TinyBase dan provider
 export default function ShoppingListsStore() {
   const storeId = useStoreId(); // ambil storeId unik per user

   // Store harus stabil per user supaya tidak recreate setiap render
   const store = useMemo(() => { // pakai useMemo supaya store hanya dibuat sekali per storeId
     const s = createMergeableStore(); // buat store baru TinyBase
     s.setTablesSchema(TABLES_SCHEMA); // set schema tabel untuk store
     return s; // kembalikan store
   }, [storeId]); // dependency: storeId, kalau storeId berubah, store baru dibuat

   // Start persistence + sync
   useCreateClientPersisterAndStart(storeId, store); // start persister client untuk simpan data lokal
   useCreateServerSynchronizerAndStart(storeId, store); // start synchronizer server untuk sinkronisasi data

   // Provide the store ke React context supaya hook bisa akses
   useProvideStore(storeId, store); // provide store dengan storeId ke React context

   const lists = useTable("lists", storeId); // ambil seluruh tabel "lists" dari store

   return ( // return JSX
     <> {/* Fragment React untuk menampung list */}
       {Object.entries(lists).map(([listId]) => ( // iterasi semua row di lists
         <ShoppingListStore
           key={listId} // key wajib untuk list rendering
           listId={listId} // props listId
           useValuesCopy={useValuesCopy} // props: hook buat ambil valuesCopy
         />
       ))} // tutup map
     </> // tutup Fragment
   ); // tutup return
 }; // tutup fungsi ShoppingListsStore
