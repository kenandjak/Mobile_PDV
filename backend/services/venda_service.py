# services/venda_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import ProdutoDB, VendaDB, ItemVendaDB

class VendaService:
    @staticmethod
    def finalizar_venda(db: Session, itens_venda: list):
        
        total_calculado = 0
        itens_para_processar = []

        for item in itens_venda:
            produto = db.query(ProdutoDB).filter(ProdutoDB.codigo_barras == item.codigo_barras).first()
            
            if not produto:
                raise HTTPException(status_code=404, detail=f"Produto {item.codigo_barras} não encontrado")
            
            if produto.estoque < item.quantidade:
                raise HTTPException(status_code=400, detail=f"Estoque insuficiente para {produto.nome}")

            total_calculado += produto.preco * item.quantidade
            itens_para_processar.append((produto, item.quantidade))

        nova_venda = VendaDB(valor_total=total_calculado)
        db.add(nova_venda)
        db.flush() # Para gerar o ID da venda antes do commit

        # Criação dos itens da venda
        for produto, qtd in itens_para_processar:
            item_db = ItemVendaDB(
                venda_id=nova_venda.id,
                produto_id=produto.id,
                quantidade=qtd,
                preco_unitario=produto.preco
            )
            db.add(item_db)
            produto.estoque -= qtd # Baixa de estoque

        db.commit()
        db.refresh(nova_venda)
        return nova_venda