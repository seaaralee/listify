import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas"; // ngambil fungsi buat nyimpen store di browser (localStorage)
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas"; // ngambil tipe typescript dari tinybase: MergeableStore & OptionalSchemas

// On a web client, use the browser's local storage to persist the store. // catatan: ini jelasin maksud file, kalau di web pake localStorage
export const createClientPersister = <Schemas extends OptionalSchemas>( // mulai nge-declare fungsi yang diexport: generic <Schemas> biar sesuai schema tinybase
  storeId: string, // parameter pertama: id buat ngebedain data di localStorage (dipakai sebagai key)
  store: MergeableStore<Schemas> // parameter kedua: instance store tinybase yang mau disimpen
) => createLocalPersister(store, storeId); // fungsi ini langsung nge-return persister lokal yang dibikin pake createLocalPersister(store, storeId); selesai