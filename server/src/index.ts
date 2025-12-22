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
    // fetch handler Durable Object

    if (super.fetch) {
      return await super.fetch(request);
    }
    // Fallback if parent does not provide a fetch handler
    return new Response("Not Implemented", { status: 501 });
    // semua request langsung ditangani WebSocket synchronizer TinyBase
  }
}


export default {
  async fetch(request: Request, env: any) {
    // fetch handler utama Worker (entry point)

    const url = new URL(request.url);
    // parsing URL request

    const path = url.pathname.split("/").filter(Boolean);
    // pecah path URL jadi array tanpa string kosong

    const storeId = path[path.length - 1] ?? "main";
    // ambil segment terakhir sebagai storeId, default "main"

    const id = env.GroceriesDurableObjects.idFromName(storeId);
    // bikin Durable Object ID berdasarkan storeId

    const obj = env.GroceriesDurableObjects.get(id);
    // ambil instance Durable Object dari namespace

    return obj.fetch(request);
    // semua request (termasuk WebSocket) diteruskan ke Durable Object
  },
};
