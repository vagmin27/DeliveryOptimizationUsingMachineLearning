import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Map, 
  Route, 
  Truck, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  User,
  Zap
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    notify('Logged out successfully', 'info');
    navigate('/login');
  };

  const navItems = [
    { path: '/command-center', label: 'Command Center', icon: <Box size={18} /> },
    { path: '/dashboard', label: 'Analytics', icon: <LayoutDashboard size={18} /> },
    { path: '/vehicles', label: 'Agents', icon: <Truck size={18} /> },
    { path: '/locations', label: 'Clusters', icon: <Map size={18} /> },
    { path: '/optimizations', label: 'Routes', icon: <Route size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`glass-card rounded-2xl px-6 py-3 flex items-center justify-between ${
            scrolled ? 'shadow-neon-primary bg-opacity-80' : 'bg-opacity-50'
          }`}>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden holographic-hover">
                <div className="absolute inset-0 bg-gradient-cyber opacity-20"></div>
                <Zap className="text-neon-primary z-10 group-hover:scale-110 transition-transform duration-300" size={24} />
              </div>
              <span className="text-xl font-display font-bold tracking-wider text-white group-hover:text-neon-primary transition-colors duration-300">
                LOGIS<span className="text-neon-secondary">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            {currentUser && (
              <div className="hidden lg:flex items-center gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="relative group px-4 py-2"
                    >
                      <div className={`flex items-center gap-2 transition-colors duration-300 ${
                        isActive ? 'text-neon-primary' : 'text-text-secondary group-hover:text-white'
                      }`}>
                        {item.icon}
                        <span className="font-medium text-sm tracking-wide">{item.label}</span>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-primary rounded-full shadow-[0_0_10px_rgba(0,245,255,0.8)]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* User Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                    <User size={16} className="text-neon-secondary" />
                    <span className="text-sm font-medium text-white/90">
                      {currentUser.name?.split(' ')[0] || 'Admin'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-300"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-300">
                    Login
                  </Link>
                  <Link to="/register" className="relative px-6 py-2 rounded-xl text-sm font-bold text-background bg-neon-primary hover:bg-white shadow-[0_0_15px_rgba(0,245,255,0.4)] hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all duration-300">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden relative z-10 p-2 text-white/80 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-background/80 lg:hidden pt-24 pb-6 px-6 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              {currentUser ? (
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-neon-primary/10 border border-neon-primary/30 text-neon-primary' 
                            : 'hover:bg-white/5 text-text-primary'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium text-lg tracking-wide">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center rounded-xl border border-white/20 text-white font-medium text-lg"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 text-center rounded-xl bg-neon-primary text-background font-bold text-lg shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {currentUser && (
              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center text-background font-bold">
                      {(currentUser.name?.[0] || 'A').toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{currentUser.name || 'Admin User'}</div>
                      <div className="text-text-secondary text-xs">{currentUser.email}</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors duration-300"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
