import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import '../styles/Login.css';

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
      notify('Clearance granted. Welcome to NexRoute Command Center.', 'success');
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
    <div className="login-page-container">
      {/* Abstract Animated Sunset Backdrop */}
      <div className="login-orbs-container">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-orb login-orb-4" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="login-card"
        style={{ maxWidth: '520px' }}
      >
        <div className="login-card-reflection" />
        
        {/* Title / Logo Section */}
        <div className="text-center mb-8 relative z-10 login-header">
          <div className="login-header-logo" style={{ color: 'var(--neon-secondary)', borderColor: 'rgba(123, 97, 255, 0.4)' }}>
            <ShieldCheck className="text-neon-secondary fill-neon-secondary/20" size={28} />
          </div>
          <h1>REQUEST CLEARANCE</h1>
          <p>
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

        <form onSubmit={onSubmit} className="space-y-5 relative z-10">
          {/* Operator Designation (Name) */}
          <div className="login-input-group">
            <label className="login-label">
              Operator Designation (Name)
            </label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size={18} />
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="login-input"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Comms Channel (Email) */}
          <div className="login-input-group">
            <label className="login-label">
              Comms Channel (Email)
            </label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" size={18} />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="login-input"
                placeholder="operator@nexroute.com"
              />
            </div>
          </div>

          {/* Security Key & Verify Key side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="login-input-group mb-0">
              <label className="login-label">
                Security Key
              </label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="login-input-group mb-0">
              <label className="login-label">
                Verify Key
              </label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" size={18} />
                <input
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength="6"
                  className="login-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn btn-secondary"
          >
            {loading ? 'PROCESSING...' : (
              <>
                ESTABLISH PROFILE <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-text-secondary text-sm relative z-10">
          <p>
            Already an active operator?{' '}
            <Link to="/login" className="text-neon-secondary hover:text-white transition-colors inline-flex items-center gap-1 font-medium">
              <ArrowLeft size={14} /> Return to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;