import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptimizationService from '../services/optimization.service';
import '../styles/Optimizations.css';
import { useToast } from '../components/ToastProvider';

const Optimizations = () => {
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { notify } = useToast();

  useEffect(() => {
    fetchOptimizations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOptimizations = async () => {
    try {
      setLoading(true);
      const response = await OptimizationService.getAll();
      setOptimizations(response);
      setError('');
    } catch (err) {
      setError('Failed to load optimizations');
      notify('Failed to load optimizations', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this optimization?')) {
      try {
        await OptimizationService.remove(id);
        setOptimizations(optimizations ? optimizations.filter(opt => opt._id !== id) : []);
        setError('');
        notify('Optimization deleted', 'success');
      } catch (err) {
        const msg = err?.response?.data?.msg || 'Failed to delete optimization';
        setError(msg);
        notify(msg, 'error');
        console.error('Delete optimization error:', err?.response?.data || err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto flex items-center justify-center">
        <div className="animate-pulse text-neon-primary text-xl font-bold flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
          LOADING ROUTING PROTOCOLS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-1">
              Optimization <span className="text-neon-primary">Engine</span>
            </h1>
            <p className="text-sm text-text-secondary font-medium tracking-wide">
              Manage Algorithmic Routing Protocols
            </p>
          </div>
          <Link to="/optimizations/new" className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 bg-neon-primary text-background hover:shadow-[0_0_15px_rgba(0,245,255,0.5)]">
            <i className="fas fa-plus"></i> NEW PROTOCOL
          </Link>
        </div>

        {error && <div className="alert alert-danger mb-6">{error}</div>}

        {!optimizations || optimizations.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              No routing protocols generated
            </h3>
            <p className="text-text-secondary">Execute your first AI optimization protocol to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizations && optimizations.length > 0 && optimizations.map(optimization => (
              <div key={optimization._id} className="glass-panel rounded-2xl border border-white/10 p-6 hover:border-neon-primary/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-lg font-bold text-white">{optimization.name}</div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <span className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded uppercase text-text-secondary">
                    {new Date(optimization.date).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-neon-secondary/20 text-neon-secondary rounded uppercase">
                    {optimization.routes ? optimization.routes.length : 0} ROUTES
                  </span>
                </div>

                <div className="text-sm font-medium text-white mb-6">
                  <span className="text-neon-primary">Total Distance:</span> {Number(optimization?.totalDistance ?? 0).toFixed(2)} km
                </div>

                <div className="flex gap-2">
                  <Link to={`/optimizations/${optimization._id}`} className="px-4 py-2 text-xs font-bold rounded bg-white/10 text-white hover:bg-white/20 transition-colors w-full text-center">
                    VIEW DETAILS
                  </Link>
                  <button
                    className="px-4 py-2 text-xs font-bold rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30 w-full"
                    onClick={() => handleDelete(optimization._id)}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Optimizations;