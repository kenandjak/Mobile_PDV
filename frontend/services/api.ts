import axios from "axios";

const API_URL = "https://mobile-pdv.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

export const apiService = {
  buscarProduto: (codigo: string) => api.get(`/produtos/${codigo}`),

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
