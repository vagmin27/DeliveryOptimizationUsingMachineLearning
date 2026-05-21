import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, Map, Route, Plus, 
  Zap, Activity, ShieldCheck, 
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import VehicleService from '../services/vehicle.service';
import LocationService from '../services/location.service';
import OptimizationService from '../services/optimization.service';

// Mock Data for Charts
const performanceData = [
  { time: '08:00', efficiency: 85, activeAgents: 12 },
  { time: '10:00', efficiency: 92, activeAgents: 25 },
  { time: '12:00', efficiency: 78, activeAgents: 35 },
  { time: '14:00', efficiency: 88, activeAgents: 30 },
  { time: '16:00', efficiency: 95, activeAgents: 28 },
  { time: '18:00', efficiency: 90, activeAgents: 15 },
  { time: '20:00', efficiency: 82, activeAgents: 8 },
];

const predictiveData = [
  { day: 'Mon', actual: 1200, predicted: 1250 },
  { day: 'Tue', actual: 1400, predicted: 1380 },
  { day: 'Wed', actual: 1100, predicted: 1150 },
  { day: 'Thu', actual: 1600, predicted: 1500 },
  { day: 'Fri', actual: 1800, predicted: 1850 },
  { day: 'Sat', actual: null, predicted: 2200 }, // Future prediction
  { day: 'Sun', actual: null, predicted: 1900 }, // Future prediction
];

const clusterData = [
  { name: 'North Zone', load: 85, agents: 12 },
  { name: 'South Zone', load: 45, agents: 6 },
  { name: 'East Sector', load: 92, agents: 15 },
  { name: 'West Sector', load: 30, agents: 4 },
];

