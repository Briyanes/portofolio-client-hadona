'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loginAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(result.redirectTo || '/admin');
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hadona-primary to-hadona-bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo/logo-hadona.png"
              alt="Hadona Digital Media"
              width={120}
              height={48}
              className="h-12 w-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Masuk untuk mengelola portofolio</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-hadona-primary focus:ring-2 focus:ring-hadona-primary/20 outline-none transition-all"
                placeholder="admin@hadona.id"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-hadona-primary focus:ring-2 focus:ring-hadona-primary/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-hadona-primary text-white font-semibold py-3 rounded-lg hover:bg-hadona-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="text-center mt-8 space-y-1">
          <p className="text-sm text-gray-400 flex items-center justify-center flex-wrap gap-1">
            <span>© {new Date().getFullYear()} Portofolio Hadona. Powered by</span>{' '}
            <a
              href="https://hadona.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-gray-200 transition-colors"
            >
              Hadona Digital Media
            </a>
          </p>
          <p className="text-xs text-gray-400">
            Designed & Developed by <span className="font-semibold text-gray-300">Briyanes</span>
          </p>
        </div>
      </div>
    </div>
  );
}
