'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

interface Veterinario {
  id: number;
  nome: string;
  especialidade: string;
  ativo: boolean;
}

function toLocalDateTimeForApi(value: string): string {
  if (!value) return '';
  if (value.length === 16) return `${value}:00`;
  return value;
}

export default function AgendarConsultaPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const animalId = params.id;

  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [selectedVeterinarioId, setSelectedVeterinarioId] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loadingVets, setLoadingVets] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    const carregarVeterinarios = async () => {
      try {
        setLoadingVets(true);
        const response = await fetch('http://localhost:8080/veterinarios', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVeterinarios(data);
        } else {
          setError('Não foi possível carregar a lista de veterinários.');
        }
      } catch (err) {
        console.error('Erro ao carregar veterinários:', err);
        setError('Erro ao carregar veterinários. Tente novamente.');
      } finally {
        setLoadingVets(false);
      }
    };

    carregarVeterinarios();
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
      const response = await fetch('http://localhost:8080/agendamentos/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animalId: Number(animalId),
          veterinarioId: Number(selectedVeterinarioId),
          dataHora: toLocalDateTimeForApi(dataHora),
          motivo: motivo.trim(),
        }),
      });

      if (response.ok) {
        alert('Consulta agendada com sucesso!');
        router.push(`/animais/${animalId}`);
      } else {
        const text = await response.text();
        let message =
          text || 'Erro ao agendar consulta. Verifique os dados e tente novamente.';
        try {
          const errJson = JSON.parse(text);
          if (errJson?.message) message = errJson.message;
        } catch {
          /* mantém message como texto cru */
        }
        setError(message);
      }
    } catch (err) {
      console.error('Erro ao agendar consulta:', err);
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const vetsAtivos = veterinarios.filter((v) => v.ativo);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto pt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Acesso Restrito</h2>
            <p className="text-center text-gray-600">
              Você precisa estar logado para agendar uma consulta.
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Agendar consulta veterinária
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Animal #{animalId} · A consulta tem duração estimada de 30 minutos no sistema.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {loadingVets ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando veterinários...</p>
            </div>
          ) : vetsAtivos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Não há veterinários ativos. Cadastre um na área de veterinários (menu ou botão abaixo).
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => router.push('/veterinarios/cadastro')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Cadastrar veterinário
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/animais/${animalId}`)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Voltar ao animal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="veterinario" className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinário *
                </label>
                <select
                  id="veterinario"
                  name="veterinario"
                  required
                  value={selectedVeterinarioId}
                  onChange={(e) => setSelectedVeterinarioId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                >
                  <option value="">Selecione um veterinário</option>
                  {vetsAtivos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nome} — {v.especialidade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dataHora" className="block text-sm font-medium text-gray-700 mb-2">
                  Data e hora *
                </label>
                <input
                  id="dataHora"
                  name="dataHora"
                  type="datetime-local"
                  required
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Escolha um horário futuro. Conflitos com outras consultas do mesmo veterinário são
                  bloqueados pelo sistema.
                </p>
              </div>

              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da consulta *
                </label>
                <textarea
                  id="motivo"
                  name="motivo"
                  rows={4}
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  placeholder="Ex: check-up anual, coceira, revisão pós-vacina..."
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
                  {submitting ? 'Agendando...' : 'Agendar consulta'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
