import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Map, 
  Route, Settings 
} from 'lucide-react';
import '../styles/BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Analytics', icon: <LayoutDashboard size={20} /> },
    { path: '/vehicles', label: 'Agents', icon: <Truck size={20} /> },
    { path: '/locations', label: 'Clusters', icon: <Map size={20} /> },
    { path: '/optimizations', label: 'Routes', icon: <Route size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <div className="bottom-nav-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${
              location.pathname === item.path || location.pathname.startsWith(item.path)
                ? 'active'
                : ''
            }`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;