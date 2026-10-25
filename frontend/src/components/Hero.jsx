import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Zap, Award, Sparkles, ArrowRight } from 'lucide-react';

export function Hero({ vehiclesCount, totalStock }) {
  const { isAuthenticated, openAuth } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 border border-slate-800/80 p-8 sm:p-12 mb-10 shadow-2xl">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated High-Performance & Luxury Fleet</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
          Next-Generation Automotive Inventory Management.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Browse, inspect, and purchase precision vehicles in real time. Built with Test-Driven Development, JWT-secured transactions, and instant stock synchronization.
        </p>

        {/* Call to action */}
        {!isAuthenticated && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => openAuth('register')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="px-6 py-3.5 rounded-xl font-semibold bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 transition-all text-sm"
            >
              Sign In to Existing Account
            </button>
          </div>
        )}

        {/* Stats strip */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {vehiclesCount}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Distinct Vehicle Models</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {totalStock}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Total Showroom Units</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1.5">
              <span>100%</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">TDD Verified & Tested</div>
          </div>
        </div>
      </div>
    </div>
  );
}
