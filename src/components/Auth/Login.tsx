import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-[32px] border border-stone-200 shadow-sm">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold">Kembali ke Beranda</span>
        </Link>

        <h1 className="text-4xl font-black text-black italic mb-2">MASUK</h1>
        <p className="text-stone-500 font-medium mb-8">Selamat datang kembali di PACE.</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-stone-500 font-medium">
            Belum punya akun?{' '}
            <Link to="/register" className="text-black font-bold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
