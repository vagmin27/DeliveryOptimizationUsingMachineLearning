import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, Zap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { notify } = useToast();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      notify('Access Granted. Initializing Command Center...', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Authentication failed. Please verify credentials.';
      setError(errorMsg);
      notify(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background animated-bg-grid opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-secondary/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 rounded-3xl border border-neon-primary/30 shadow-[0_0_30px_rgba(0,245,255,0.1)] relative overflow-hidden">
          {/* AI Scanning Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none animate-ai-scan"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-neon-primary/50 mb-4 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
              <Zap className="text-neon-primary" size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">
              SYSTEM <span className="text-neon-primary">LOGIN</span>
            </h1>
            <p className="text-text-secondary text-sm">
              Authenticate to access the logistics control center
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              <AlertCircle size={18} />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                Operator ID (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary transition-all duration-300"
                  placeholder="operator@logisai.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                Security Key (Password)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl flex items-center justify-center gap-2 py-4 font-bold tracking-wide text-background bg-neon-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'AUTHENTICATING...' : (
                  <>
                    INITIALIZE UPLINK <LogIn size={18} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-text-secondary text-sm">
            <p>
              Unregistered Operative?{' '}
              <Link to="/register" className="text-neon-primary hover:text-white transition-colors inline-flex items-center gap-1 font-medium">
                Request Clearance <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;