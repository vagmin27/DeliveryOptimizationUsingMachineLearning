import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleSocialLogin = (platform) => {
    notify(`${platform} authentication uplink is currently sandboxed.`, 'info');
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="login-card"
      >
        <div className="login-card-reflection" />
        
        {/* Title / Logo Section */}
        <div className="text-center mb-8 relative z-10 login-header">
          <div className="login-header-logo">
            <Zap className="text-neon-primary fill-neon-primary/20" size={28} />
          </div>
          <h1>SYSTEM LOGIN</h1>
          <p>
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

        <form onSubmit={onSubmit} className="space-y-5 relative z-10">
          {/* Username / Email Input */}
          <div className="login-input-group">
            <label className="login-label">
              Operator ID (Email)
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
                placeholder="operator@logisai.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="login-input-group">
            <label className="login-label">
              Security Key (Password)
            </label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={18} />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="login-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <a href="#forgot-password" onClick={(e) => { e.preventDefault(); handleSocialLogin('Password Reset'); }} className="login-forgot">
              Forgot Key?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? 'AUTHENTICATING...' : (
              <>
                INITIALIZE UPLINK <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* Social logins */}
        <div className="social-login-container relative z-10">
          <div className="social-divider">
            <span>Or Connect Via</span>
          </div>
          <div className="social-buttons">
            {/* Google */}
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="social-btn" 
              title="Sign in with Google"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </button>
            {/* Apple */}
            <button 
              onClick={() => handleSocialLogin('Apple')}
              className="social-btn" 
              title="Sign in with Apple"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-1.07 0-1.39-.62-2.62-.62-1.22 0-1.59.62-2.62.62-1.03 0-2.18-1-3.18-1.95-2.05-1.97-3.62-5.55-3.62-8.92 0-5.35 3.47-8.18 6.87-8.18 1.07 0 2.08.67 2.74.67.66 0 1.9-.81 3.19-.81 1.35 0 2.58.49 3.38 1.41-3.23 1.9-2.7 6.12.56 7.44-1.29 3.09-3.29 6.87-5.32 8.92zM12.03 4.65c.57-.69.95-1.66.85-2.62-.82.03-1.82.55-2.4 1.23-.49.56-.92 1.54-.8 2.48.92.07 1.85-.43 2.35-1.09z"/>
              </svg>
            </button>
            {/* GitHub */}
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              className="social-btn" 
              title="Sign in with GitHub"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-text-secondary text-sm relative z-10">
          <p>
            Unregistered Operative?{' '}
            <Link to="/register" className="text-neon-primary hover:text-white transition-colors inline-flex items-center gap-1 font-medium">
              Request Clearance <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;