const aiLogs = [
  { id: 1, type: 'optimization', msg: 'Cluster #4 assigned to Agent_102. Travel distance reduced by 18%.', time: 'Just now' },
  { id: 2, type: 'alert', msg: 'Traffic anomaly detected in East Sector. Rerouting 3 active agents.', time: '2m ago' },
  { id: 3, type: 'success', msg: 'K-Means clustering recalculation complete. 4 new zones created.', time: '15m ago' },
  { id: 4, type: 'info', msg: 'Agent_089 completed route 45 minutes ahead of schedule.', time: '1h ago' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-md border border-neon-primary/30 p-3 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.2)]">
        <p className="text-text-secondary text-xs mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState({ totalVehicles: 0, totalLocations: 0, totalOptimizations: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, locationsData, optimizationsData] = await Promise.all([
          VehicleService.getAll().catch(() => []),
          LocationService.getAll().catch(() => []),
          OptimizationService.getAll().catch(() => [])
        ]);
        
        setStats({
          totalVehicles: vehiclesData.length || 0,
          totalLocations: locationsData.length || 0,
          totalOptimizations: optimizationsData.length || 0
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1 flex items-center gap-3">
            Operations Command <div className="w-2 h-2 rounded-full bg-neon-accent animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          </h1>
          <p className="text-text-secondary text-sm">Real-time overview of AI dispatch and logistics network.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-300 flex items-center gap-2">
            <Activity size={16} className="text-neon-primary" /> Live View
          </button>
          <Link to="/optimizations/new" className="px-4 py-2 rounded-xl bg-neon-primary text-white font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:bg-white hover:text-background transition-all duration-300 flex items-center gap-2">
            <Plus size={16} /> New Optimization
          </Link>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Metric Cards */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-primary/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-all duration-500 group-hover:bg-neon-primary/20"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider font-medium mb-1">Active Agents</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalVehicles}</h3>
            </div>
            <div className="p-3 rounded-xl bg-neon-primary/10 text-neon-primary">
              <Truck size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-neon-accent flex items-center"><TrendingUp size={12} className="mr-1" /> +12%</span>
            <span className="text-text-secondary">vs last week</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-secondary/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-all duration-500 group-hover:bg-neon-secondary/20"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider font-medium mb-1">Active Nodes</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalLocations}</h3>
            </div>
            <div className="p-3 rounded-xl bg-neon-secondary/10 text-neon-secondary">
              <Map size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-neon-accent flex items-center"><TrendingUp size={12} className="mr-1" /> +5%</span>
            <span className="text-text-secondary">vs last week</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-accent/10 rounded-full blur-[40px] -mr-16 -mt-16 transition-all duration-500 group-hover:bg-neon-accent/20"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider font-medium mb-1">AI Routes Computed</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalOptimizations}</h3>
            </div>
            <div className="p-3 rounded-xl bg-neon-accent/10 text-neon-accent">
              <Route size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-neon-accent flex items-center"><TrendingUp size={12} className="mr-1" /> +24%</span>
            <span className="text-text-secondary">vs last week</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-neon-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-neon-primary text-xs uppercase tracking-wider font-bold mb-1">System Status</p>
              <h3 className="text-xl font-bold text-white">OPTIMAL</h3>
            </div>
            <div className="p-3 rounded-xl bg-neon-primary/20 text-neon-primary">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="text-xs text-text-secondary mt-3">
            AI Engine running. Next cluster recalculation in 04:22.
          </div>
        </motion.div>
      </motion.div>

      {/* Main Charts Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Main Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white">Network Efficiency Index</h3>
            <select className="bg-background border border-white/10 rounded-lg px-3 py-1 text-xs text-text-secondary outline-none focus:border-neon-primary">
              <option>Today</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="efficiency" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorEfficiency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Dispatch Terminal */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <Zap size={18} className="text-neon-secondary" />
            <h3 className="font-bold text-white">AI Dispatch Feed</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {aiLogs.map((log) => (
              <div key={log.id} className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-[-16px] w-px bg-white/10 last:hidden"></div>
                {/* Timeline dot */}
                <div className={`absolute left-[5px] top-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                  log.type === 'optimization' ? 'bg-neon-secondary text-neon-secondary' :
                  log.type === 'alert' ? 'bg-neon-danger text-neon-danger' :
                  log.type === 'success' ? 'bg-neon-accent text-neon-accent' :
                  'bg-neon-primary text-neon-primary'
                }`}></div>
                
                <div className="bg-white/5 border border-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-text-secondary">{log.type}</span>
                    <span className="text-[10px] text-text-secondary/70">{log.time}</span>
                  </div>
                  <p className="text-sm text-white/90 leading-snug">{log.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Cluster Workload */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-white mb-6">Cluster Density & Workload</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clusterData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} width={80} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="load" name="Workload %" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Warnings / Map Placeholder */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-white/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Live Grid Tracking</h3>
              <Link to="/locations" className="text-xs text-neon-primary hover:underline">Open Map</Link>
            </div>
            
            <div className="flex-1 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden group">
              {/* Fake Map Grid */}
              <div className="absolute inset-0 animated-bg-grid opacity-30 pointer-events-none"></div>
              
              {/* Radar sweep effect */}
              <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(99,102,241,0.2)_360deg)] rounded-full animate-[spin_4s_linear_infinite] pointer-events-none origin-center"></div>
              
              {/* Fake markers */}
              <div className="absolute top-[30%] left-[40%] w-3 h-3 bg-neon-accent rounded-full shadow-[0_0_10px_#06B6D4] animate-pulse"></div>
              <div className="absolute top-[60%] left-[20%] w-3 h-3 bg-neon-primary rounded-full shadow-[0_0_10px_#6366F1] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-[45%] left-[70%] w-3 h-3 bg-neon-secondary rounded-full shadow-[0_0_10px_#8B5CF6] animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="bg-background/80 backdrop-blur-md px-6 py-3 rounded-lg border border-neon-primary/30 text-center shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <p className="text-neon-primary font-bold text-sm mb-1">Live Tracking Module</p>
                <p className="text-xs text-text-secondary">Connecting to WebSockets...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tertiary Row: Predictive Analytics */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 mb-8"
      >
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 border border-neon-secondary/30">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={20} className="text-neon-secondary" />
            <h3 className="font-bold text-white text-lg">AI Demand Forecasting</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1' }} />
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Dashboard;