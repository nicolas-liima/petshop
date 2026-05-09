'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

interface Funcionario {
    id: number;
    nome: string;
}

function toLocalDateTimeForApi(value: string): string {
    if (!value) return '';
    if (value.length === 16) return `${value}:00`;
    return value;
}

export default function AgendarBanhoTosaPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, token } = useAuth();
    const animalId = params.id;

    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [selectedFuncionarioId, setSelectedFuncionarioId] = useState('');
    const [dataHora, setDataHora] = useState('');
    const [tipoServico, setTipoServico] = useState('');
    const [loadingFuncionarios, setloadingFuncionarios] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated || !token) {
            router.push('/login');
            return;
        }

        const carregarFuncionarios = async () => {
            try {
                setloadingFuncionarios(true);
                const response = await fetch('http://localhost:8080/funcionarios', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFuncionarios(data);
                } else {
                    setError('Não foi possível carregar a lista de funcionários.');
                }
            } catch (err) {
                console.error('Erro ao carregar funcionários:', err);
                setError('Erro ao carregar funcionários. Tente novamente.');
            } finally {
                setloadingFuncionarios(false);
            }
        };

        carregarFuncionarios();
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
            const response = await fetch('http://localhost:8080/agendamentos/banho-tosa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    animalId: Number(animalId),
                    funcionarioId: Number(selectedFuncionarioId),
                    dataHora: toLocalDateTimeForApi(dataHora),
                    tipoServico,
                }),
            });

            if (response.ok) {
                alert('Banho e Tosa agendado com sucesso!');
                router.push(`/animais/${animalId}`);
            } else {
                const text = await response.text();
                let message =
                    text || 'Erro ao agendar banho e tosa. Verifique os dados e tente novamente.';
                try {
                    const errJson = JSON.parse(text);
                    if (errJson?.message) message = errJson.message;
                } catch {
                    /* mantém message como texto cru */
                }
                setError(message);
            }
        } catch (err) {
            console.error('Erro ao agendar Banho e Tosa:', err);
            setError('Erro ao agendar Banho e Tosa. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    const funcionariosDisponiveis = funcionarios;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-md mx-auto pt-20">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Acesso Restrito</h2>
                        <p className="text-center text-gray-600">
                            Você precisa estar logado para agendar Banho e Tosa.
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
                        Agendar banho e tosa
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Animal #{animalId} · Serviço de banho e tosa
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {loadingFuncionarios ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Carregando funcionários...</p>
                        </div>
                    ) : funcionariosDisponiveis.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                                Não há funcionários ativos. Cadastre um na área de funcionários (menu ou botão abaixo).
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={() => router.push('/funcionarios/cadastro')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Cadastrar funcionário
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
                                <label htmlFor="funcionario" className="block text-sm font-medium text-gray-700 mb-2">
                                    Funcionário *
                                </label>
                                <select
                                    id="funcionario"
                                    name="funcionario"
                                    required
                                    value={selectedFuncionarioId}
                                    onChange={(e) => setSelectedFuncionarioId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                                >
                                    <option value="">Selecione um funcionário</option>
                                    {funcionariosDisponiveis.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.nome}
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
                                    name="tipoServico"
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
                                    {submitting ? 'Agendando...' : 'Agendar banho e tosa'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
