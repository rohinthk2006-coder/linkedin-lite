import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowLeft } from 'lucide-react';

export const RegisterPage = ({ onNavigateLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    headline: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-xl shadow-blue-500/30 mb-4">
          LS
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Join Link<span className="text-blue-500">Sphere</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Make the most of your professional life
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Headline (Optional)</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
                placeholder="e.g. Software Engineer at Google"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location (Optional)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-blue-500"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Creating Account...' : 'Agree & Join'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <button
              onClick={onNavigateLogin}
              className="font-bold text-blue-400 hover:underline ml-1"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
