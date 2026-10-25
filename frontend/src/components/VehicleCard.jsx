import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Edit3, Trash2, PackagePlus, AlertTriangle, Check, Car } from 'lucide-react';

export function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock, purchasingId }) {
  const { isAuthenticated, isAdmin, openAuth } = useAuth();
  const isOutOfStock = vehicle.quantity <= 0;
  const isPurchasing = purchasingId === vehicle.id;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 ${
            vehicle.image_url ? 'hidden' : 'flex'
          }`}
        >
          <Car className="w-16 h-16 opacity-40 mb-2" />
          <span className="text-xs uppercase tracking-wider font-semibold">Apex Motors</span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-md">
            {vehicle.category}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 backdrop-blur-md text-rose-300 border border-rose-500/40 shadow-md">
              Out of Stock
            </span>
          ) : vehicle.quantity <= 2 ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-md">
              Only {vehicle.quantity} Left!
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 shadow-md">
              {vehicle.quantity} Available
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            {vehicle.year ? `${vehicle.year} • ` : ''}{vehicle.make}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            {vehicle.model}
          </h3>

          {vehicle.description && (
            <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          )}

          {vehicle.vin && (
            <div className="mt-3 text-[11px] font-mono text-slate-500 truncate">
              VIN: {vehicle.vin}
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-400">Starting at</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {formattedPrice}
            </span>
          </div>

          {/* Primary Action: Purchase */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuth('login');
              } else {
                onPurchase(vehicle.id);
              }
            }}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isOutOfStock
                ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed shadow-none'
                : isPurchasing
                ? 'bg-emerald-600/50 text-white cursor-wait'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {isOutOfStock
                ? 'Out of Stock'
                : isPurchasing
                ? 'Processing...'
                : !isAuthenticated
                ? 'Sign In to Purchase'
                : 'Purchase Unit'}
            </span>
          </button>

          {/* Admin Management Bar */}
          {isAdmin && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => onRestock(vehicle)}
                title="Restock Vehicle"
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <PackagePlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restock</span>
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit Details"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                title="Delete Vehicle"
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-transparent hover:border-rose-900/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
