import * as UiReact from "tinybase/ui-react/with-schemas"; // ngimpor semua export dari tinybase ui-react versi with-schemas, kita bakal pake hook dari situ
import {
  Content,
  MergeableStore,
  OptionalSchemas,
} from "tinybase/with-schemas"; // ngimpor tipe-tipe TS dari tinybase: Content, MergeableStore, OptionalSchemas
import { createClientPersister } from "./createClientPersister"; // ngimpor fungsi pembuat persister lokal dari file createClientPersister

export const useCreateClientPersisterAndStart = < // mulai nge-declare dan nge-export hook/fungsi bernama useCreateClientPersisterAndStart
  Schemas extends OptionalSchemas // generic type parameter: Schemas harus cocok sama OptionalSchemas dari tinybase
>( // tutup pembukaan generic, mulai parameter fungsi
  storeId: string, // parameter pertama: id store, dipakai buat pembeda data di persister
  store: MergeableStore<Schemas>, // parameter kedua: instance store tinybase yang mau dipersister
  initialValues?: string, // parameter opsional: string JSON berisi nilai awal kalau mau load initial
  then?: () => void // parameter opsional: callback yang mau dipanggil setelah persister siap
) => { // buka badan fungsi
  return (UiReact as UiReact.WithSchemas<Schemas>).useCreatePersister( // pake hook useCreatePersister dari tinybase (di-cast ke versi with-schemas biar TS aman)
    store, // argumen pertama ke hook: store itu sendiri
    (store: MergeableStore<Schemas>) => createClientPersister(storeId, store), // argumen kedua: factory function yang bikin persister pakai storeId & store
    [storeId], // argumen ketiga: dependency array buat factory, kalo storeId berubah maka factory di-recreate
    async (persister) => { // argumen keempat: callback async yang dijalankan setelah persister dibuat, kita pake ini buat inisialisasi & start autosave
      let initialContent: Content<Schemas> | undefined = undefined; // deklarasi variabel buat nampung content awal, default undefined

      if (initialValues) { // kalo ada initialValues dikirim
        try { // coba parse JSON-nya
          initialContent = [{}, JSON.parse(initialValues)]; // parse jadi Content: pertama object kosong untuk schema metadata, kedua isi dari JSON
        } catch (e) { // kalo parse error
          console.warn("Failed to parse initialValues:", e); // warn di console, tapi jangan crash app
        } // tutup catch
      } // tutup if initialValues

      // Start persister
      await persister.load(initialContent); // panggil load pada persister, kasih initialContent kalau ada
      await persister.startAutoSave(); // mulai auto-save otomatis dari persister

      then?.(); // kalau ada callback then, panggil sekarang (optional chaining dipakai biar aman)
    }, // tutup callback async (argumen keempat useCreatePersister)
    [initialValues] // argumen terakhir: dependency array untuk callback ini, kalo initialValues berubah callback bakal diset ulang
  ); // tutup pemanggilan useCreatePersister dan return-nya
}; // tutup deklarasi dan ekspor fungsi useCreateClientPersisterAndStart