'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function CadastroProdutoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    quantidade: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();

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
      const response = await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: formData.nome,
          preco: parseFloat(formData.preco),
          quantidade: parseInt(formData.quantidade),
          usuarioId: user?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Produto cadastrado com sucesso!');
        console.log('Produto criado:', result);
        // Limpar formulário após sucesso
        setFormData({ nome: '', preco: '', quantidade: '' });
        // Redirecionar para lista de produtos
        window.location.href = '/produtos';
      } else {
        const errorData = await response.json();
        alert(`Erro ao cadastrar: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor. Verifique se a API está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Cadastrar Produto
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Preencha as informações do novo produto
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
                      O status do produto será definido automaticamente:
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
                {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
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
    </ProtectedRoute>
  );
}
