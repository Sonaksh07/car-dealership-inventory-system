import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, ShieldCheck, LogOut, Plus, User, Sparkles } from 'lucide-react';

export function Navbar({ onOpenAddModal }) {
  const { user, isAuthenticated, isAdmin, logout, openAuth } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Car className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                APEX MOTORS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Showroom
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Luxury & Performance Dealership Inventory
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={onOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              )}

              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 font-semibold text-xs border border-slate-700">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {user?.full_name || user?.email}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-0.5 text-amber-400 font-medium">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-emerald-400">Verified Buyer</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('register')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
