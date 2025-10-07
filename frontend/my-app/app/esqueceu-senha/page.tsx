'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Verificar se o usuário existe pelo email
      const response = await fetch(`http://localhost:8080/usuarios/email/${email}`);
      
      if (response.ok) {
        const usuario = await response.json();
        console.log('Usuário encontrado:', usuario);
        setMessage('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');
        
        // Em uma implementação real, aqui você enviaria um email com token de recuperação
        // Por enquanto, apenas mostramos uma mensagem de sucesso
      } else if (response.status === 404) {
        // Mesmo que o usuário não exista, mostramos a mesma mensagem por segurança
        setMessage('Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.');
      } else {
        setMessage('Erro ao processar solicitação. Tente novamente mais tarde.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMessage('Erro de conexão com o servidor. Verifique se a API está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Recuperar senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digite seu email para receber instruções de recuperação
            </p>
          </div>
          
          {message ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-black text-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : 'Enviar instruções'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}