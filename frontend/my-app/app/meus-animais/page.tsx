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

export default function MeusAnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, token, user } = useAuth();

  const carregarMeusAnimais = async () => {
    if (!isAuthenticated || !token) {
      setError('Você precisa estar logado para ver seus animais');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/usuarios/meus-animais', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnimais(data);
        setError('');
      } else {
        setError('Não foi possível carregar seus animais');
      }
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      setError('Não foi possível carregar seus animais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMeusAnimais();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Você precisa estar logado para ver seus animais adotados.
            </p>
            <Link
              href="/login"
              className="block w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Animais Adotados</h1>
            <p className="text-gray-600 mt-2">
              Olá, {user?.nome}! Aqui estão os animais que você adotou.
            </p>
          </div>
          <Link
            href="/animais"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Adotar Mais Animais
          </Link>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando seus animais...</p>
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
                    Você ainda não adotou nenhum animal
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Que tal dar uma olhada nos animais disponíveis para adoção?
                  </p>
                  <Link
                    href="/animais"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Ver Animais Disponíveis
                  </Link>
                </div>
              </div>
            ) : (
              animais.map((animal) => (
                <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{animal.nome}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Adotado
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
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-center hover:bg-indigo-700 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Dicas de Cuidados */}
        {!loading && !error && animais.length > 0 && (
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              💡 Dicas para Cuidar dos Seus Animais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h3 className="font-medium mb-2">Saúde e Bem-estar:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Mantenha as vacinas em dia</li>
                  <li>Faça check-ups veterinários regulares</li>
                  <li>Observe mudanças no comportamento</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Cuidados Diários:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Forneça alimentação adequada</li>
                  <li>Garanta exercícios e brincadeiras</li>
                  <li>Mantenha a higiene em dia</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}