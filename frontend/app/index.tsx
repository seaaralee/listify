// import hook useRouter dari expo-router untuk navigasi antar halaman
import { useRouter } from "expo-router"; 

// import useEffect dari React untuk menjalankan efek samping setelah render
import { useEffect } from "react"; 

// komponen halaman root aplikasi (Index)
// fungsinya langsung redirect ke halaman auth
export default function Index() { 
  // bikin instance router supaya bisa navigasi secara programmatic
  const router = useRouter(); 

  // efek samping yang dijalankan setelah komponen mount
  useEffect(() => {
    // replace halaman saat ini dengan /auth tanpa menambah riwayat navigasi
    // sehingga user tidak bisa back ke halaman ini
    router.replace("/(auth)");
  }, [router]); // dependency array: efek dijalankan sekali saat mount

  // tidak render UI apa pun karena halaman ini hanya untuk redirect
  return null; 
} // penutup komponen Index
