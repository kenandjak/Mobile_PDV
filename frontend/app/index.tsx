import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../hooks/useCart";
import { apiService } from "../services/api";
import { styles } from "../styles/styles";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [lanterna, setLanterna] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [quantidade, setQuantidade] = useState("1");
  const { itens, total, adicionarItem, removerItem, limparCarrinho } =
    useCart();

  if (!permission)
    return (
      <View style={styles.container}>
        <Text>Carregando câmera...</Text>
      </View>
    );
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de permissão para a câmera.
        </Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const response = await apiService.buscarProduto(data);
      const qtd = parseInt(quantidade) || 1;

      adicionarItem(response.data, qtd);

      setQuantidade("1");
    } catch (error: any) {
      const msg =
        error.response?.data?.detail ||
        "Produto não encontrado ou erro na rede.";
      Alert.alert("Erro", msg);
    } finally {
      setTimeout(() => {
        setScanned(false);
      }, 2500);
    }
  };

  const confirmarCancelamento = () => {
    Alert.alert("Cancelar Venda", "Tem certeza que deseja cancelar a venda?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", style: "destructive", onPress: limparCarrinho },
    ]);
  };

  const finalizarVenda = async () => {
    if (itens.length === 0)
      return Alert.alert("Aviso", "O carrinho está vazio.");

    try {
      await apiService.finalizarVenda(itens);

      Alert.alert("Sucesso", "Venda finalizada!");
      limparCarrinho();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao finalizar venda.";
      Alert.alert("Erro", msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 1. Área da Câmera */}
      <View style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
            enableTorch={lanterna}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 60,
            right: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 15,
            borderRadius: 30,
            zIndex: 10,
          }}
          onPress={() => setLanterna(!lanterna)}
        >
          <Ionicons
            name={lanterna ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <View style={styles.targetBox} />
        {scanned && (
          <View style={styles.flashOverlay}>
            <Text style={styles.flashText}>OK!</Text>
          </View>
        )}
      </View>

      {/* 2. Painel de Controle e Lista */}
      <View style={styles.painelVenda}>
        <View style={styles.headerCarrinho}>
          <Text style={styles.titulo}>🛒 Compras</Text>

          {itens.length > 0 && (
            <TouchableOpacity onPress={confirmarCancelamento}>
              <Text style={styles.btnCancelar}>Limpar tudo</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Qtd:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <Text style={styles.totalHeader}>Total: R$ {total.toFixed(2)}</Text>
        </View>

        <FlatList
          data={itens}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemCarrinho}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemNome}>
                  {item.quantidade_comprada}x {item.nome}
                </Text>
                <Text style={styles.itemPreco}>
                  R$ {item.subtotal.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.btnRemoverItem}
                onPress={() => removerItem(index)}
              >
                <Text style={styles.btnRemoverTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.lista}
        />

        <TouchableOpacity style={styles.btnFinalizar} onPress={finalizarVenda}>
          <Text style={styles.btnTexto}>FINALIZAR VENDA</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
