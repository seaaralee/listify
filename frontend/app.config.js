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
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],

    // Info platform
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.listify.app",
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
      "expo-router",
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

      router: {
        appRoot: "app",  // <— WAJIB UNTUK EXPO ROUTER
   },
      eas: {
        projectId: "740576f6-c39a-4467-9875-8ad9aef8f5fe",
      },
    },
  },
};
