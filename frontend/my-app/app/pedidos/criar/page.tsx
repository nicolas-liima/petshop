'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  statusProduto: 'DISPONIVEL' | 'INDISPONIVEL';
}

export default function CriarPedidoPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formData, setFormData] = useState({
    produtoId: '',
    quantidade: '',
    usuarioId: user?.id?.toString() || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(true);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (formData.produtoId) {
      const produto = produtos.find(p => p.id === parseInt(formData.produtoId));
      setProdutoSelecionado(produto || null);
    } else {
      setProdutoSelecionado(null);
    }
  }, [formData.produtoId, produtos]);

  const carregarProdutos = async () => {
    try {
      setIsLoadingProdutos(true);
      const response = await fetch('http://localhost:8080/produtos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filtrar apenas produtos disponíveis
        const produtosDisponiveis = data.filter((produto: Produto) => 
          produto.statusProduto === 'DISPONIVEL' && produto.quantidade > 0
        );
        setProdutos(produtosDisponiveis);
      } else {
        alert('Erro ao carregar produtos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor');
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calcularPrecoTotal = () => {
    if (produtoSelecionado && formData.quantidade) {
      return produtoSelecionado.preco * parseInt(formData.quantidade);
    }
    return 0;
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!produtoSelecionado) {
      alert('Selecione um produto');
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (quantidade > produtoSelecionado.quantidade) {
      alert(`Quantidade solicitada (${quantidade}) é maior que o estoque disponível (${produtoSelecionado.quantidade})`);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          produtoId: parseInt(formData.produtoId),
          quantidade: quantidade,
          usuarioId: user?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Pedido criado com sucesso!');
        console.log('Pedido criado:', result);
        // Redirecionar para lista de pedidos
        router.push('/pedidos');
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar pedido: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor. Verifique se a API está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProdutos) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Carregando produtos...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Criar Novo Pedido
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Selecione um produto e a quantidade desejada
            </p>
          </div>

          {produtos.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-4">Nenhum produto disponível no momento</div>
              <Link
                href="/produtos"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleção de Produto */}
              <div>
                <label htmlFor="produtoId" className="block text-sm font-medium text-gray-700">
                  Produto *
                </label>
                <select
                  id="produtoId"
                  name="produtoId"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  value={formData.produtoId}
                  onChange={handleChange}
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - {formatarPreco(produto.preco)} (Estoque: {produto.quantidade})
                    </option>
                  ))}
                </select>
              </div>

              {/* Informações do Produto Selecionado */}
              {produtoSelecionado && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Produto Selecionado</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Nome:</span>
                      <p className="text-gray-900">{produtoSelecionado.nome}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Preço unitário:</span>
                      <p className="text-gray-900">{formatarPreco(produtoSelecionado.preco)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estoque disponível:</span>
                      <p className="text-gray-900">{produtoSelecionado.quantidade} unidades</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-green-600 font-medium">{produtoSelecionado.statusProduto}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantidade */}
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">
                  Quantidade *
                </label>
                <input
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  min="1"
                  max={produtoSelecionado?.quantidade || 1}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                  placeholder="Quantidade desejada"
                  value={formData.quantidade}
                  onChange={handleChange}
                />
                {produtoSelecionado && (
                  <p className="mt-1 text-sm text-gray-500">
                    Máximo disponível: {produtoSelecionado.quantidade} unidades
                  </p>
                )}
              </div>

              {/* Resumo do Pedido */}
              {produtoSelecionado && formData.quantidade && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-indigo-900 mb-2">Resumo do Pedido</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Produto:</span>
                      <span className="text-indigo-900 font-medium">{produtoSelecionado.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Quantidade:</span>
                      <span className="text-indigo-900 font-medium">{formData.quantidade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Preço unitário:</span>
                      <span className="text-indigo-900 font-medium">{formatarPreco(produtoSelecionado.preco)}</span>
                    </div>
                    <div className="flex justify-between border-t border-indigo-200 pt-2 mt-2">
                      <span className="text-indigo-700 font-medium">Total:</span>
                      <span className="text-indigo-900 font-bold text-lg">{formatarPreco(calcularPrecoTotal())}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading || !produtoSelecionado || !formData.quantidade}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Criando Pedido...' : 'Criar Pedido'}
                </button>
                
                <Link
                  href="/pedidos"
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-200 text-center"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/pedidos"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Voltar para lista de pedidos
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}