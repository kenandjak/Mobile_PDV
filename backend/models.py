from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

# --- Modelos do Banco de Dados ---
class ProdutoDB(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, index=True)
    codigo_barras = Column(String, unique=True, index=True)
    nome = Column(String)
    preco = Column(Float)
    estoque = Column(Integer)

class VendaDB(Base):
    __tablename__ = "vendas"
    id = Column(Integer, primary_key=True, index=True)
    data_venda = Column(DateTime(timezone=True), server_default=func.now())
    valor_total = Column(Float)
    
    itens = relationship("ItemVendaDB", back_populates="venda")

class ItemVendaDB(Base):
    __tablename__ = "itens_venda"
    id = Column(Integer, primary_key=True, index=True)
    venda_id = Column(Integer, ForeignKey("vendas.id"))
    produto_id = Column(Integer, ForeignKey("produtos.id"))
    quantidade = Column(Integer)
    preco_unitario = Column(Float)
    
    venda = relationship("VendaDB", back_populates="itens")
    produto = relationship("ProdutoDB")
