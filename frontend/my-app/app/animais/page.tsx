'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface Animal {
  id: number;
  nome: string;
  idade: number;
  especie: string;
  raca: string;
  cor: string;
  sexo: string;
  tamanho: string;
  descricao: string;
  vacinado: boolean;
  castrado: boolean;
  status: string;
}

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('DISPONIVEL');
  const { isAuthenticated, token } = useAuth();

  const carregarAnimais = async (status?: string) => {
    try {
      setLoading(true);
      const url = status ? `http://localhost:8080/animais?status=${status}` : 'http://localhost:8080/animais';
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setAnimais(data);
        setError('');
      } else {
        setError('Não foi possível carregar a lista de animais');
      }
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      setError('Não foi possível carregar a lista de animais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAnimais(filtroStatus);
  }, [filtroStatus]);

  const handleAdotar = async (animalId: number) => {
    if (!isAuthenticated || !token) {
      alert('Você precisa estar logado para adotar um animal');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/animais/${animalId}/adotar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Animal adotado com sucesso!');
        carregarAnimais(filtroStatus); // Recarregar a lista
      } else {
        alert('Erro ao adotar animal. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adotar animal:', error);
      alert('Erro ao adotar animal. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Animais para Adoção</h1>
          {isAuthenticated && (
            <Link
              href="/animais/cadastro"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Cadastrar Animal
            </Link>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por status:
          </label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="">Todos</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="ADOTADO">Adotado</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando animais...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animais.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filtroStatus === 'DISPONIVEL' ? 'Sem animais para adoção' : filtroStatus === 'ADOTADO' ? 'Nenhum animal foi adotado ainda' : 'Nenhum animal cadastrado'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filtroStatus === 'DISPONIVEL' ? 'No momento não há animais disponíveis para adoção.' : filtroStatus === 'ADOTADO' ? 'Ainda não há registros de animais adotados.' : 'Não há animais cadastrados no sistema.'}
                  </p>
                  {isAuthenticated && (
                    <Link
                      href="/animais/cadastro"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Cadastrar Primeiro Animal
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              animais.map((animal) => (
                <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{animal.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        animal.status === 'DISPONIVEL' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {animal.status === 'DISPONIVEL' ? 'Disponível' : 'Adotado'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Espécie:</span> {animal.especie}</p>
                      <p><span className="font-medium">Raça:</span> {animal.raca}</p>
                      <p><span className="font-medium">Idade:</span> {animal.idade} anos</p>
                      <p><span className="font-medium">Sexo:</span> {animal.sexo}</p>
                      <p><span className="font-medium">Tamanho:</span> {animal.tamanho}</p>
                      <p><span className="font-medium">Cor:</span> {animal.cor}</p>
                    </div>
                    
                    {animal.descricao && (
                      <p className="text-gray-700 text-sm mb-4">{animal.descricao}</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link
                        href={`/animais/${animal.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-center hover:bg-gray-200 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                      {animal.status === 'DISPONIVEL' && isAuthenticated && (
                        <button
                          onClick={() => handleAdotar(animal.id)}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Adotar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}