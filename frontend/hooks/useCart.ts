import { useState } from "react";

export const useCart = () => {
  const [itens, setItens] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const adicionarItem = (produto: any, quantidade: number) => {
    const subtotal = produto.preco * quantidade;
    const novoItem = { ...produto, quantidade_comprada: quantidade, subtotal };

    setItens((prev) => [novoItem, ...prev]);
    setTotal((prev) => prev + subtotal);
  };

  const removerItem = (index: number) => {
    const item = itens[index];
    setTotal((prev) => prev - item.subtotal);
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const limparCarrinho = () => {
    setItens([]);
    setTotal(0);
  };

  return { itens, total, adicionarItem, removerItem, limparCarrinho };
};
