import { useEffect } from "react";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { appleGreen } from "@/constants/Colors";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";

// 🎀 Tema warna Listify
const PINK = "#C73572";
const PINK_BORDER = "#F1A1C4";

// Safe import Updates
let Updates: any = {};
if (Platform.OS !== "web") {
  try {
    Updates = require("expo-updates");
  } catch (error) {
    console.warn("expo-updates not available:", error);
    Updates = {};
  }
}

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const { isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates?.() || { isUpdateAvailable: false, isUpdatePending: false };

  useEffect(() => {
    if (!Device.isDevice || Platform.OS === "web" || !Updates.checkForUpdateAsync) return;
    Updates.checkForUpdateAsync();
  }, []);

  useEffect(() => {
    if (isUpdatePending && Updates.reloadAsync) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleUpdate = async () => {
    try {
      if (Updates.fetchUpdateAsync) {
        await Updates.fetchUpdateAsync();
      } else {
        Alert.alert("Not supported on web");
      }
    } catch (error) {
      Alert.alert("Update Failed", "Failed to download the update. Please try again.");
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)");
  };

  const handleDeleteAccount = async () => {
    try {
      Alert.alert(
        "Delete account",
        "Are you sure you want to delete your account? This action is irreversible.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await user?.delete();
              router.replace("/(auth)");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete account");
      console.error(error);
    }
  };

  return (
    <BodyScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" animated />

      <View>
        {/* HEADER */}
        <View style={styles.header}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
          ) : null}

          <View style={styles.userInfo}>
            <ThemedText type="defaultSemiBold" style={[styles.email, { color: PINK }]}>
              {user?.emailAddresses[0].emailAddress}
            </ThemedText>

            <ThemedText style={[styles.joinDate, { color: PINK }]}>
              Joined {user?.createdAt?.toDateString()}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* APP INFO */}
      <View style={[styles.section, { backgroundColor: "#FFDBE7", borderColor: "#FFDBE7" }]}>
        <ThemedText type="defaultSemiBold" style={[styles.appTitle, { color: PINK }]}>
          LISTIFY: Sync & Share
        </ThemedText>

        <ThemedText type="default" style={[styles.version, { color: PINK }]}>
          v{Application.nativeApplicationVersion}
        </ThemedText>
      </View>

      {/* UPDATE INFO */}
      <View style={[styles.section, { backgroundColor: "#FFDBE7", borderColor: "#FFDBE7" }]}>
        <View style={styles.infoRow}>
          <ThemedText type="defaultSemiBold" style={{ color: PINK }}>Channel</ThemedText>
          <ThemedText type="defaultSemiBold" style={{ color: PINK }}>
            {Updates.channel || "—"}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="defaultSemiBold" style={{ color: PINK }}>Last update</ThemedText>
          <ThemedText type="default" style={{ color: PINK }}>
            {Updates.createdAt ? new Date(Updates.createdAt).toDateString() : "—"}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <ThemedText type="defaultSemiBold" style={{ color: PINK }}>Update ID</ThemedText>
              <ThemedText type="default" style={{ fontSize: 12, color: PINK }}>
                {Updates.isEmbeddedLaunch ? " (Embedded)" : Updates.updateId ? " (Downloaded)" : ""}
              </ThemedText>
            </View>

            <ThemedText
              type="default"
              style={{ fontSize: 12, color: PINK }}
              numberOfLines={2}
            >
              {Updates.updateId || "—"}
            </ThemedText>
          </View>
        </View>

        {/* TOMBOL UPDATE—MUNCUL HANYA KALAU ADA UPDATE */}
        {isUpdateAvailable && (
          <View>
            <ThemedText type="defaultSemiBold" style={[styles.updateText, { color: PINK }]}>
              A new update is available!
            </ThemedText>
            <Button variant="ghost" onPress={handleUpdate}>
              Download and install update
            </Button>
          </View>
        )}
      </View>

      {/* SIGN OUT */}
      <Pressable
        onPress={handleSignOut}
        style={{
          width: "100%",
          paddingVertical: 14,
          backgroundColor: PINK,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ color: "white", fontSize: 16 }}>
          Sign out
        </ThemedText>
      </Pressable>

      {/* DELETE ACCOUNT */}
      <Pressable
        onPress={handleDeleteAccount}
        style={{
          width: "100%",
          paddingVertical: 14,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: PINK_BORDER,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ color: PINK, fontSize: 16 }}>
          Delete account
        </ThemedText>
      </Pressable>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    gap: 24,
    backgroundColor: "#FFF0F5",
    flex: 1,
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  email: {
    fontSize: 18,
    marginBottom: 4,
  },
  joinDate: {
    opacity: 0.7,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  appTitle: {
    textAlign: "center",
  },
  version: {
    textAlign: "center",
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  updateText: {
    paddingBottom: 4,
  },
});
