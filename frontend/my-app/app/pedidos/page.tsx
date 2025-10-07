'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  statusProduto: 'DISPONIVEL' | 'INDISPONIVEL';
}

interface Pedido {
  id: number;
  produto: Produto;
  quantidade: number;
  precoTotal: number;
  dataPedido: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    // Por enquanto, vamos usar um ID fixo de usuário
    // Em uma implementação real, isso viria do contexto de autenticação
    const userId = 1; // Substitua pela lógica de autenticação real
    setUsuarioId(userId);
    carregarPedidos(userId);
  }, []);

  const carregarPedidos = async (userId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/pedidos?usuarioId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        setError('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/pedidos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Pedido excluído com sucesso!');
        if (usuarioId) {
          carregarPedidos(usuarioId); // Recarregar a lista
        }
      } else {
        alert('Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Carregando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
              <Link
                href="/pedidos/criar"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Novo Pedido
              </Link>
            </div>
          </div>

          {pedidos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">Nenhum pedido encontrado</div>
              <Link
                href="/pedidos/criar"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Fazer Primeiro Pedido
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data do Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{pedido.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pedido.produto.nome}</div>
                        <div className="text-sm text-gray-500">
                          Preço unitário: {formatarPreco(pedido.produto.preco)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pedido.quantidade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatarPreco(pedido.precoTotal)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatarData(pedido.dataPedido)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleDelete(pedido.id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition duration-200"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}