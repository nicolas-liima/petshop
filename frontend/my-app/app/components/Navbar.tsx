'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useCarrinho } from '../contexts/CarrinhoContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { quantidadeTotal } = useCarrinho();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">PetShop</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/produtos"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Produtos
                </Link>
                <Link
                  href="/loja"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Loja
                </Link>
                <Link
                  href="/animais"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Animais
                </Link>
                <Link
                  href="/meus-animais"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Meus Animais
                </Link>
                <Link
                  href="/carrinho"
                  className="relative text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Carrinho
                  {quantidadeTotal > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {quantidadeTotal}
                    </span>
                  )}
                </Link>
                <span className="text-gray-700 px-4 py-2 text-sm font-medium">
                  Olá, {user?.nome}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/produtos"
                    className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Produtos
                  </Link>
                  <Link
                    href="/loja"
                    className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Loja
                  </Link>
                  <Link
                    href="/animais"
                    className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Animais
                  </Link>
                  <Link
                    href="/meus-animais"
                    className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meus Animais
                  </Link>
                  <Link
                    href="/carrinho"
                    className="relative block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Carrinho
                    {quantidadeTotal > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {quantidadeTotal}
                      </span>
                    )}
                  </Link>
                  <div className="block text-gray-700 px-3 py-2 text-base font-medium">
                    Olá, {user?.nome}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}