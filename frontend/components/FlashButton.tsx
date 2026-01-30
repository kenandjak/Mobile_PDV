import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  isActive: boolean;
  onPress: () => void;
  top?: number;
}

export const FlashButton = ({ isActive, onPress, top = 60 }: Props) => (
  <TouchableOpacity style={[styles.button, { top }]} onPress={onPress}>
    <Ionicons name={isActive ? "flash" : "flash-off"} size={24} color="white" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 30,
    zIndex: 10,
  },
});
