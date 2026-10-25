import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';

export function RestockModal({ isOpen, onClose, vehicle, onRestock, isRestocking }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please specify a positive restock quantity (> 0).');
      return;
    }
    try {
      await onRestock(vehicle.id, qty);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Restock Vehicle</h2>
              <p className="text-xs text-slate-400">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Stock in Dealership:</span>
            <span className="text-sm font-bold text-white">{vehicle.quantity} units</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Additional Units to Add *
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRestocking}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isRestocking ? 'Restocking...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
