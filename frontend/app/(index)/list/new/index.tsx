import React, { useMemo, useState } from "react";
import { Href, useGlobalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { backgroundColors, emojies } from "@/constants/Colors";
import { useJoinShoppingListCallback } from "@/stores/ShoppingListsStore";

const isValidUUID = (id: string | null) => {
  if (!id) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export default function NewListScreen() {
  const params = useGlobalSearchParams();
  const { listId: listIdParam } = params as { listId?: string };

  const router = useRouter();
  const joinShoppingListCallback = useJoinShoppingListCallback();

  const [listId, setListId] = useState<string | null>(listIdParam ?? null);

  const isValidListId = useMemo(() => isValidUUID(listId), [listId]);

  const randomEmoji = useMemo(
    () => emojies[Math.floor(Math.random() * emojies.length)],
    []
  );

  const randomBackgroundColor = useMemo(
    () => backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    []
  );

  const handleDismissTo = (screen: Href) => {
    if (router.canDismiss()) {
      router.dismiss();
      setTimeout(() => {
        router.push(screen);
      }, 120);
    } else {
      router.push(screen);
    }
  };

  const handleJoinList = () => {
    if (!listId || !isValidUUID(listId)) return;

    joinShoppingListCallback(listId);

    if (router.canDismiss()) {
      router.dismiss();
    }

    setTimeout(() => {
      router.push({
        pathname: "/list/[listId]",
        params: { listId },
      });
    }, 120);
  };

  return (
    <BodyScrollView contentContainerStyle={styles.scrollViewContent}>
      <StatusBar style="light" animated />

      <View style={styles.container}>
        {/* HERO */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/images/add-list.png")}
            style={styles.heroImage}
          />

          <ThemedText type="subtitle" style={styles.title}>
            Better Together {randomEmoji}
          </ThemedText>

          <ThemedText type="default" style={styles.subtitle}>
            Create shared shopping lists and collaborate in real-time with
            family and friends
          </ThemedText>
        </View>

        {/* ACTION */}
        <View style={styles.actionSection}>
          <Button onPress={() => handleDismissTo("/list/new/create")}>
            Create new list
          </Button>

          <View style={styles.divider}>
            <View style={styles.line} />
            <ThemedText type="default" style={styles.orText}>
              or join existing
            </ThemedText>
            <View style={styles.line} />
          </View>

          {/* JOIN */}
          <View style={styles.joinSection}>
            <TextInput
              placeholder="Enter a list code"
              value={listId ?? ""}
              onChangeText={setListId}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              onPress={handleJoinList}
              disabled={!isValidListId}
              textStyle={{ color: "#FFFFFF" }}
            >
              Join list
            </Button>

            {/* QR */}
            <Button
              variant="ghost"
              onPress={() => handleDismissTo("/list/new/scan")}
              style={styles.qrButton}
            >
              <View style={styles.qrContent}>
                <Image
                  source={require("@/assets/images/scan-qr-pink.png")}
                  style={styles.qrIcon}
                />
                <ThemedText style={styles.qrText}>
                  Scan QR code
                </ThemedText>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
    marginBottom: 100,
    backgroundColor: "#FFF0F5",
    flexGrow: 1,
  },
  container: {
    gap: 32,
    flex: 1,
  },

  /* HERO */
  heroSection: {
    alignItems: "center",
    gap: 16,
    marginTop: 32,
  },
  heroImage: {
    width: 153,
    height: 155,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    paddingHorizontal: 24,
    lineHeight: 16,
    fontSize: 12,
  },

  /* ACTION */
  actionSection: {
    gap: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
  },
  orText: {
    color: "gray",
  },

  /* JOIN */
  joinSection: {
    gap: 16,
  },

  /* QR */
  qrButton: {
    paddingVertical: 12,
  },
  qrContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 8,
  },
  qrText: {
    color: "#C73572",
    fontWeight: "600",
  },
});
