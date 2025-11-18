import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface LogoContainerProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export default function LogoContainer({ emoji, title, subtitle }: LogoContainerProps) {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logo}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#075E54",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#667781",
    textAlign: "center",
  },
});
