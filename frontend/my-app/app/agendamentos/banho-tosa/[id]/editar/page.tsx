"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { useAuth } from "../../../../contexts/AuthContext";

interface Funcionario {
  id: number;
  nome: string;
  ativo: boolean;
}

function toLocalDateTimeForApi(value: string): string {
  if (!value) return "";
  if (value.length === 16) return `${value}:00`;
  return value;
}

function toDateTimeLocalInput(value: string): string {
  if (!value) return "";
  return value.slice(0, 16);
}

export default function EditarBanhoTosaPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const agendamentoId = params.id;

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [tipoServico, setTipoServico] = useState("");
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

        const [resAgendamento, resFuncionarios] = await Promise.all([
          fetch(
            `http://localhost:8080/agendamentos/banho-tosa/${agendamentoId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          fetch("http://localhost:8080/funcionarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!resAgendamento.ok) {
          setError("Agendamento não encontrado.");
          return;
        }
        if (!resFuncionarios.ok) {
          setError("Não foi possível carregar os funcionários.");
          return;
        }

        const agendamento = await resAgendamento.json();
        const funcionariosData: Funcionario[] = await resFuncionarios.json();

        if (agendamento.status !== "AGENDADO") {
          setError(
            `Este agendamento não pode ser editado pois está com status "${agendamento.status}".`,
          );
          return;
        }

        setAnimalId(agendamento.animalId);
        setSelectedFuncionarioId(String(agendamento.funcionarioId));
        setDataHora(toDateTimeLocalInput(agendamento.dataHora));
        setTipoServico(agendamento.tipoServico);
        setFuncionarios(funcionariosData);
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
        `http://localhost:8080/agendamentos/banho-tosa/${agendamentoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            animalId,
            funcionarioId: Number(selectedFuncionarioId),
            dataHora: toLocalDateTimeForApi(dataHora),
            tipoServico,
          }),
        },
      );

      if (response.ok) {
        alert("Banho e tosa atualizado com sucesso!");
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

  const funcionariosAtivos = funcionarios.filter((f) => f.ativo);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Editar banho e tosa #{agendamentoId}
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
                    htmlFor="funcionario"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Funcionário *
                  </label>
                  <select
                    id="funcionario"
                    required
                    value={selectedFuncionarioId}
                    onChange={(e) => setSelectedFuncionarioId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  >
                    <option value="">Selecione um funcionário</option>
                    {funcionariosAtivos.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nome}
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
                    htmlFor="tipoServico"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de serviço *
                  </label>
                  <select
                    id="tipoServico"
                    required
                    value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  >
                    <option value="">Selecione o serviço</option>
                    <option value="BANHO">Banho</option>
                    <option value="TOSA">Tosa</option>
                    <option value="BANHO_E_TOSA">Banho e Tosa</option>
                  </select>
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
