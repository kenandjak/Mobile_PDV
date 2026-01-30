from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
import models
from schemas import VendaSchema
from services.venda_service import VendaService
from services.produto_service import ProdutoService
from schemas import ProdutoCreate, ProdutoSchema
from database import engine, get_db

# Cria as tabelas se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/produtos/{codigo}")
def buscar_produto(codigo: str, db: Session = Depends(get_db)):
    produto = ProdutoService.buscar_por_codigo(db, codigo)
    if not produto:
        raise HTTPException(
            status_code=404, 
            detail="Produto não encontrado. Tente novamente."
        )
    return produto

@app.post("/produtos", response_model=ProdutoSchema)
def cadastrar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    # 1. Verifica se o produto já existe
    produto_existente = ProdutoService.buscar_por_codigo(db, produto.codigo_barras)
    if produto_existente:
        raise HTTPException(
            status_code=400, 
            detail="Este código de barras já está cadastrado."
        )
    
    # 2. Chama o serviço para salvar
    return ProdutoService.criar_produto(db, produto)

@app.put("/produtos/{codigo}")
def editar_produto(codigo: str, dados: ProdutoCreate, db: Session = Depends(get_db)):
    produto = ProdutoService.atualizar_produto(db, codigo, dados)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"status": "Atualizado com sucesso"}

@app.delete("/produtos/{codigo}")
def remover_produto(codigo: str, db: Session = Depends(get_db)):
    sucesso = ProdutoService.deletar_produto(db, codigo)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return {"status": "Removido com sucesso"}

@app.post("/vendas")
def finalizar_venda(venda: VendaSchema, db: Session = Depends(get_db)):
    resultado_venda = VendaService.finalizar_venda(db, venda.itens)

    return {
        "status": "Venda realizada com sucesso", 
        "venda_id": resultado_venda.id, 
        "total": resultado_venda.valor_total
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)