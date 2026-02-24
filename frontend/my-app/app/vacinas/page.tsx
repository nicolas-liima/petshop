'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface Vacina {
  id: number;
  nome: string;
  fabricante: string;
  estoque: number;
}

export default function VacinasPage() {
  const { token, isAuthenticated } = useAuth();
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarVacinas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/vacinas', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVacinas(data);
        setError('');
      } else {
        setError('Erro ao carregar vacinas');
      }
    } catch (err) {
      console.error('Erro ao carregar vacinas:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVacinas();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-center text-gray-600">
              Você precisa estar logado para gerenciar vacinas.
            </p>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando vacinas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vacinas</h1>
            <p className="mt-2 text-gray-600">
              Gerencie o cadastro e o estoque de vacinas.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/vacinas/cadastro"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nova Vacina
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
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
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {vacinas.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma vacina cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece cadastrando uma nova vacina.
            </p>
            <div className="mt-6">
              <Link
                href="/vacinas/cadastro"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cadastrar Vacina
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {vacinas.map((vacina) => (
                <li key={vacina.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {vacina.nome}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Fabricante: {vacina.fabricante}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">
                        Estoque:{' '}
                        <span
                          className={
                            vacina.estoque > 0
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {vacina.estoque}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

