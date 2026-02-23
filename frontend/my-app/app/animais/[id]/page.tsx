'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

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

export default function AnimalDetalhesPage() {
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adotando, setAdotando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const animalId = params.id;

  const carregarAnimal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/animais/${animalId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnimal(data);
        setError('');
      } else if (response.status === 404) {
        setError('Animal não encontrado');
      } else {
        setError('Animal não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
      setError('Não foi possível carregar os dados do animal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animalId) {
      carregarAnimal();
    }
  }, [animalId]);

  const handleAdotar = async () => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    try {
      setAdotando(true);
      const response = await fetch(`http://localhost:8080/animais/${animalId}/adotar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Recarregar os dados do animal para mostrar o novo status
        await carregarAnimal();
        alert('Animal adotado com sucesso!');
      } else {
        setError('Erro ao adotar animal. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adotar animal:', error);
      setError('Erro ao adotar animal. Tente novamente.');
    } finally {
      setAdotando(false);
    }
  };

  const handleAtualizar = () => {
    router.push(`/animais/${animalId}/editar`);
  };

  const handleExcluir = async () => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o animal ${animal?.nome}? Esta ação não pode ser desfeita.`
    );

    if (!confirmacao) return;

    try {
      setExcluindo(true);
      const response = await fetch(`http://localhost:8080/animais/${animalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Animal excluído com sucesso!');
        router.push('/animais');
      } else {
        setError('Erro ao excluir animal. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao excluir animal:', error);
      setError('Erro ao excluir animal. Tente novamente.');
    } finally {
      setExcluindo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando dados do animal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            href="/animais"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Voltar para Lista de Animais
          </Link>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Animal não encontrado.</p>
            <Link
              href="/animais"
              className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Voltar para Lista de Animais
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/animais" className="hover:text-indigo-600">
                Animais
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium">{animal.nome}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{animal.nome}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    animal.status === 'DISPONIVEL' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {animal.status === 'DISPONIVEL' ? 'Disponível para Adoção' : 'Já Adotado'}
                  </span>
                </div>
              </div>
              
              {animal.status === 'DISPONIVEL' && isAuthenticated && (
                <button
                  onClick={handleAdotar}
                  disabled={adotando}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors font-medium"
                >
                  {adotando ? 'Adotando...' : 'Adotar Este Animal'}
                </button>
              )}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações Básicas */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Espécie:</span>
                    <span className="text-gray-900">{animal.especie}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Raça:</span>
                    <span className="text-gray-900">{animal.raca}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Idade:</span>
                    <span className="text-gray-900">{animal.idade} anos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Sexo:</span>
                    <span className="text-gray-900">{animal.sexo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Tamanho:</span>
                    <span className="text-gray-900">{animal.tamanho}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Cor:</span>
                    <span className="text-gray-900">{animal.cor}</span>
                  </div>
                </div>
              </div>


            </div>

            {/* Descrição */}
            {animal.descricao && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre {animal.nome}</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{animal.descricao}</p>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/animais"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                Voltar para Lista
              </Link>
              
              {!isAuthenticated && animal.status === 'DISPONIVEL' && (
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Fazer Login para Adotar
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <button
                    onClick={handleAtualizar}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Atualizar Animal
                  </button>
                  
                  <button
                    onClick={handleExcluir}
                    disabled={excluindo}
                    className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium"
                  >
                    {excluindo ? 'Excluindo...' : 'Excluir Animal'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}