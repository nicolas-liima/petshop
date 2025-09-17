'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

type TipoAnimal = 'cachorro' | 'gato' | '';
type Sexo = 'macho' | 'femea' | '';
type Porte = 'pequeno' | 'medio' | 'grande' | '';

export default function CadastroPetPage() {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '' as TipoAnimal,
    raca: '',
    idade: '',
    sexo: '' as Sexo,
    porte: '' as Porte,
    cor: '',
    peso: '',
    descricao: '',
    vacinado: false,
    castrado: false,
    vermifugado: false,
    contato: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Raças por tipo de animal
  const racasPorTipo = {
    cachorro: [
      'Vira-lata (SRD)',
      'Labrador',
      'Golden Retriever',
      'Pastor Alemão',
      'Bulldog',
      'Poodle',
      'Chihuahua',
      'Pincher',
      'Rottweiler',
      'Beagle',
      'Shih Tzu',
      'Yorkshire',
      'Dachshund (Salsicha)',
      'Border Collie',
      'Husky Siberiano',
      'Boxer',
      'Cocker Spaniel',
      'Maltês',
      'Pug',
      'Dálmata'
    ],
    gato: [
      'Vira-lata (SRD)',
      'Persa',
      'Siamês',
      'Maine Coon',
      'Ragdoll',
      'British Shorthair',
      'Abissínio',
      'Bengal',
      'Russian Blue',
      'Sphynx',
      'Scottish Fold',
      'Angorá',
      'Birmanês',
      'Exótico',
      'Oriental',
      'Manx',
      'Somali',
      'Tonquinês',
      'Burmês',
      'Chartreux'
    ]
  };

  // Obter raças disponíveis baseado no tipo selecionado
  const getRacasDisponiveis = () => {
    if (formData.tipo === 'cachorro') return racasPorTipo.cachorro;
    if (formData.tipo === 'gato') return racasPorTipo.gato;
    return [];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        // Limpar raça quando tipo de animal for alterado
        if (name === 'tipo') {
          newData.raca = '';
        }
        
        return newData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Aqui você pode adicionar a lógica de cadastro do pet
    console.log('Cadastro de pet:', formData);
    
    // Simular delay de requisição
    setTimeout(() => {
      setIsLoading(false);
      alert('Pet cadastrado com sucesso!');
    }, 1000);
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Cadastrar Pet para Adoção
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Preencha as informações do pet que será disponibilizado para adoção
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                    Nome do Pet *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Ex: Rex, Mimi"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                    Tipo de Animal *
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="cachorro">Cachorro</option>
                    <option value="gato">Gato</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="raca" className="block text-sm font-medium text-gray-700">
                    Raça {formData.tipo && '*'}
                  </label>
                  {formData.tipo ? (
                    <select
                      id="raca"
                      name="raca"
                      required={!!formData.tipo}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                      value={formData.raca}
                      onChange={handleChange}
                    >
                      <option value="">Selecione a raça</option>
                      {getRacasDisponiveis().map((raca) => (
                        <option key={raca} value={raca}>
                          {raca}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      id="raca"
                      name="raca"
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black bg-gray-100"
                    >
                      <option value="">Primeiro selecione o tipo de animal</option>
                    </select>
                  )}
                </div>

                <div>
                  <label htmlFor="idade" className="block text-sm font-medium text-gray-700">
                    Idade *
                  </label>
                  <input
                    id="idade"
                    name="idade"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Ex: 2 anos, 6 meses"
                    value={formData.idade}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
                    Sexo *
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    value={formData.sexo}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o sexo</option>
                    <option value="macho">Macho</option>
                    <option value="femea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="porte" className="block text-sm font-medium text-gray-700">
                    Porte *
                  </label>
                  <select
                    id="porte"
                    name="porte"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    value={formData.porte}
                    onChange={handleChange}
                  >
                    <option value="">Selecione o porte</option>
                    <option value="pequeno">Pequeno</option>
                    <option value="medio">Médio</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cor" className="block text-sm font-medium text-gray-700">
                    Cor *
                  </label>
                  <input
                    id="cor"
                    name="cor"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Ex: Preto, Branco, Caramelo"
                    value={formData.cor}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
                    Peso (kg)
                  </label>
                  <input
                    id="peso"
                    name="peso"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Ex: 15kg, 3.5kg"
                    value={formData.peso}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Saúde */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Saúde</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="vacinado"
                    name="vacinado"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.vacinado}
                    onChange={handleChange}
                  />
                  <label htmlFor="vacinado" className="ml-2 block text-sm text-gray-900">
                    Vacinado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="castrado"
                    name="castrado"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.castrado}
                    onChange={handleChange}
                  />
                  <label htmlFor="castrado" className="ml-2 block text-sm text-gray-900">
                    Castrado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="vermifugado"
                    name="vermifugado"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formData.vermifugado}
                    onChange={handleChange}
                  />
                  <label htmlFor="vermifugado" className="ml-2 block text-sm text-gray-900">
                    Vermifugado
                  </label>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição do Pet
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="Conte um pouco sobre a personalidade, comportamento e características especiais do pet..."
                value={formData.descricao}
                onChange={handleChange}
              />
            </div>

            {/* Informações de Contato */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Contato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contato" className="block text-sm font-medium text-gray-700">
                    Nome do Responsável *
                  </label>
                  <input
                    id="contato"
                    name="contato"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Seu nome"
                    value={formData.contato}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                    Telefone *
                  </label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    maxLength={15}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                  />
                </div>

                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Sua cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                    Estado *
                  </label>
                  <input
                    id="estado"
                    name="estado"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                    placeholder="Ex: SP, RJ, MG"
                    value={formData.estado}
                    onChange={handleChange}
                  />
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
                {isLoading ? 'Cadastrando...' : 'Cadastrar Pet'}
              </button>
              
              <Link
                href="/"
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