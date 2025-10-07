'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export default function EditarUsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const usuarioId = params.id;
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuarioId) {
      carregarUsuario();
    }
  }, [usuarioId]);

  const carregarUsuario = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`http://localhost:8080/usuarios/${usuarioId}`);
      
      if (response.ok) {
        const usuario: Usuario = await response.json();
        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          senha: '' // Não carregamos a senha por segurança
        });
      } else {
        setError('Usuário não encontrado');
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
      // Preparar dados para envio (só incluir senha se foi preenchida)
      const dadosParaEnvio: any = {
        nome: formData.nome,
        email: formData.email
      };
      
      if (formData.senha.trim() !== '') {
        dadosParaEnvio.senha = formData.senha;
      }

      const response = await fetch(`http://localhost:8080/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Usuário atualizado com sucesso!');
        console.log('Usuário atualizado:', result);
        // Redirecionar para lista de usuários
        router.push('/usuarios');
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar: ${errorData.message || 'Erro desconhecido'}`);
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
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Carregando dados do usuário...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">{error}</div>
          <Link
            href="/usuarios"
            className="ml-4 text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Voltar para lista de usuários
          </Link>
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
              Editar Usuário
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Atualize as informações do usuário
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Nova Senha (opcional)
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-black text-black"
                placeholder="Deixe em branco para manter a senha atual"
                value={formData.senha}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Deixe em branco se não quiser alterar a senha
              </p>
            </div>

            {/* Botões */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Atualizando...' : 'Atualizar Usuário'}
              </button>
              
              <Link
                href="/usuarios"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-200 text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/usuarios"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Voltar para lista de usuários
          </Link>
        </div>
      </div>
    </div>
  );
}