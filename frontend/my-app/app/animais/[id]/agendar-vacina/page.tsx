'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

interface Vacina {
  id: number;
  nome: string;
  fabricante: string;
  estoque: number;
}

export default function AgendarVacinaPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const animalId = params.id;

  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [selectedVacinaId, setSelectedVacinaId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loadingVacinas, setLoadingVacinas] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    const carregarVacinas = async () => {
      try {
        setLoadingVacinas(true);
        const response = await fetch('http://localhost:8080/vacinas', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVacinas(data);
        } else {
          setError('Não foi possível carregar a lista de vacinas.');
        }
      } catch (err) {
        console.error('Erro ao carregar vacinas:', err);
        setError('Erro ao carregar vacinas. Tente novamente.');
      } finally {
        setLoadingVacinas(false);
      }
    };

    carregarVacinas();
  }, [isAuthenticated, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    if (!animalId) {
      setError('Animal inválido para agendamento.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/agendamentos/vacinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          animalId: Number(animalId),
          vacinaId: Number(selectedVacinaId),
          dataAgendamento,
          observacoes: observacoes || undefined
        })
      });

      if (response.ok) {
        alert('Vacina agendada com sucesso!');
        router.push(`/animais/${animalId}`);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Erro ao agendar vacina. Verifique os dados e tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao agendar vacina:', err);
      setError('Erro ao agendar vacina. Tente novamente.');
    } finally {
      setSubmitting(false);
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
              Você precisa estar logado para agendar uma vacina.
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Agendar Vacina para o Animal #{animalId}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loadingVacinas ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando vacinas disponíveis...</p>
            </div>
          ) : vacinas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Nenhuma vacina cadastrada. Cadastre uma vacina antes de agendar.
              </p>
              <button
                onClick={() => router.push('/vacinas/cadastro')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Cadastrar Vacina
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="vacina"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vacina *
                </label>
                <select
                  id="vacina"
                  name="vacina"
                  required
                  value={selectedVacinaId}
                  onChange={(e) => setSelectedVacinaId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                >
                  <option value="">Selecione uma vacina</option>
                  {vacinas.map((vacina) => (
                    <option
                      key={vacina.id}
                      value={vacina.id}
                      disabled={vacina.estoque <= 0}
                    >
                      {vacina.nome} - {vacina.fabricante}
                      {vacina.estoque <= 0 ? ' (sem estoque)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Vacinas sem estoque aparecem desativadas para agendamento.
                </p>
              </div>

              <div>
                <label
                  htmlFor="dataAgendamento"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Data do Agendamento *
                </label>
                <input
                  id="dataAgendamento"
                  name="dataAgendamento"
                  type="date"
                  required
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
              </div>

              <div>
                <label
                  htmlFor="observacoes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows={4}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Informações adicionais sobre o agendamento (opcional)"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push(`/animais/${animalId}`)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                >
                  {submitting ? 'Agendando...' : 'Agendar Vacina'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

