/**
 * fungsi ini digunakan untuk mengubah tanggal menjadi
 * format yang mudah dibaca oleh pengguna,
 * contoh: "Aug 29, 2025 · 10:05 AM"
 */
export function formatFriendlyDate(date: Date | string | number): string { // fungsi untuk memformat tanggal

  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date; // ubah input ke objek date jika perlu

  if (isNaN(dateObj.getTime())) { // cek apakah tanggal valid
    return 'Invalid date'; // hentikan proses jika tanggal tidak valid
  }

  const months = [ // array nama bulan singkat
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const month = months[dateObj.getMonth()]; // ambil nama bulan dari indeks

  const day = dateObj.getDate(); // ambil tanggal

  const year = dateObj.getFullYear(); // ambil tahun

  let hours = dateObj.getHours(); // ambil jam dalam format 24 jam

  const minutes = dateObj.getMinutes(); // ambil menit

  const ampm = hours >= 12 ? 'PM' : 'AM'; // tentukan am atau pm

  hours = hours % 12; // ubah jam 24 ke 12

  hours = hours ? hours : 12; // jika jam 0 tampilkan sebagai 12

  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString(); // format menit jadi dua digit

  return `${month} ${day}, ${year} · ${hours}:${minutesStr} ${ampm}`; // hasil akhir yang ditampilkan
}
