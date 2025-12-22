import * as SQLite from "expo-sqlite"; // ngambil modul expo-sqlite biar bisa buka database sqlite di device
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite/with-schemas"; // ngambil fungsi pembuat persister yang pake Expo SQLite dari tinybase
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas"; // ngambil tipe TypeScript: MergeableStore & OptionalSchemas

// On a mobile client, use Expo's SQLite API to persist the store. // catatan singkat: di mobile pake sqlite
export const createClientPersister = <Schemas extends OptionalSchemas>( // mulai nge-declare fungsi yang diexport: generic Schemas biar cocok sama tinybase
  storeId: string, // param pertama: id store, dipakai buat nama file db
  store: MergeableStore<Schemas> // param kedua: instance store tinybase yang mau dipersist
) => createExpoSqlitePersister(store, SQLite.openDatabaseSync(storeId + ".db")); // buka/ambil database file pake storeId + ".db" lalu langsung buat persister pake fungsi tinybase dan balikin persister