"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useAuth } from "../contexts/AuthContext";

export default function CarrinhoPage() {
  const {
    itens,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    total,
    finalizarPedido,
  } = useCarrinho();
  const { user } = useAuth();
  const router = useRouter();
  const [isFinalizando, setIsFinalizando] = useState(false);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const handleFinalizarPedido = async () => {
    if (itens.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    setIsFinalizando(true);
    try {
      const sucesso = await finalizarPedido();
      if (sucesso) {
        alert("Pedido finalizado com sucesso!");
        router.push("/");
      } else {
        alert("Erro ao finalizar pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsFinalizando(false);
    }
  };

  const handleQuantidadeChange = (
    produtoId: number,
    novaQuantidade: string
  ) => {
    const quantidade = parseInt(novaQuantidade);
    if (quantidade > 0) {
      atualizarQuantidade(produtoId, quantidade);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
          <p className="mt-2 text-gray-600">
            Revise seus itens antes de finalizar o pedido
          </p>
        </div>

        {/* Carrinho vazio */}
        {itens.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Carrinho vazio
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione alguns produtos à sua compra.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/loja")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {/* Lista de itens */}
            <ul className="divide-y divide-gray-200">
              {itens.map((item) => (
                <li key={item.produtoId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.nome}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Preço unitário: {formatarPreco(item.preco)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Controle de quantidade */}
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={`quantidade-${item.produtoId}`}
                          className="text-sm text-gray-700"
                        >
                          Qtd:
                        </label>
                        <input
                          id={`quantidade-${item.produtoId}`}
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) =>
                            handleQuantidadeChange(
                              item.produtoId,
                              e.target.value
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="text-lg font-medium text-gray-900 min-w-[100px] text-right">
                        {formatarPreco(item.subtotal)}
                      </div>

                      {/* Botão remover */}
                      <button
                        onClick={() => removerItem(item.produtoId)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remover item"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumo do pedido */}
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between text-lg font-medium text-gray-900">
                <span>Total:</span>
                <span>{formatarPreco(total)}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/loja")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continuar Comprando
                </button>
                <button
                  onClick={limparCarrinho}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Limpar Carrinho
                </button>
              </div>

              <button
                onClick={handleFinalizarPedido}
                disabled={isFinalizando || itens.length === 0}
                className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFinalizando ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Finalizando...
                  </>
                ) : (
                  "Finalizar Pedido"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
