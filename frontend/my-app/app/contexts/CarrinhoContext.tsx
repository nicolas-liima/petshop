'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ItemCarrinho {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  subtotal: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (produto: { id: number; nome: string; preco: number }) => void;
  removerItem: (produtoId: number) => void;
  atualizarQuantidade: (produtoId: number, quantidade: number) => void;
  limparCarrinho: () => void;
  total: number;
  quantidadeTotal: number;
  finalizarPedido: () => Promise<boolean>;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      try {
        setItens(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error);
        localStorage.removeItem('carrinho');
      }
    }
  }, []);

  // Salvar carrinho no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (produto: { id: number; nome: string; preco: number }) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.produtoId === produto.id);
      
      if (itemExistente) {
        // Se o item já existe, aumenta a quantidade
        return prevItens.map(item =>
          item.produtoId === produto.id
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                subtotal: (item.quantidade + 1) * item.preco
              }
            : item
        );
      } else {
        // Se é um novo item, adiciona ao carrinho
        const novoItem: ItemCarrinho = {
          produtoId: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          subtotal: produto.preco
        };
        return [...prevItens, novoItem];
      }
    });
  };

  const removerItem = (produtoId: number) => {
    setItens(prevItens => prevItens.filter(item => item.produtoId !== produtoId));
  };

  const atualizarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    setItens(prevItens =>
      prevItens.map(item =>
        item.produtoId === produtoId
          ? {
              ...item,
              quantidade,
              subtotal: quantidade * item.preco
            }
          : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const finalizarPedido = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para finalizar o pedido');
        return false;
      }

      const pedidoData = {
        itens: itens.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade
        }))
      };

      const response = await fetch('http://localhost:8080/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });

      if (response.ok) {
        limparCarrinho();
        return true;
      } else {
        const errorData = await response.text();
        console.error('Erro ao finalizar pedido:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      return false;
    }
  };

  const total = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      total,
      quantidadeTotal,
      finalizarPedido
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}