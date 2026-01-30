import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api";
import { styles } from "../styles/styles_cadastro";

export default function CadastroScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const isFocused = useIsFocused();
  const [lanterna, setLanterna] = useState(false);
  const [exibirForm, setExibirForm] = useState(false);

  const [form, setForm] = useState({
    codigo_barras: "",
    nome: "",
    preco: "",
    estoque: "",
  });

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Acesso à câmera negado.
        </Text>
        <TouchableOpacity style={styles.btnScan} onPress={requestPermission}>
          <Text style={{ color: "#fff" }}>Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = ({ data }: { data: string }) => {
    setForm({ ...form, codigo_barras: data });
    setExibirForm(true);
    setMostrarCamera(false);
    Alert.alert("Sucesso", "Código de barras registrado!");
  };

  const limparCodigo = () => {
    setForm({ codigo_barras: "", nome: "", preco: "", estoque: "" });
    setExibirForm(false);
  };

  const salvarProduto = async () => {
    if (!form.codigo_barras || !form.nome || !form.preco) {
      return Alert.alert("Aviso", "Preencha os campos obrigatórios.");
    }

    try {
      const dadosParaEnviar = {
        ...form,
        preco: parseFloat(form.preco.replace(",", ".")),
        estoque: parseInt(form.estoque) || 0,
      };

      await apiService.cadastrarProduto(dadosParaEnviar);

      Alert.alert("Sucesso", "Produto cadastrado!");
      setForm({ codigo_barras: "", nome: "", preco: "", estoque: "" });
    } catch (err: any) {
      const erroMsg = err.response?.data?.detail || "Erro de conexão.";
      Alert.alert("Falha no Cadastro", erroMsg);
    }
  };

  if (mostrarCamera) {
    return (
      <View style={styles.cameraContainer}>
        {isFocused && (
          <CameraView
            onBarcodeScanned={handleScan}
            enableTorch={lanterna}
            barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
            style={{ flex: 1 }}
          />
        )}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 60,
            right: 30,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 15,
            borderRadius: 50,
          }}
          onPress={() => setLanterna(!lanterna)}
        >
          <Ionicons
            name={lanterna ? "flash" : "flash-off"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btnCancelarScan,
            { backgroundColor: "red", margin: 20 },
          ]}
          onPress={() => setMostrarCamera(false)}
        >
          <Text style={styles.btnTexto}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.titulo}>Novo Produto</Text>

        <Text style={styles.label}>Código de Barras:</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={form.codigo_barras}
            editable={true}
            onChangeText={(t) => {
              setForm({ ...form, codigo_barras: t });
              if (t.length > 0) setExibirForm(true);
              else setExibirForm(false);
            }}
            placeholder="Digite ou use o SCAN: "
            keyboardType="numeric"
          />
          {form.codigo_barras.length > 0 && (
            <TouchableOpacity onPress={limparCodigo} style={styles.btnClear}>
              <Ionicons name="close-circle" size={30} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnScan}
            onPress={() => setMostrarCamera(true)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>SCAN</Text>
          </TouchableOpacity>
        </View>

        {exibirForm && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Nome do Produto:</Text>
            <TextInput
              style={styles.input}
              value={form.nome}
              onChangeText={(t) => setForm({ ...form, nome: t })}
              placeholder="Ex: Biscoito Recheado 150g"
            />

            <Text style={styles.label}>Preço de Venda (R$):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.preco}
              onChangeText={(t) => setForm({ ...form, preco: t })}
              placeholder="0.00"
            />

            <Text style={styles.label}>Estoque Inicial:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={form.estoque}
              onChangeText={(t) => setForm({ ...form, estoque: t })}
              placeholder="Ex: 50"
            />

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarProduto}>
              <Text style={styles.btnTexto}>CADASTRAR PRODUTO</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
