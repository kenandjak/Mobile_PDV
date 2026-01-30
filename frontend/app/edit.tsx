import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api";
import { styles } from "../styles/styles_edit";

export default function EditScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [mostrarCamera, setMostrarCamera] = useState(false);
  const [lanterna, setLanterna] = useState(false);
  const [carregado, setCarregado] = useState(false);
  const limparCampo = () => {
    setForm({ ...form, codigo_barras: "" });
    setCarregado(false);
  };

  const [form, setForm] = useState({
    codigo_barras: "",
    nome: "",
    preco: "",
    estoque: "",
  });

  // Função centralizada para buscar produto
  const realizarBusca = async (codigo: string) => {
    try {
      const res = await apiService.buscarProduto(codigo);
      setForm({
        codigo_barras: res.data.codigo_barras,
        nome: res.data.nome,
        preco: res.data.preco.toString(),
        estoque: res.data.estoque.toString(),
      });
      setCarregado(true);
    } catch (err: any) {
      setCarregado(false);
      const msg =
        err.response?.data?.detail || "Produto não cadastrado no sistema.";
      Alert.alert("Ops!", msg);
    }
  };

  const handleScan = ({ data }: { data: string }) => {
    setMostrarCamera(false);
    setForm({ ...form, codigo_barras: data }); // Preenche o campo visualmente
    realizarBusca(data); // Tenta buscar os dados
  };

  const buscarManual = () => {
    if (!form.codigo_barras)
      return Alert.alert("Aviso", "Digite um código primeiro.");
    realizarBusca(form.codigo_barras);
  };

  const salvarAlteracoes = async () => {
    try {
      await apiService.editarProduto(form.codigo_barras, {
        ...form,
        preco: parseFloat(form.preco.replace(",", ".")),
        estoque: parseInt(form.estoque),
      });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Falha ao salvar alterações.";
      Alert.alert("Erro", msg);
    }
  };

  const deletarProduto = () => {
    Alert.alert("Excluir", "Tem certeza que deseja apagar este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await apiService.deletarProduto(form.codigo_barras);
            Alert.alert("Sucesso", "Produto removido.");
            setForm({ codigo_barras: "", nome: "", preco: "", estoque: "" });
            setCarregado(false);
          } catch (e: any) {
            const msg =
              e.response?.data?.detail || "Não foi possível remover o produto.";
            Alert.alert("Erro", msg);
          }
        },
      },
    ]);
  };

  if (!permission?.granted && isFocused) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Sem acesso à câmera.
        </Text>
        <TouchableOpacity style={styles.btnSalvar} onPress={requestPermission}>
          <Text style={styles.btnTexto}>Pedir Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (mostrarCamera && isFocused) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          onBarcodeScanned={handleScan}
          enableTorch={lanterna}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity
          style={styles.btnLanterna}
          onPress={() => setLanterna(!lanterna)}
        >
          <Ionicons
            name={lanterna ? "flash" : "flash-off"}
            size={26}
            color="white"
          />
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={styles.btnFecharScan}
            onPress={() => setMostrarCamera(false)}
          >
            <Text style={styles.btnTexto}>CANCELAR SCAN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Gerenciar Produto por Código:</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={form.codigo_barras}
            onChangeText={(t) => {
              setForm({ ...form, codigo_barras: t });
              if (carregado) setCarregado(false); // Reseta se mudar o código
            }}
            placeholder="Código EAN-13"
            keyboardType="numeric"
          />
          {form.codigo_barras.length > 0 && (
            <TouchableOpacity onPress={limparCampo} style={styles.btnClear}>
              <Ionicons name="close-circle" size={30} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnSearch} onPress={buscarManual}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCamera}
            onPress={() => setMostrarCamera(true)}
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Só mostra os campos se o produto foi encontrado */}
        {carregado ? (
          <View style={{ marginTop: 10 }}>
            <View style={styles.divider} />

            <Text style={styles.label}>Nome do Produto:</Text>
            <TextInput
              style={styles.input}
              value={form.nome}
              onChangeText={(t) => setForm({ ...form, nome: t })}
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Preço (R$):</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.preco}
                  onChangeText={(t) => setForm({ ...form, preco: t })}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Estoque:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.estoque}
                  onChangeText={(t) => setForm({ ...form, estoque: t })}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={salvarAlteracoes}
            >
              <Text style={styles.btnTexto}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnDeletar}
              onPress={deletarProduto}
            >
              <Text style={styles.btnTexto}>EXCLUIR PRODUTO</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.infoText}>
            Escaneie ou digite o código para carregar os dados.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
