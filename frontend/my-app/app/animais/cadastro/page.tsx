'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

export default function CadastroAnimalPage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      setError('Você precisa estar logado para cadastrar um animal');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const animalData = {
        ...formData,
        idade: parseInt(formData.idade)
      };

      const response = await fetch('http://localhost:8080/animais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(animalData)
      });

      if (response.ok) {
        alert('Animal cadastrado com sucesso!');
        router.push('/animais');
      } else {
        const errorData = await response.text();
        setError(errorData || 'Erro ao cadastrar animal');
      }
    } catch (error) {
      console.error('Erro ao cadastrar animal:', error);
      setError('Erro ao cadastrar animal. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
              Você precisa estar logado para cadastrar um animal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Cadastrar Animal para Adoção
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Nome do animal"
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
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Idade em anos"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Raça do animal"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Cor do animal"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                placeholder="Descreva o animal, seu temperamento, necessidades especiais, etc."
              />
            </div>



            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar Animal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}