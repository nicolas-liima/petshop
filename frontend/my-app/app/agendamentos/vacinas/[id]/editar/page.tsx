"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { useAuth } from "../../../../contexts/AuthContext";

interface Vacina {
  id: number;
  nome: string;
  fabricante: string;
  estoque: number;
}

export default function EditarVacinaPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const agendamentoId = params.id;

  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [selectedVacinaId, setSelectedVacinaId] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
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

        const [resAgendamento, resVacinas] = await Promise.all([
          fetch(`http://localhost:8080/agendamentos/vacinas/${agendamentoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/vacinas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resAgendamento.ok) {
          setError("Agendamento não encontrado.");
          return;
        }
        if (!resVacinas.ok) {
          setError("Não foi possível carregar as vacinas.");
          return;
        }

        const agendamento = await resAgendamento.json();
        const vacinasData: Vacina[] = await resVacinas.json();

        if (agendamento.status !== "AGENDADO") {
          setError(
            `Este agendamento não pode ser editado pois está com status "${agendamento.status}".`,
          );
          return;
        }

        setAnimalId(agendamento.animalId);
        setSelectedVacinaId(String(agendamento.vacinaId));
        setDataAgendamento(agendamento.dataAgendamento);
        setObservacoes(agendamento.observacoes || "");
        setVacinas(vacinasData);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [isAuthenticated, token, router, agendamentoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/agendamentos/vacinas/${agendamentoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            animalId,
            vacinaId: Number(selectedVacinaId),
            dataAgendamento,
            observacoes: observacoes || undefined,
          }),
        },
      );

      if (response.ok) {
        alert("Agendamento de vacina atualizado com sucesso!");
        router.push(`/animais/${animalId}`);
      } else {
        const text = await response.text();
        let message = text || "Erro ao atualizar agendamento.";
        try {
          const j = JSON.parse(text);
          if (j?.message) message = j.message;
        } catch {}
        setError(message);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar agendamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Editar agendamento de vacina #{agendamentoId}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-600">Carregando dados...</p>
          ) : (
            !error && (
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
                    required
                    value={selectedVacinaId}
                    onChange={(e) => setSelectedVacinaId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  >
                    <option value="">Selecione uma vacina</option>
                    {vacinas.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        disabled={
                          v.estoque <= 0 && String(v.id) !== selectedVacinaId
                        }
                      >
                        {v.nome} - {v.fabricante}
                        {v.estoque <= 0 ? " (sem estoque)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dataAgendamento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Data *
                  </label>
                  <input
                    id="dataAgendamento"
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
                    rows={4}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
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
