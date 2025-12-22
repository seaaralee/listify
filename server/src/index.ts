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
    // constructor dipanggil saat Durable Object dibuat dan parameter env digunakan untuk mengakses konfigurasi environment Worker

    super(ctx, env);
    // wajib manggil constructor parent (WsServerDurableObject)

    this.store = createMergeableStore();
    // inisialisasi TinyBase store yang menyimpan data aplikasi

    this.persister = createDurableObjectStoragePersister(
    // bikin persister supaya store disimpan ke storage DO
      this.store,
    // TinyBase store yang mau disimpan
      this.ctx.storage
    // storage Durable Object buat nyimpen data
    );

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
    // fetch handler Durable Object yang menangani request masuk dari Worker

    if (super.fetch) {
      return await super.fetch(request);
    }
    // Mengecek apakah class induk (WsServerDurableObject) punya fetch handler 
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
    // pecah path URL jadi array tanpa string kosong yang memecah path URL menjadi beberapa bagian agar dapat digunakan sebagai penentu tujuan request.

    const storeId = path[path.length - 1] ?? "main";
    // ambil segment terakhir sebagai storeId, default "main" untuk menentukan identitas store berdasarkan URL yang diakses

    const id = env.GroceriesDurableObjects.idFromName(storeId);
    // bikin Durable Object ID berdasarkan storeId

    const obj = env.GroceriesDurableObjects.get(id);
    // ambil instance Durable Object dari Cloudflare

    return obj.fetch(request);
    // semua request (termasuk WebSocket) diteruskan ke Durable Object
  },
};
