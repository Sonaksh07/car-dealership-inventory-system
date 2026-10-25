import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Tag, DollarSign } from 'lucide-react';

const CATEGORIES = ['All', 'Sports', 'Electric', 'Sedan', 'SUV', 'Coupe', 'Truck', 'Wagon'];

export function SearchFilters({ filters, setFilters, onReset, totalCount }) {
  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const hasActiveFilters = Boolean(
    filters.make ||
    filters.model ||
    (filters.category && filters.category !== 'All') ||
    filters.min_price ||
    filters.max_price
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-thin">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1 shrink-0">
          <Tag className="w-3.5 h-3.5" /> Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = (filters.category || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => handleInputChange('category', cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Make Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search make (e.g. Porsche)..."
            value={filters.make || ''}
            onChange={(e) => handleInputChange('make', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
          />
        </div>

        {/* Model Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search model (e.g. 911 GT3)..."
            value={filters.model || ''}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
          />
        </div>

        {/* Min Price */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="Min price ($)..."
            value={filters.min_price || ''}
            onChange={(e) => handleInputChange('min_price', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
          />
        </div>

        {/* Max Price */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            min="0"
            step="1000"
            placeholder="Max price ($)..."
            value={filters.max_price || ''}
            onChange={(e) => handleInputChange('max_price', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/80 transition-all"
          />
        </div>
      </div>

      {/* Footer / Reset bar */}
      <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-200">{totalCount}</span> vehicle{totalCount === 1 ? '' : 's'}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
