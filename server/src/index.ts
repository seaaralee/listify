import { createMergeableStore } from "tinybase"; 
// import untuk bikin TinyBase store yang bisa merge (dipakai buat sync)

import { createDurableObjectStoragePersister } from "tinybase/persisters/persister-durable-object-storage"; 
// import persister supaya data TinyBase disimpan ke storage Durable Object

import { WsServerDurableObject } from "tinybase/synchronizers/synchronizer-ws-server-durable-object"; 
// import class Durable Object bawaan TinyBase yang sudah support WebSocket


export class GroceriesDurableObject extends WsServerDurableObject {
  // class Durable Object utama untuk tiap store TinyBase

  private store: any;
  // variabel untuk nyimpen instance TinyBase store

  private persister: any;
  // variabel untuk nyimpen persister ke Durable Object storage

  constructor(ctx: DurableObjectState, env: any) {
    // constructor dipanggil saat Durable Object dibuat

    super(ctx, env);
    // wajib manggil constructor parent (WsServerDurableObject)

    this.store = createMergeableStore();
    // inisialisasi TinyBase store

    this.persister = createDurableObjectStoragePersister(
      this.store,
      this.ctx.storage
    );
    // bikin persister supaya store disimpan ke storage DO

    this.init();
    // panggil fungsi init buat load data & autosave
  }

  private async init() {
    // fungsi async untuk inisialisasi data

    await this.persister.load();
    // load data dari Durable Object storage ke store

    this.persister.startAutoSave();
    // nyalain autosave biar tiap perubahan langsung kesimpan
  }

  createPersister() {
    // method ini dipakai TinyBase synchronizer

    return this.persister;
    // balikin persister yang tadi dibuat
  }

  async fetch(request: Request): Promise<Response> {
    // fetch handler khusus untuk Durable Object ini

    const url = new URL(request.url);
    // parsing URL dari request

    if (url.pathname.endsWith("/index-data")) {
      // endpoint khusus buat ambil data mentah (JSON)

      await this.persister.load();
      // pastiin data terbaru sudah ke-load

      return new Response(
        JSON.stringify({
          tables: this.store.getTables(),
          // ambil semua tabel TinyBase

          values: this.store.getValues(),
          // ambil values global TinyBase
        }),
        { headers: { "content-type": "application/json" } }
        // set response sebagai JSON
      );
    }

    const response = await super.fetch?.(request);
    return (
      response ??
      new Response("Not Found", { status: 404 })
    );
    // kalau bukan endpoint khusus, lempar ke handler WS bawaan
  }
}


export default {
  async fetch(request: Request, env: any) {
    // fetch handler utama Worker (entry point)

    const url = new URL(request.url);
    // parsing URL request

    const upgrade = request.headers.get("Upgrade");
    // ambil header Upgrade buat cek WebSocket

    const path = url.pathname.split("/").filter(Boolean);
    // pecah path URL jadi array tanpa string kosong

    let storeId = "main";
    // default storeId adalah "main"

    if (path.length > 0) {
      // kalau path tidak kosong

      const last = path[path.length - 1];
      // ambil segment terakhir dari URL

      storeId =
        last === "index-data"
          ? path[path.length - 2] ?? "main"
          : last;
      // kalau endpoint index-data, storeId ambil dari segment sebelumnya
    }

    console.log("🟢 Incoming request for storeId:", storeId);
    // log storeId biar kelihatan di wrangler tail

    const id = env.GroceriesDurableObjects.idFromName(storeId);
    // bikin Durable Object ID berdasarkan storeId

    const obj = env.GroceriesDurableObjects.get(id);
    // ambil instance Durable Object dari namespace

    if (upgrade?.toLowerCase() === "websocket") {
      // kalau request WebSocket

      return obj.fetch(request);
      // teruskan ke Durable Object
    }

    if (url.pathname.endsWith("/index-data")) {
      // kalau request ambil data JSON

      return obj.fetch(request);
      // teruskan ke Durable Object
    }

    return new Response("TinyBase WS server running", {
      headers: { "content-type": "text/plain" },
    });
    // response default kalau bukan WS atau index-data
  },
};
