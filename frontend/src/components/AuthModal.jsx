import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, closeAuth, authMode, openAuth, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!authModalOpen) return null;

  const isLogin = authMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          full_name: fullName,
          is_admin: isAdmin,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <Lock className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isLogin ? 'Sign In to Apex Motors' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin
              ? 'Access real-time vehicle inventory, prices, and purchasing'
              : 'Join to reserve and purchase luxury vehicles online'}
          </p>
        </div>

        {/* Quick Demo Credentials Fillers */}
        {isLogin && (
          <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@dealership.com', 'Admin@Apex2026!')}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white transition-colors text-center"
              >
                Dealership Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('buyer@dealership.com', 'Buyer@Apex2026!')}
                className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white transition-colors text-center"
              >
                Standard Buyer
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@dealership.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_admin_check"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500/40"
              />
              <label htmlFor="is_admin_check" className="text-xs text-slate-300 select-none cursor-pointer">
                Register as Administrator (Manager permissions)
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="font-semibold text-emerald-400 hover:underline"
              >
                Sign in to your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
