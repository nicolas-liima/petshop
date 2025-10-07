'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useCarrinho } from '../contexts/CarrinhoContext';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  statusProduto: 'DISPONIVEL' | 'INDISPONIVEL';
}

export default function LojaPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const { adicionarItem } = useCarrinho();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/produtos');
      
      if (response.ok) {
        const data = await response.json();
        // Filtrar apenas produtos disponíveis para clientes
        const produtosDisponiveis = data.filter((produto: Produto) => 
          produto.statusProduto === 'DISPONIVEL' && produto.quantidade > 0
        );
        setProdutos(produtosDisponiveis);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarAoCarrinho = (produto: Produto) => {
    if (!token) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho');
      return;
    }

    try {
      adicionarItem({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco
      });
      alert(`${produto.nome} foi adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Loja Pet Shop</h1>
            <p className="mt-2 text-gray-600">
              Encontre os melhores produtos para seu pet
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {produtos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto disponível</h3>
            <p className="mt-1 text-sm text-gray-500">
              No momento não há produtos disponíveis na loja.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {produto.nome}
                    </h3>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        {formatarPreco(produto.preco)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Estoque: {produto.quantidade}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => adicionarAoCarrinho(produto)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
                      </svg>
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}