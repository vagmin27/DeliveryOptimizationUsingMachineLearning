import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VehicleService from '../services/vehicle.service';
import '../styles/Vehicles.css';
import { useToast } from '../components/ToastProvider';
import { 
  Plus, 
  Truck, 
  Edit, 
  Trash2, 
  Route, 
  TrendingUp,
  Settings
} from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { notify } = useToast();

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await VehicleService.getAll();
      setVehicles(response || []);
      setError('');
    } catch (err) {
      setError('Failed to load vehicles');
      notify('Failed to load vehicles', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [notify]);
  
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await VehicleService.remove(id);
        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
        setError('');
        notify('Vehicle deleted successfully', 'success');
      } catch (err) {
        const msg = err?.response?.data?.msg || ('Failed to delete vehicle: ' + err.message);
        setError(msg);
        notify(msg, 'error');
      }
    }
  };

  const getVehicleStats = () => {
    const total = vehicles.length;
    const totalCapacity = vehicles.reduce((sum, v) => sum + (v.capacity || 0), 0);
    const totalCount = vehicles.reduce((sum, v) => sum + (v.count || 0), 0);
    const avgCapacity = total > 0 ? Math.round(totalCapacity / total) : 0;
    
    return { total, totalCapacity, totalCount, avgCapacity };
  };

  const stats = getVehicleStats();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto flex items-center justify-center">
        <div className="animate-pulse text-neon-primary text-xl font-bold flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
          LOADING FLEET DATA...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-1">
              Fleet <span className="text-neon-primary">Management</span>
            </h1>
            <p className="text-sm text-text-secondary font-medium tracking-wide">
              Autonomous Agent Specification & Status
            </p>
          </div>
          <Link 
            to="/vehicles/add" 
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 bg-neon-primary text-white hover:bg-white hover:text-background shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            <Plus size={16} />
            ADD AGENT
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Agents</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-neon-primary/10 rounded-xl flex items-center justify-center border border-neon-primary/30">
                <Truck className="text-2xl text-neon-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-secondary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Active Units</p>
                <p className="text-3xl font-bold text-white">{stats.totalCount}</p>
              </div>
              <div className="w-12 h-12 bg-neon-secondary/10 rounded-xl flex items-center justify-center border border-neon-secondary/30">
                <Route className="text-2xl text-neon-secondary" size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Payload</p>
                <p className="text-3xl font-bold text-white">{stats.totalCapacity}</p>
              </div>
              <div className="w-12 h-12 bg-neon-accent/10 rounded-xl flex items-center justify-center border border-neon-accent/30">
                <TrendingUp className="text-2xl text-neon-accent" size={24} />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Avg. Payload</p>
                <p className="text-3xl font-bold text-white">{stats.avgCapacity}</p>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/20">
                <Settings className="text-2xl text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            <Truck className="mr-2" size={18} />
            {error}
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center">
            <div className="w-24 h-24 bg-neon-primary/10 border border-neon-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="text-4xl text-neon-primary" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No agents deployed
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Initialize your logistics network by registering delivery agents to the system.
            </p>
            <Link 
              to="/vehicles/add" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-neon-primary text-white hover:bg-white hover:text-background hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
            >
              <Plus size={18} />
              Deploy First Agent
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-bold text-white tracking-wider">
                ACTIVE DEPLOYMENTS
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                  <div 
                    key={vehicle._id} 
                    className="group bg-black/40 p-6 rounded-2xl border border-white/10 hover:border-neon-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-neon-primary/10 border border-neon-primary/30 rounded-xl flex items-center justify-center text-neon-primary">
                        <Truck className="text-xl" size={20} />
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          to={`/vehicles/edit/${vehicle._id}`} 
                          className="px-3 py-1.5 text-xs font-bold rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                          <Edit className="inline mr-1" size={14} /> Edit
                        </Link>
                        <button
                          className="px-3 py-1.5 text-xs font-bold rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
                          onClick={() => handleDelete(vehicle._id)}
                        >
                          <Trash2 className="inline mr-1" size={14} /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {vehicle.name}
                        </h3>
                        {vehicle.description && (
                          <p className="text-xs text-text-secondary">
                            {vehicle.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="text-neon-primary text-xs" size={12} />
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              Payload Cap
                            </span>
                          </div>
                          <p className="text-base font-bold text-white">
                            {vehicle.capacity} kg
                          </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Route className="text-neon-secondary text-xs" size={12} />
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              Units
                            </span>
                          </div>
                          <p className="text-base font-bold text-white">
                            {vehicle.count}
                          </p>
                        </div>
                      </div>

                      {vehicle.type && (
                        <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">
                            Class: <span className="text-neon-accent ml-1">{vehicle.type}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;