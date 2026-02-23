'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

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

export default function EditarAnimalPage() {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    especie: '',
    raca: '',
    cor: '',
    sexo: '',
    tamanho: '',
    descricao: ''
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const animalId = params.id;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    carregarAnimal();
  }, [isAuthenticated]);

  const carregarAnimal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/animais/${animalId}`);
      
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nome: data.nome || '',
          idade: data.idade?.toString() || '',
          especie: data.especie || '',
          raca: data.raca || '',
          cor: data.cor || '',
          sexo: data.sexo || '',
          tamanho: data.tamanho || '',
          descricao: data.descricao || ''
        });
        setError('');
      } else if (response.status === 404) {
        setError('Animal não encontrado');
      } else {
        setError('Erro ao carregar dados do animal');
      }
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
      setError('Não foi possível carregar os dados do animal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    try {
      setSalvando(true);
      setError('');

      const dadosParaEnvio = {
        ...formData,
        idade: parseInt(formData.idade)
      };

      const response = await fetch(`http://localhost:8080/animais/${animalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (response.ok) {
        alert('Animal atualizado com sucesso!');
        router.push(`/animais/${animalId}`);
      } else {
        const errorData = await response.text();
        setError('Erro ao atualizar animal. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      setError('Erro ao atualizar animal. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando dados do animal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Animal</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (anos) *
                </label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-2">
                  Espécie *
                </label>
                <select
                  id="especie"
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Selecione a espécie</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Coelho">Coelho</option>
                  <option value="Pássaro">Pássaro</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="raca" className="block text-sm font-medium text-gray-700 mb-2">
                  Raça *
                </label>
                <input
                  type="text"
                  id="raca"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-2">
                  Cor *
                </label>
                <input
                  type="text"
                  id="cor"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Selecione o sexo</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>

              <div>
                <label htmlFor="tamanho" className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho *
                </label>
                <select
                  id="tamanho"
                  name="tamanho"
                  value={formData.tamanho}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="">Selecione o tamanho</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Descreva o temperamento, características especiais, cuidados necessários..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push(`/animais/${animalId}`)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}