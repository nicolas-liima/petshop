'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function CadastroVacinaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    fabricante: '',
    estoque: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/vacinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          nome: formData.nome,
          fabricante: formData.fabricante,
          estoque: parseInt(formData.estoque || '0', 10)
        })
      });

      if (response.ok) {
        alert('Vacina cadastrada com sucesso!');
        setFormData({
          nome: '',
          fabricante: '',
          estoque: ''
        });
        window.location.href = '/vacinas';
      } else {
        const errorData = await response.text();
        alert(errorData || 'Erro ao cadastrar vacina');
      }
    } catch (error) {
      console.error('Erro ao cadastrar vacina:', error);
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
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Cadastrar Vacina
              </h2>
              <p className="mt-2 text-gray-600">
                Preencha as informações da nova vacina.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome da Vacina *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="Ex: Antirrábica"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="fabricante"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fabricante *
                </label>
                <input
                  id="fabricante"
                  name="fabricante"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="Ex: Laboratório XYZ"
                  value={formData.fabricante}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="estoque"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantidade em Estoque *
                </label>
                <input
                  id="estoque"
                  name="estoque"
                  type="number"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="0"
                  value={formData.estoque}
                  onChange={handleChange}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Informação sobre Estoque
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        O estoque será utilizado para controle interno das doses
                        disponíveis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar Vacina'}
                </button>

                <Link
                  href="/vacinas"
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

