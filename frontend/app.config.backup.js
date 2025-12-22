export default {
  expo: {
    name: "LISTIFY",
    slug: "listify",
    scheme: "myapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],

    // Info platform
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.listify.app",
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },

    // 👇 Jangan tambahkan expo-device di sini, karena bukan plugin native
    plugins: [
      "expo-camera",
      "expo-splash-screen",
      "expo-font",
      "expo-secure-store",
      "expo-updates",
    ],

    extra: {
      ENVIRONMENT: process.env.NODE_ENV || "development",
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      EXPO_PUBLIC_SYNC_SERVER_URL: process.env.EXPO_PUBLIC_SYNC_SERVER_URL,
    },
  },
};
