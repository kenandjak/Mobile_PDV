from pydantic import BaseModel
from typing import List

# --- Schemas Pydantic (Para validação de dados) ---
class ProdutoBase(BaseModel):
    codigo_barras: str
    nome: str
    preco: float
    estoque: int

class ProdutoCreate(ProdutoBase):
    pass # Usamos isso para criação

class ProdutoSchema(ProdutoBase):
    id: int

    class Config:
        from_attributes = True # SQLAlchemy -> JSON

class ItemVendaSchema(BaseModel):
    codigo_barras: str
    quantidade: int

class VendaSchema(BaseModel):
    itens: List[ItemVendaSchema]
