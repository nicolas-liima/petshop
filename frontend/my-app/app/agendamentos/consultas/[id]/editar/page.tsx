"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { useAuth } from "../../../../contexts/AuthContext";

interface Veterinario {
  id: number;
  nome: string;
  especialidade: string;
  ativo: boolean;
}

interface AgendamentoConsulta {
  id: number;
  animalId: number;
  veterinarioId: number;
  veterinarioNome: string;
  dataHora: string;
  motivo: string;
  status: string;
}

function toLocalDateTimeForApi(value: string): string {
  if (!value) return "";
  if (value.length === 16) return `${value}:00`;
  return value;
}

function toDateTimeLocalInput(value: string): string {
  if (!value) return "";
  // Converte "2025-01-15T10:30:00" → "2025-01-15T10:30"
  return value.slice(0, 16);
}

export default function EditarConsultaPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const agendamentoId = params.id;

  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [selectedVeterinarioId, setSelectedVeterinarioId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [animalId, setAnimalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }

    const carregar = async () => {
      try {
        setLoading(true);

        // Carrega agendamento e veterinários em paralelo
        const [resAgendamento, resVets] = await Promise.all([
          fetch(
            `http://localhost:8080/agendamentos/consultas/${agendamentoId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          fetch("http://localhost:8080/veterinarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resAgendamento.ok) {
          setError("Agendamento não encontrado.");
          return;
        }

        if (!resVets.ok) {
          setError("Não foi possível carregar os veterinários.");
          return;
        }

        const agendamento: AgendamentoConsulta = await resAgendamento.json();
        const vets: Veterinario[] = await resVets.json();

        if (agendamento.status !== "AGENDADO") {
          setError(
            `Este agendamento não pode ser editado pois está com status "${agendamento.status}".`,
          );
          return;
        }

        setAnimalId(agendamento.animalId);
        setSelectedVeterinarioId(String(agendamento.veterinarioId));
        setDataHora(toDateTimeLocalInput(agendamento.dataHora));
        setMotivo(agendamento.motivo);
        setVeterinarios(vets);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [isAuthenticated, token, router, agendamentoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/agendamentos/consultas/${agendamentoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            animalId: animalId,
            veterinarioId: Number(selectedVeterinarioId),
            dataHora: toLocalDateTimeForApi(dataHora),
            motivo: motivo.trim(),
          }),
        },
      );

      if (response.ok) {
        alert("Consulta atualizada com sucesso!");
        router.push(`/animais/${animalId}`);
      } else {
        const text = await response.text();
        let message = text || "Erro ao atualizar consulta.";
        try {
          const errJson = JSON.parse(text);
          if (errJson?.message) message = errJson.message;
        } catch {
          /* mantém message como texto cru */
        }
        setError(message);
      }
    } catch (err) {
      console.error("Erro ao atualizar consulta:", err);
      setError("Erro ao atualizar consulta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const vetsAtivos = veterinarios.filter((v) => v.ativo);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Editar consulta #{agendamentoId}
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Altere os dados da consulta. A duração estimada continua sendo 30
            minutos.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          ) : (
            !error && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="veterinario"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Veterinário *
                  </label>
                  <select
                    id="veterinario"
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
                  <label
                    htmlFor="dataHora"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Data e hora *
                  </label>
                  <input
                    id="dataHora"
                    type="datetime-local"
                    required
                    value={dataHora}
                    onChange={(e) => setDataHora(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="motivo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Motivo da consulta *
                  </label>
                  <textarea
                    id="motivo"
                    rows={4}
                    required
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
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
                    {submitting ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
