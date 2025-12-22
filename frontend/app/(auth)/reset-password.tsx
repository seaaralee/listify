// import react biar bisa bikin komponen
import * as React from "react";
// buat navigasi halaman
import { useRouter } from "expo-router";
// teks yang otomatis ganti tema (gelap/terang)
import { ThemedText } from "@/components/ThemedText";
// scroll view dengan padding dan styling konsisten
import { BodyScrollView } from "@/components/ui/BodyScrollView";
// tombol kustom
import Button from "@/components/ui/button";
// input teks kustom
import TextInput from "@/components/ui/text-input";
// buat login dan cek error dari clerk
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
// tipe error dari clerk buat keamanan typescript
import { ClerkAPIError } from "@clerk/types";

// komponen halaman reset password
export default function ResetPassword() {
  // ambil fungsi sign in dan status clerk
  const { isLoaded, signIn, setActive } = useSignIn();
  // buat navigasi ke halaman lain
  const router = useRouter();

  // state buat email yang mau direset
  const [emailAddress, setEmailAddress] = React.useState("");
  // state buat password baru
  const [password, setPassword] = React.useState("");
  // flag buat nandain kalo lagi nunggu kode verifikasi
  const [pendingVerification, setPendingVerification] = React.useState(false);
  // state buat kode verifikasi dari email
  const [code, setCode] = React.useState("");
  // state buat nyimpen error dari clerk
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  // kirim email reset pas user klik "continue"
  const onResetPasswordPress = React.useCallback(async () => {
    // tunggu clerk siap
    if (!isLoaded) return;
    // bersihin error sebelumnya
    setErrors([]);

    // coba kirim email reset password
    try {
      // kirim request reset password ke clerk
      await signIn.create({
        // pakai strategi lewat email
        strategy: "reset_password_email_code",
        // email yang mau direset
        identifier: emailAddress,
      // penutup create
      });

      // ganti ke tampilan verifikasi
      setPendingVerification(true);
    // tangkap error kalo ada
    } catch (err) {
      // tangkap error dari clerk
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      // log error buat debugging
      console.error(JSON.stringify(err, null, 2));
    // penutup try-catch
    }
    // dependensi: jalan ulang kalau ini berubah
  }, [isLoaded, emailAddress, signIn]);

  // verifikasi kode + ganti password
  const onVerifyPress = React.useCallback(async () => {
    // tunggu clerk siap
    if (!isLoaded) return;

    // bersihin error sebelumnya
    try {
      // kirim kode verifikasi + password baru
      const signInAttempt = await signIn.attemptFirstFactor({
        // strategi reset password
        strategy: "reset_password_email_code",
        // kode dari email
        code,
        // password baru
        password,
      // penutup attemptFirstFactor
      });

      // kalau sukses
      if (signInAttempt.status === "complete") {
        // aktifin session baru
        await setActive({ session: signInAttempt.createdSessionId });
        // alihkan ke halaman utama
        router.replace("/(index)");
      } else {
        // log kalau status belum complete
        console.error(JSON.stringify(signInAttempt, null, 2));
      // penutup if
      }
    // tangkap error kalo ada
    } catch (err) {
      // tangkap error clerk
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      // log error
      console.error(JSON.stringify(err, null, 2));
    // penutup try-catch
    }
    // dependensi: jalan ulang kalau ini berubah
  }, [isLoaded, code, password, signIn, setActive, router]);

  // tampilan verifikasi (setelah email dikirim)
  if (pendingVerification) {
    // tampilin form verifikasi kode + password baru
    return (
      // layout dengan scroll
      <BodyScrollView contentContainerStyle={{ padding: 16 }}>
        {/* input kode verifikasi */}
        <TextInput
          // isi dengan kode verifikasi
          value={code}
          // kasih tau email tujuan
          label={`Enter the verification code we sent to ${emailAddress}`}
          // placeholder untuk kode verifikasi
          placeholder="Enter your verification code"
          // terima perubahan text
          onChangeText={setCode}
        />

        {/* input password baru */}
        <TextInput
          // isi dengan password baru
          value={password}
          // label untuk input password
          label="Enter your new password"
          // placeholder untuk password baru
          placeholder="Enter your new password"
          // sembunyiin karakter
          secureTextEntry
          // terima perubahan text
          onChangeText={setPassword}
        />

        {/* tampilin error kalo ada */}
        {errors.map((error) => (
          // teks error warna merah
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {/* error message */}
            {error.longMessage}
          </ThemedText> // penutup ThemedText

        // penutup map
        ))}
        {/* tombol reset password */}
        <Button
          // pas user klik reset password
          onPress={onVerifyPress}
          // nonaktif kalo belum isi kode/password
          disabled={!code || !password}
        >
          Reset password
        </Button>
      </BodyScrollView>
    // penutup return
    );
  // penutup if pendingVerification
  }

  // tampilan awal: minta email
  return (
    // layout dengan scroll
    <BodyScrollView contentContainerStyle={{ padding: 16 , paddingTop: 48 }}>
      {/* input email */}
      <TextInput
        // matiin auto kapital (email biasanya lowercase)
        autoCapitalize="none"
        // isi dengan email       
        value={emailAddress}
        // label untuk input email
        placeholder="Enter email"
        // keyboard khusus email
        keyboardType="email-address"
        // terima perubahan text
        onChangeText={setEmailAddress}
      />

      {/* tombol lanjut */}
      <Button
        // pas user klik lanjut
        onPress={onResetPasswordPress}
        // nonaktif kalo email kosong
        disabled={!emailAddress}
      >
        Continue
      </Button>
      {/* tampilin error kalo ada */}
      {errors.map((error) => (
        // teks error warna merah
        <ThemedText key={error.longMessage} style={{ color: "red" }}>
          {/* error message */}
          {error.longMessage}
        </ThemedText>
      // penutup map
      ))}
    {/* penutup BodyScrollView */}
    </BodyScrollView>
  // penutup return
  );
// penutup komponen ResetPassword
}