'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function CadastroVeterinarioPage() {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    ativo: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/veterinarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          especialidade: formData.especialidade.trim(),
          ativo: formData.ativo,
        }),
      });

      if (response.ok) {
        alert('Veterinário cadastrado com sucesso!');
        setFormData({ nome: '', especialidade: '', ativo: true });
        window.location.href = '/veterinarios';
      } else {
        const errorData = await response.text();
        alert(errorData || 'Erro ao cadastrar veterinário');
      }
    } catch (error) {
      console.error('Erro ao cadastrar veterinário:', error);
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
              <h2 className="text-3xl font-extrabold text-gray-900">Cadastrar veterinário</h2>
              <p className="mt-2 text-gray-600">
                Veterinários ativos aparecem na lista ao agendar uma consulta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome completo *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="Ex: Dra. Maria Silva"
                  value={formData.nome}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700">
                  Especialidade *
                </label>
                <input
                  id="especialidade"
                  name="especialidade"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="Ex: Clínica geral, dermatologia"
                  value={formData.especialidade}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
                  Ativo (aparece para agendamento de consultas)
                </label>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Consultas só podem ser agendadas com veterinários marcados como ativos. A API valida
                  isso no momento do agendamento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar veterinário'}
                </button>

                <Link
                  href="/veterinarios"
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
