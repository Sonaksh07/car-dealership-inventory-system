import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilters } from './components/SearchFilters';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { RestockModal } from './components/RestockModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Car, AlertCircle, RefreshCw, Lock, Sparkles, Plus } from 'lucide-react';

export function App() {
  const { isAuthenticated, isAdmin, openAuth } = useAuth();

  // State
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: 'All',
    min_price: '',
    max_price: '',
  });

  // Modals
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);

  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockVehicleTarget, setRestockVehicleTarget] = useState(null);
  const [isRestocking, setIsRestocking] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch vehicles
  const loadVehicles = useCallback(async () => {
    if (!isAuthenticated) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const hasFilter =
        filters.make ||
        filters.model ||
        (filters.category && filters.category !== 'All') ||
        filters.min_price ||
        filters.max_price;

      let data;
      if (hasFilter) {
        data = await api.searchVehicles(filters);
      } else {
        data = await api.getVehicles();
      }
      setVehicles(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  // Load when auth or filters change
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: 'All',
      min_price: '',
      max_price: '',
    });
  };

  // Purchase Handler
  const handlePurchase = async (vehicleId) => {
    setPurchasingId(vehicleId);
    try {
      const updated = await api.purchaseVehicle(vehicleId);
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? updated : v)));
      addToast(`🎉 Purchase successful! You acquired 1 unit of ${updated.make} ${updated.model}.`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  // Restock Handler
  const handleRestock = async (vehicleId, quantity) => {
    setIsRestocking(true);
    try {
      const updated = await api.restockVehicle(vehicleId, quantity);
      setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? updated : v)));
      addToast(`📦 Successfully restocked ${quantity} unit(s) of ${updated.make} ${updated.model}.`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setIsRestocking(false);
    }
  };

  // Save Vehicle (Create / Update)
  const handleSaveVehicle = async (payload, id) => {
    setIsSavingVehicle(true);
    try {
      if (id) {
        const updated = await api.updateVehicle(id, payload);
        setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
        addToast(`Vehicle ${updated.make} ${updated.model} updated successfully.`, 'success');
      } else {
        const created = await api.addVehicle(payload);
        setVehicles((prev) => [created, ...prev]);
        addToast(`New vehicle ${created.make} ${created.model} added to inventory!`, 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setIsSavingVehicle(false);
    }
  };

  // Delete Vehicle
  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${vehicle.make} ${vehicle.model}" from dealership inventory?`)) {
      return;
    }

    try {
      await api.deleteVehicle(vehicle.id);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
      addToast(`Vehicle ${vehicle.make} ${vehicle.model} removed from inventory.`, 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Calculations for hero
  const totalStock = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenAddModal={() => {
          setEditingVehicle(null);
          setVehicleModalOpen(true);
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Banner */}
        <Hero vehiclesCount={vehicles.length} totalStock={totalStock} />

        {/* Unauthenticated Notification Callout */}
        {!isAuthenticated && (
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Authentication Required to Browse Live Fleet
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in or create an account with instant JWT access tokens to view prices, specifications, and purchase cars.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => openAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md"
              >
                Sign In Now
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls (shown when authenticated) */}
        {isAuthenticated && (
          <SearchFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalCount={vehicles.length}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center my-8">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Failed to Load Inventory</h3>
            <p className="text-xs text-rose-300 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={loadVehicles}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-slate-800/80 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800/80 rounded w-1/3" />
                  <div className="h-6 bg-slate-800/80 rounded w-2/3" />
                  <div className="h-4 bg-slate-800/80 rounded w-full" />
                </div>
                <div className="h-10 bg-slate-800/80 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Grid */}
        {isAuthenticated && !loading && !error && vehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                purchasingId={purchasingId}
                onPurchase={handlePurchase}
                onEdit={(v) => {
                  setEditingVehicle(v);
                  setVehicleModalOpen(true);
                }}
                onDelete={handleDeleteVehicle}
                onRestock={(v) => {
                  setRestockVehicleTarget(v);
                  setRestockModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isAuthenticated && !loading && !error && vehicles.length === 0 && (
          <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30 my-6">
            <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Vehicles Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              There are currently no vehicles matching your search criteria or category filter.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Reset Filters
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingVehicle(null);
                    setVehicleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Vehicle</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Apex Motors Inc. Developed with TDD Craftsmanship for Incubyte.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>FastAPI + SQLite</span>
            <span>•</span>
            <span>React + Vite</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AuthModal />
      <VehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={editingVehicle}
        isSaving={isSavingVehicle}
      />
      <RestockModal
        isOpen={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        vehicle={restockVehicleTarget}
        onRestock={handleRestock}
        isRestocking={isRestocking}
      />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
