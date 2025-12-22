// import react untuk komponen dan hook
import React from "react";

// hook untuk cek status jaringan (online/offline)
import { useNetworkState } from "expo-network";

// komponen navigasi dari expo-router
import { Redirect, router, Stack } from "expo-router";

// alert bawaan react native
import { Alert } from "react-native";

// provider tinybase untuk state management
import { Provider as TinyBaseProvider } from "tinybase/ui-react";

// inspector tinybase (biasanya untuk debug)
import { Inspector } from "tinybase/ui-react-inspector";

// komponen button custom
import { Button } from "@/components/ui/button";

// context untuk proses pembuatan list
import { ListCreationProvider } from "@/context/ListCreationContext";

// context untuk widget
import { WidgetProvider } from "@/contexts/WidgetContext";

// store utama daftar belanja
import ShoppingListsStore from "@/stores/ShoppingListsStore";

// komponen dan hook auth dari clerk
import { SignedIn, useUser } from "@clerk/clerk-expo";

// pengaturan awal routing expo-router
export const unstable_settings = {
  initialRouteName: "index", // route awal
};

// layout utama
export default function AppIndexLayout() {
  const { user } = useUser(); // data user login
  const networkState = useNetworkState(); // status jaringan

  React.useEffect(() => {
    // cek kondisi offline
    if (!networkState.isConnected && networkState.isInternetReachable === false) {
      // tampilkan peringatan ke user
      Alert.alert(
        "🔌 You are offline", // judul alert
        "You can keep using the app! Your changes will be saved locally and synced when you are back online." // isi pesan
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]); // jalan ulang kalau status jaringan berubah

  // kalau belum login
  if (!user) {
    // arahkan ke halaman auth
    return <Redirect href="/(auth)" />;
  } // ← ini nutup if

// return digunakan untuk mengembalikan tampilan komponen
return (
  // SignedIn memastikan semua isi hanya bisa diakses saat user sudah login
  <SignedIn>

    // provider untuk tinybase (state management / database lokal)
    <TinyBaseProvider>

      // provider untuk widget global aplikasi
      <WidgetProvider>

        // inisialisasi store shopping list (zustand / tinybase)
        <ShoppingListsStore />

        // provider untuk state pembuatan list baru
        <ListCreationProvider>

          {/* stack navigator utama aplikasi */}
          <Stack
            // pengaturan default untuk semua screen di stack
            screenOptions={{
              // spread operator (...)
              // jika bukan ios → pakai object kosong
              ...(process.env.EXPO_OS !== "ios"
                ? {}
                : {
                    // gunakan large title khas ios
                    headerLargeTitle: true,

                    // header tidak transparan
                    headerTransparent: false,

                    // efek blur khas ios
                    headerBlurEffect: "systemChromeMaterial",

                    // hilangkan shadow judul besar
                    headerLargeTitleShadowVisible: false,

                    // tampilkan shadow header kecil
                    headerShadowVisible: true,

                    // style untuk header large
                    headerLargeStyle: {
                      // background transparan agar menyatu dengan background
                      backgroundColor: "transparent",
                    },
                  }),
            }}
          >

            {/* screen untuk membuat list baru */}
            <Stack.Screen
              name="list/new/index" // path file screen
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerShown: false, // header disembunyikan
              }}
            />

            {/* screen edit list */}
            <Stack.Screen
              name="list/[listId]/edit" // route dinamis listId
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerLargeTitle: false, // nonaktifkan large title
                headerTitle: "Edit list", // judul header
              }}
            />

            {/* screen detail list */}
            <Stack.Screen
              name="list/[listId]/index" // halaman utama list
              options={{
                headerShown: false, // header dimatikan (custom header)
              }}
            />

            {/* screen tambah produk */}
            <Stack.Screen
              name="list/[listId]/product/new" // tambah produk baru
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Add product", // judul header
              }}
            />

            {/* screen scan qr */}
            <Stack.Screen
              name="list/new/scan" // halaman scan qr
              options={{
                presentation: "fullScreenModal", // modal layar penuh
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Scan QR code", // judul header

                // tombol kiri header
                headerLeft: () => (
                  // tombol cancel
                  <Button
                    variant="ghost" // style tombol transparan
                    onPress={() => router.back()} // kembali ke halaman sebelumnya
                  >
                    Cancel
                  </Button>
                ),
              }}
            />

            {/* screen detail produk */}
            <Stack.Screen
              name="list/[listId]/product/[productId]" // route dinamis produk
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Details", // judul header
              }}
            />

            {/* screen share list */}
            <Stack.Screen
              name="list/[listId]/share" // halaman share list
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Invite", // judul header
              }}
            />

            {/* screen profile user */}
            <Stack.Screen
              name="profile" // halaman profile
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                sheetGrabberVisible: true, // handle sheet terlihat
                headerShown: false, // header disembunyikan
              }}
            />

            {/* screen pilih emoji */}
            <Stack.Screen
              name="emoji-picker" // halaman emoji picker
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Choose an emoji", // judul header
                sheetGrabberVisible: true, // handle sheet terlihat
              }}
            />

            {/* screen pilih warna */}
            <Stack.Screen
              name="color-picker" // halaman color picker
              options={{
                presentation: "formSheet", // tampil sebagai sheet
                headerLargeTitle: false, // tanpa large title
                headerTitle: "Choose a color", // judul header

                // ukuran sheet yang diizinkan
                sheetAllowedDetents: [0.5, 0.75, 1],

                // handle sheet terlihat
                sheetGrabberVisible: true,
              }}
            />

          </Stack>
          {/* penutup stack navigator */}

        </ListCreationProvider>
        {/* penutup provider pembuatan list */}

        {/* hanya tampilkan inspector jika platform web */}
        {process.env.EXPO_OS === "web" ? <Inspector /> : null}

      </WidgetProvider>
      {/* penutup widget provider */}

    </TinyBaseProvider>
    {/* penutup tinybase provider */}

  </SignedIn>
  // penutup SignedIn
);
// penutup return

}
// penutup fungsi komponen
