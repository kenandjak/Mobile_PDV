import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  color?: string;
}

export const PrimaryButton = ({ title, onPress, color = "#2E7D32" }: Props) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 18,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  text: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
