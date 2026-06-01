import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import LiveTrackingMap from '../components/Map/LiveTrackingMap';
import useLogisticsStore from '../store/useLogisticsStore';
import { 
  Play, Pause, FastForward, Activity, 
  Terminal, Cpu, ShieldAlert, CheckCircle2,
  AlertTriangle, Network
} from 'lucide-react';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const SOCKET_URL = process.env.REACT_APP_API_URL || (isLocalhost ? 'http://localhost:5000' : 'https://deliveryoptimizationusingmachinelearning.onrender.com');

const AICommandCenter = () => {
  const { updateAgentLocation } = useLogisticsStore();
  const [socket, setSocket] = useState(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    // Connect Socket
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Command Center connected to telemetry stream');
      newSocket.emit('joinTrackingRoom');
    });

    // Handle incoming simulation state
    newSocket.on('simulationStatus', (status) => {
      setSimRunning(status.isRunning);
      setSimSpeed(status.speed);
    });

    // Handle agent movement updates
    newSocket.on('agentLocationUpdate', (data) => {
      updateAgentLocation(data.agentId, data.coordinates);
    });

    // Handle AI terminal logs
    newSocket.on('aiDispatchLog', (log) => {
      setLogs(prev => [...prev, { ...log, id: Date.now() + Math.random() }].slice(-50)); // Keep last 50 logs
    });

    // Handle smart alerts
    newSocket.on('smartAlert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 5)); // Keep top 5 active alerts
    });

    return () => newSocket.disconnect();
  }, [updateAgentLocation]);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Fetch initial data for the map if empty
  useEffect(() => {
    // In a real app, we'd fetch the initial locations from the API.
    // Assuming backend sets this up when simulation starts.
  }, []);

  const toggleSimulation = () => {
    if (!socket) return;
    if (simRunning) {
      socket.emit('pauseSimulation');
    } else {
      socket.emit('startSimulation');
      // Add a manual startup log
      setLogs(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        msg: 'INITIALIZING AI ROUTING ENGINE. BOOTSTRAPPING K-MEANS CLUSTERS.',
        time: new Date().toLocaleTimeString()
      }]);
    }
  };

  const changeSpeed = (speed) => {
    if (!socket) return;
    socket.emit('setSimulationSpeed', speed);
  };

  return (
    <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto flex flex-col h-screen">
      
      {/* Top Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-widest">
              AI Command <span className="text-neon-primary">Center</span>
            </h1>
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              simRunning ? 'border-neon-accent text-neon-accent bg-neon-accent/10 animate-pulse' : 'border-white/20 text-text-secondary bg-white/5'
            }`}>
              {simRunning ? 'Live' : 'Standby'}
            </div>
          </div>
          <p className="text-text-secondary text-sm font-medium tracking-wide">
            Autonomous Logistics Orchestration System v3.0
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="glass-panel border border-neon-primary/30 rounded-xl p-2 flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
          <button 
            onClick={toggleSimulation}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
              simRunning 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-neon-primary text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]'
            }`}
          >
            {simRunning ? <><Pause size={18} /> PAUSE</> : <><Play size={18} /> INITIATE</>}
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          
          <button 
            onClick={() => changeSpeed(1)}
            className={`p-2 rounded-lg transition-colors ${simSpeed === 1 ? 'bg-white/20 text-white' : 'text-text-secondary hover:text-white'}`}
          >
            1x
          </button>
          <button 
            onClick={() => changeSpeed(2)}
            className={`p-2 rounded-lg transition-colors flex items-center ${simSpeed === 2 ? 'bg-white/20 text-white' : 'text-text-secondary hover:text-white'}`}
          >
            2x <FastForward size={14} className="ml-1" />
          </button>
          <button 
            onClick={() => changeSpeed(5)}
            className={`p-2 rounded-lg transition-colors flex items-center ${simSpeed === 5 ? 'bg-neon-accent/20 text-neon-accent border border-neon-accent/30' : 'text-text-secondary hover:text-white'}`}
          >
            5x <FastForward size={14} className="ml-1" />
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Map & Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
          
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 rounded-2xl relative group overflow-hidden border border-white/10"
          >
            {/* Overlay Map Controls */}
            <div className="absolute top-4 left-4 z-[500] flex gap-2">
              <button 
                onClick={() => setShowHeatmap(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg backdrop-blur-md border transition-all ${
                  !showHeatmap 
                    ? 'bg-neon-primary/20 border-neon-primary text-neon-primary shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                    : 'bg-background/80 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                RADAR VIEW
              </button>
              <button 
                onClick={() => setShowHeatmap(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg backdrop-blur-md border transition-all ${
                  showHeatmap 
                    ? 'bg-neon-secondary/20 border-neon-secondary text-neon-secondary shadow-[0_0_10px_rgba(123,97,255,0.3)]' 
                    : 'bg-background/80 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                DENSITY HEATMAP
              </button>
            </div>
            
            <LiveTrackingMap showHeatmap={showHeatmap} />
            
            {/* Holographic Border Effect */}
            <div className="absolute inset-0 z-[600] pointer-events-none rounded-2xl border-[3px] border-transparent group-hover:border-neon-primary/20 transition-colors duration-500"></div>
          </motion.div>

          {/* Bottom Analytics Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-auto md:h-32 glass-panel border border-white/10 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0">
              <span className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Cpu size={14} className="text-neon-primary" /> Engine Load
              </span>
              <span className="text-xl md:text-2xl font-bold text-white">42.8<span className="text-sm text-text-secondary">%</span></span>
            </div>
            <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0">
              <span className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Network size={14} className="text-neon-secondary" /> Active Clusters
              </span>
              <span className="text-xl md:text-2xl font-bold text-white">14</span>
            </div>
            <div className="flex flex-col justify-center border-r-0 md:border-r border-white/10">
              <span className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Activity size={14} className="text-neon-accent" /> Route Efficiency
              </span>
              <span className="text-xl md:text-2xl font-bold text-neon-accent">+18.5<span className="text-sm">%</span></span>
            </div>
            <div className="flex flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-neon-primary/5 rounded"></div>
              <span className="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 relative z-10 flex items-center gap-1">
                <ShieldAlert size={14} className="text-neon-primary" /> System Health
              </span>
              <span className="text-base md:text-lg font-bold text-neon-primary relative z-10 flex items-center gap-2">
                OPTIMAL <CheckCircle2 size={16} />
              </span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Terminal & Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
          
          {/* Smart Alerts Module */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel border border-white/10 rounded-2xl flex flex-col h-1/3 min-h-0"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2 text-white font-bold tracking-wide">
                <AlertTriangle size={16} className="text-neon-danger" /> 
                SMART ALERTS
              </div>
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {alerts.length} NEW
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <div className="text-text-secondary text-sm text-center mt-4">Monitoring network for anomalies...</div>
                ) : (
                  alerts.map((alert) => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-3 rounded-xl border backdrop-blur-sm ${
                        alert.severity === 'high' 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-yellow-500/10 border-yellow-500/30'
                      }`}
                    >
                      <h4 className={`text-sm font-bold mb-1 ${
                        alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                      }`}>{alert.title}</h4>
                      <p className="text-xs text-white/80">{alert.message}</p>
                      <p className="text-[10px] text-text-secondary mt-2">{alert.time}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* AI Terminal Log */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel border border-neon-primary/20 rounded-2xl flex flex-col flex-1 min-h-0 relative overflow-hidden group"
          >
            {/* Terminal Background Effect */}
            <div className="absolute inset-0 bg-[#050510] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px)', backgroundSize: '100% 3px' }}></div>

            <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-black/40 relative z-10">
              <Terminal size={16} className="text-neon-primary" />
              <span className="text-white font-bold tracking-wide text-sm font-mono">ROOT@NEXROUTE:~/EXECUTION_LOG</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs custom-scrollbar relative z-10">
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 leading-relaxed"
                >
                  <span className="text-text-secondary shrink-0">[{log.time}]</span>
                  <span className={`break-words ${
                    log.type === 'system' ? 'text-neon-secondary font-bold' :
                    log.type === 'alert' ? 'text-neon-danger' :
                    'text-neon-primary'
                  }`}>
                    {log.type === 'optimization' ? '> ' : ''}{log.msg}
                  </span>
                </motion.div>
              ))}
              <div ref={logEndRef} className="h-1 flex items-center mt-2">
                <span className="w-2 h-4 bg-neon-primary animate-pulse inline-block"></span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AICommandCenter;
