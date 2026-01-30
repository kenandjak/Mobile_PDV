import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Alert, BackHandler, TouchableOpacity } from "react-native";

export default function Layout() {
  const handleSair = () => {
    Alert.alert("Sair", "Deseja fechar o aplicativo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => BackHandler.exitApp() },
    ]);
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2E7D32",
        tabBarStyle: {
          height: 110,
          paddingBottom: 70,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          position: "absolute",
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleSair} style={{ marginRight: 20 }}>
            <Ionicons name="log-out-outline" size={24} color="red" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Aba de Vendas (Arquivo index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Compras",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={28} color={color} />
          ),
          headerShown: true,
          headerTitle: "MercadoApp",
        }}
      />

      {/* Aba de Cadastro (Arquivo cadastro.tsx) */}
      <Tabs.Screen
        name="cadastro"
        options={{
          title: "Novo Produto",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={28} color={color} />
          ),
          headerTitle: "Cadastrar Novo Produto",
        }}
      />

      {/* Aba de Gerenciamento (Arquivo edit.tsx) */}
      <Tabs.Screen
        name="edit"
        options={{
          title: "Editar",
          tabBarLabel: "Gerenciar",
          tabBarIcon: ({ color }) => (
            <Ionicons name="create" size={28} color={color} />
          ),
          headerTitle: "Gerenciamento",
        }}
      />
    </Tabs>
  );
}
