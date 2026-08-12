import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCheck, Shield, Sparkles } from 'lucide-react';

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

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed demo login');
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-xl shadow-blue-500/30 mb-4">
          LS
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

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <p className="text-xs font-semibold text-slate-400 mb-3 flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Quick Demo One-Click Sign In
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('alex.morgan@example.com')}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-[11px] font-medium text-slate-200 text-center transition"
              >
                Alex Morgan (User)
              </button>
              <button
                onClick={() => handleDemoLogin('sarah.chen@example.com')}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-[11px] font-medium text-slate-200 text-center transition"
              >
                Sarah Chen (User)
              </button>
              <button
                onClick={() => handleDemoLogin('admin@linksphere.com')}
                className="p-2 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/50 rounded-lg text-[11px] font-medium text-purple-200 text-center transition"
              >
                Admin User
              </button>
            </div>
          </div>

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
