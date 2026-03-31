'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface AgendamentoConsulta {
  id: number;
  animalId: number;
  animalNome: string;
  veterinarioId: number;
  veterinarioNome: string;
  veterinarioEspecialidade: string;
  dataHora: string;
  motivo: string;
  status: 'AGENDADO' | 'REALIZADO' | 'CANCELADO';
}

export default function AgendamentosConsultasPage() {
  const { token, isAuthenticated } = useAuth();
  const [agendamentos, setAgendamentos] = useState<AgendamentoConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const carregar = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/agendamentos/consultas', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgendamentos(data);
        setError('');
      } else {
        setError('Não foi possível carregar os agendamentos de consulta.');
      }
    } catch (err) {
      console.error('Erro ao carregar consultas:', err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto pt-20 px-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Acesso restrito</h2>
            <p className="text-center text-gray-600 mb-6">
              Faça login para visualizar o painel de consultas agendadas.
            </p>
            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Entrar
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-600">Carregando consultas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consultas agendadas</h1>
          <p className="mt-2 text-gray-600">
            Visão geral de todos os agendamentos de consulta. Para criar um novo, abra a ficha do
            animal e use &quot;Agendar consulta&quot;.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {agendamentos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">Nenhuma consulta agendada no sistema.</p>
            <Link
              href="/animais"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Ver animais
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {agendamentos.map((ag) => (
                <li key={ag.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">
                          <Link href={`/animais/${ag.animalId}`} className="hover:underline">
                            {ag.animalNome}
                          </Link>
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          Dr(a). {ag.veterinarioNome}
                          <span className="text-gray-500"> · {ag.veterinarioEspecialidade}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {new Date(ag.dataHora).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Motivo:</span> {ag.motivo}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            ag.status === 'AGENDADO'
                              ? 'bg-blue-100 text-blue-800'
                              : ag.status === 'REALIZADO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ag.status === 'AGENDADO'
                            ? 'Agendado'
                            : ag.status === 'REALIZADO'
                              ? 'Realizado'
                              : 'Cancelado'}
                        </span>
                      </div>
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
