// import forwardRef dari React untuk meneruskan ref ke komponen anak
import { forwardRef } from "react"; 

// import ScrollView dan tipe props-nya dari React Native
import { ScrollView, ScrollViewProps } from "react-native"; 

// buat komponen BodyScrollView yang meneruskan ref ke ScrollView
// forwardRef menerima dua tipe: tipe ref (any) dan tipe props (ScrollViewProps)
export const BodyScrollView = forwardRef<any, ScrollViewProps>( 
  // arrow function yang menerima props dan ref
  (props, ref) => { 
    return ( // mulai return JSX
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets // otomatis sesuaikan inset scroll indicator
        contentInsetAdjustmentBehavior="automatic" // sesuaikan content inset secara otomatis (iOS)
        contentInset={{ bottom: 0 }} // atur inset bawah konten = 0
        scrollIndicatorInsets={{ bottom: 0 }} // atur inset indikator scroll = 0
        {...props} // spread props yang dikirim ke komponen ini
        ref={ref} // teruskan ref ke ScrollView
      /> // penutup ScrollView
    ); // penutup return
  } // penutup arrow function
); // penutup forwardRef dan deklarasi BodyScrollView
