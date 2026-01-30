import { CameraView } from "expo-camera";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashButton } from "./FlashButton";

interface Props {
  isVisible: boolean;
  isFocused: boolean;
  torch: boolean;
  setTorch: (val: boolean) => void;
  onScan: (event: { data: string }) => void;
  onClose: () => void;
}

export const CameraScanner = ({
  isVisible,
  isFocused,
  torch,
  setTorch,
  onScan,
  onClose,
}: Props) => {
  if (!isVisible || !isFocused) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <CameraView
        onBarcodeScanned={onScan}
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
        style={StyleSheet.absoluteFillObject}
      />

      <FlashButton isActive={torch} onPress={() => setTorch(!torch)} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
          <Text style={styles.btnText}>CANCELAR SCAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: { flex: 1, justifyContent: "flex-end" },
  btnCancel: {
    backgroundColor: "red",
    padding: 18,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 130, // Mantendo a elevação da sua TabBar
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
