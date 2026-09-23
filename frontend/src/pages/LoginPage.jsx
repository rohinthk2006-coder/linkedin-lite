import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import introLogo from '../assets/linksphere-intro.png';

export const LoginPage = ({ onNavigateRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="relative inline-block mb-3 group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition duration-300"></div>
          <img
            src={introLogo}
            alt="LinkSphere Logo"
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-xl border border-white/20"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome to Link<span className="text-blue-500">Sphere</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The next-generation professional networking platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-700/60 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onNavigateRegister}
              className="font-bold text-blue-400 hover:underline ml-1"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
