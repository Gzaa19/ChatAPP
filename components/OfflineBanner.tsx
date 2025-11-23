import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OfflineBannerProps {
  isOnline: boolean;
}

export default function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) return null;

  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineIcon}>⚠️</Text>
      <Text style={styles.offlineText}>Connecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "#FFF3CD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFE69C",
  },
  offlineIcon: {
    fontSize: 14,
  },
  offlineText: {
    color: "#856404",
    fontSize: 13,
    fontWeight: "600",
  },
});
