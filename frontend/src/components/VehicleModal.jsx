import React, { useState, useEffect } from 'react';
import { X, Car, DollarSign, Layers, Hash, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ['Sports', 'Electric', 'Sedan', 'SUV', 'Coupe', 'Truck', 'Wagon'];

export function VehicleModal({ isOpen, onClose, onSave, vehicle, isSaving }) {
  const isEdit = !!vehicle?.id;

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '1',
    year: new Date().getFullYear(),
    vin: '',
    description: '',
    image_url: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        category: vehicle.category || 'Sedan',
        price: vehicle.price?.toString() || '',
        quantity: vehicle.quantity?.toString() || '0',
        year: vehicle.year || new Date().getFullYear(),
        vin: vehicle.vin || '',
        description: vehicle.description || '',
        image_url: vehicle.image_url || '',
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: 'Sedan',
        price: '',
        quantity: '1',
        year: new Date().getFullYear(),
        vin: '',
        description: '',
        image_url: '',
      });
    }
    setError(null);
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.make.trim() || !formData.model.trim()) {
      setError('Make and Model are required.');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number greater than 0.');
      return;
    }

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      setError('Quantity must be zero or a positive integer.');
      return;
    }

    const payload = {
      make: formData.make.trim(),
      model: formData.model.trim(),
      category: formData.category,
      price: price,
      quantity: quantity,
      year: formData.year ? parseInt(formData.year, 10) : undefined,
      vin: formData.vin ? formData.vin.trim() : undefined,
      description: formData.description ? formData.description.trim() : undefined,
      image_url: formData.image_url ? formData.image_url.trim() : undefined,
    };

    try {
      await onSave(payload, vehicle?.id);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Car className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {isEdit ? 'Edit Vehicle Details' : 'Add New Vehicle to Inventory'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Make *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Porsche, Tesla"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Model *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 911 Turbo, Model 3"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="75000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="3"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Model Year
              </label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                VIN (Vehicle Identification Number)
              </label>
              <input
                type="text"
                placeholder="e.g. 1HGCR2F83HA000123"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Vehicle Description
            </label>
            <textarea
              rows={3}
              placeholder="Highlight key specs, transmission, engine, features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving Vehicle...' : isEdit ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
