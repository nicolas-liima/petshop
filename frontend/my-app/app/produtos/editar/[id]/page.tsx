'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  statusProduto: 'DISPONIVEL' | 'INDISPONIVEL';
}

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const produtoId = params.id as string;
  
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    quantidade: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (produtoId) {
      carregarProduto();
    }
  }, [produtoId]);

  const carregarProduto = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`http://localhost:8080/produtos/${produtoId}`);
      
      if (response.ok) {
        const produto: Produto = await response.json();
        setFormData({
          nome: produto.nome,
          preco: produto.preco.toString(),
          quantidade: produto.quantidade.toString()
        });
      } else {
        setError('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/produtos/${produtoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          preco: parseFloat(formData.preco),
          quantidade: parseInt(formData.quantidade)
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Produto atualizado com sucesso!');
        console.log('Produto atualizado:', result);
        // Redirecionar para lista de produtos
        router.push('/produtos');
      } else {
        // Tentar ler a resposta de erro apenas se houver conteúdo
        let errorMessage = 'Erro ao atualizar produto';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignorar erro de parse se não houver JSON
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor. Verifique se a API está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Erro</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Link
                  href="/produtos"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Voltar para Produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Editar Produto
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Atualize as informações do produto
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Produto */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome do Produto *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="Ex: Ração Premium para Cães"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            {/* Preço */}
            <div>
              <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                Preço (R$) *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                  placeholder="0,00"
                  value={formData.preco}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">
                Quantidade em Estoque *
              </label>
              <input
                id="quantidade"
                name="quantidade"
                type="number"
                min="0"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="0"
                value={formData.quantidade}
                onChange={handleChange}
              />
            </div>

            {/* Informações Adicionais */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Informação sobre Status
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      O status do produto será atualizado automaticamente:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li><strong>Disponível:</strong> quando a quantidade for maior que 0</li>
                      <li><strong>Indisponível:</strong> quando a quantidade for 0</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Atualizando...' : 'Atualizar Produto'}
              </button>
              
              <Link
                href="/produtos"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
