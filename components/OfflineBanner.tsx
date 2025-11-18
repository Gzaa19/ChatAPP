import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OfflineBannerProps {
  isOnline: boolean;
}

export default function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>Connecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#FFC107",
    padding: 6,
    alignItems: "center",
  },
  offlineText: {
    color: "#111B21",
    fontSize: 13,
    fontWeight: "500",
  },
});
