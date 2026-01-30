import axios from "axios";

// URL do túnel (LocalTunnel)
const API_URL = "https://better-rockets-yawn.loca.lt";

const api = axios.create({
  baseURL: API_URL,
});

export const apiService = {
  // Busca produto para o scan
  buscarProduto: (codigo: string) => api.get(`/produtos/${codigo}`),

  // Registra a venda finalizada
  finalizarVenda: (itens: any[]) =>
    api.post("/vendas", {
      itens: itens.map((item) => ({
        codigo_barras: item.codigo_barras,
        quantidade: item.quantidade_comprada,
      })),
    }),

  cadastrarProduto: (dados: any) => api.post("/produtos", dados),

  editarProduto: (codigo: string, dados: any) =>
    api.put(`/produtos/${codigo}`, dados),

  deletarProduto: (codigo: string) => api.delete(`/produtos/${codigo}`),
};
