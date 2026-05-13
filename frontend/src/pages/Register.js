import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const { notify } = useToast();
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== password2) {
      const errorMsg = 'Security keys do not match';
      setError(errorMsg);
      notify(errorMsg, 'error');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      notify('Clearance granted. Welcome to LogisAI Command Center.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Clearance request failed. Please try again.';
      setError(errorMsg);
      notify(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-24">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background animated-bg-grid opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-secondary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-neon-secondary/30 shadow-[0_0_30px_rgba(123,97,255,0.1)]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-neon-secondary/50 mb-4 shadow-[0_0_15px_rgba(123,97,255,0.3)]">
              <ShieldCheck className="text-neon-secondary" size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">
              REQUEST <span className="text-neon-secondary">CLEARANCE</span>
            </h1>
            <p className="text-text-secondary text-sm">
              Create an operator profile to access logistics infrastructure
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

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                Operator Designation (Name)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-secondary transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-secondary focus:ring-1 focus:ring-neon-secondary transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                Comms Channel (Email)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-secondary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-secondary focus:ring-1 focus:ring-neon-secondary transition-all duration-300"
                  placeholder="operator@logisai.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                  Security Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-secondary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-secondary focus:ring-1 focus:ring-neon-secondary transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
                  Verify Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-neon-secondary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:outline-none focus:border-neon-secondary focus:ring-1 focus:ring-neon-secondary transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-xl flex items-center justify-center gap-2 py-4 font-bold tracking-wide text-white bg-neon-secondary/80 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(123,97,255,0.4)] border border-neon-secondary"
            >
              <div className="absolute inset-0 bg-neon-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'PROCESSING...' : (
                  <>
                    ESTABLISH PROFILE <UserPlus size={18} />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-text-secondary text-sm">
            <p>
              Already an active operator?{' '}
              <Link to="/login" className="text-neon-secondary hover:text-white transition-colors inline-flex items-center gap-1 font-medium">
                <ArrowLeft size={14} /> Return to Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;