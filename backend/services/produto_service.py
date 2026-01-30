from sqlalchemy.orm import Session
from models import ProdutoDB
from schemas import ProdutoCreate

class ProdutoService:
    @staticmethod
    def buscar_por_codigo(db: Session, codigo: str):
        return db.query(ProdutoDB).filter(ProdutoDB.codigo_barras == codigo).first()
    
    @staticmethod
    def criar_produto(db: Session, produto_data: ProdutoCreate):
        novo_produto = ProdutoDB(
            codigo_barras=produto_data.codigo_barras,
            nome=produto_data.nome,
            preco=produto_data.preco,
            estoque=produto_data.estoque
        )
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
        return novo_produto
    
    @staticmethod
    def atualizar_produto(db: Session, codigo: str, dados_novos: ProdutoCreate):
        produto = db.query(ProdutoDB).filter(ProdutoDB.codigo_barras == codigo).first()
        if produto:
            produto.nome = dados_novos.nome
            produto.preco = dados_novos.preco
            produto.estoque = dados_novos.estoque
            db.commit()
            db.refresh(produto)
        return produto

    @staticmethod
    def deletar_produto(db: Session, codigo: str):
        produto = db.query(ProdutoDB).filter(ProdutoDB.codigo_barras == codigo).first()
        if produto:
            db.delete(produto)
            db.commit()
            return True
        return False