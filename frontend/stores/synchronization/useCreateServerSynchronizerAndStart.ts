import ReconnectingWebSocket from "reconnecting-websocket"; // ngimpor kelas websocket yang otomatis reconnect kalo terputus
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas"; // ngimpor fungsi buat bikin synchronizer WS dari tinybase
import * as UiReact from "tinybase/ui-react/with-schemas"; // ngimpor seluruh export dari ui-react tinybase (paket with-schemas)
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas"; // ngimpor tipe-tipe TS dari tinybase

// Hapus '/main' dari URL dasar. Store ID akan ditambahkan di bawah. // penjelasan singkat perubahan
const SYNC_SERVER_URL = "wss://server.fatiknurimamah17.workers.dev"; // url dasar websocket, nanti ditambah /{storeId} di runtime

export const useCreateServerSynchronizerAndStart = < // mulai export hook/fungsi yang bisa dipakai di banyak tempat
  Schemas extends OptionalSchemas // generic type parameter: Schemas harus sesuai OptionalSchemas dari tinybase
>( // penutup generic buka parameter fungsi
  storeId: string, // argumen pertama: id store (akan dipakai di path websocket)
  store: MergeableStore<Schemas> // argumen kedua: instance store tinybase dengan tipe schemas yang sama
) => { // buka badan fungsi
  const uiReact = UiReact as UiReact.WithSchemas<Schemas>; // cast modul uiReact supaya TS tahu ini versi with-schemas

  return uiReact.useCreateSynchronizer( // pake hook bawaan tinybase ui-react untuk bikin dan manage synchronizer
    store, // pass store ke hook
    async (store: MergeableStore<Schemas>) => { // callback async yang dijalankan untuk buat synchronizer
      // URL sekarang akan menjadi wss://.../storeId // catatan: URL final termasuk storeId
      const url = `${SYNC_SERVER_URL}/${storeId}`; // gabungin base url sama storeId jadi endpoint ws spesifik store

      console.log("🔗 Connecting to TinyBase WS:", url); // log buat debug, kasih tau url yang dicoba konek

      const ws = new ReconnectingWebSocket(url, [], { // bikin instance ReconnectingWebSocket ke url tadi
        maxReconnectionDelay: 1000, // konfigurasi: delay maks reconnect 1 detik
        connectionTimeout: 1000, // konfigurasi: timeout koneksi 1 detik
      }); // tutup objek opsi dan pemanggilan constructor

      const synchronizer = await createWsSynchronizer(store, ws); // buat synchronizer tinybase pake store dan websocket, tunggu hasilnya

      await synchronizer.startSync(); // mulai sinkronisasi awal (mulai proses sync internal)

      ws.addEventListener("open", () => { // pas websocket terbuka, jalankan callback ini
        console.log("✅ WS connected, syncing..."); // log ngecek konek sukses
        synchronizer.load().then(() => synchronizer.save()); // setelah load data dari server, langsung save (sinkron dua arah)
      }); // tutup addEventListener untuk event "open"

      return synchronizer; // balikkan synchronizer ke hook caller
    }, // tutup callback async buat create synchronizer
    [storeId] // dependency array: kalau storeId berubah, hook akan recreate synchronizer
  ); // tutup pemanggilan useCreateSynchronizer
}; // tutup export fungsi useCreateServerSynchronizerAndStart