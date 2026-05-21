import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Map, 
  Cpu, 
  Activity, 
  ChevronRight,
  ShieldCheck,
  Globe2,
  Box,
  Truck,
  Route
} from 'lucide-react';

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute inset-0 bg-background animated-bg-grid opacity-20"></div>
    {/* Glowing orbs */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 50, 0],
        y: [0, -50, 0]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-neon-primary/20 blur-[120px]"
    />
    <motion.div 
      animate={{ 
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -100, 0],
        y: [0, 100, 0]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-neon-secondary/20 blur-[150px]"
    />
  </div>
);

const MetricCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel rounded-2xl p-6 border-l-4 border-l-neon-primary hover:border-l-neon-secondary transition-colors duration-300 floating-card"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-lg bg-white/5 text-neon-primary">
        <Icon size={24} />
      </div>
      <h3 className="text-text-secondary font-medium">{title}</h3>
    </div>
    <div className="text-4xl font-display font-bold text-white tracking-wider">
      {value}
    </div>
  </motion.div>
);

const FeatureCard = ({ title, description, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group"
  >
    {/* Hover gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-neon-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 text-neon-primary group-hover:scale-110 transition-transform duration-300">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-neon-primary/30">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center z-10 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-primary/30 bg-neon-primary/10 backdrop-blur-md mb-8"
            >
              <Zap size={16} className="text-neon-primary" />
              <span className="text-sm font-medium text-neon-primary tracking-wide uppercase">AI-Powered Logistics Engine 2.0</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-[1.1]"
            >
              Optimize Delivery With
              <br />
              <span className="text-gradient">Intelligent Routing</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your logistics operations with real-time K-Means clustering, advanced dispatch algorithms, and dynamic route optimization powered by Machine Learning.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                to="/register" 
                className="relative group px-8 py-4 w-full sm:w-auto flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-neon-primary rounded-xl blur-[10px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-full h-full bg-neon-primary text-background font-bold text-lg rounded-xl flex items-center justify-center gap-2 px-8 py-4">
                  Deploy Now <ChevronRight size={20} />
                </div>
              </Link>

              <a 
                href="#demo"
                className="group px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 w-full sm:w-auto"
              >
                <Activity size={20} className="text-neon-secondary group-hover:animate-pulse" /> View Live Matrix
              </a>
            </motion.div>
          </div>
        </div>

        {/* Abstract floating drone/vehicle illustration placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden xl:block absolute right-[5%] top-[25%] pointer-events-none opacity-80"
        >
          <div className="relative w-64 h-64 float-fast">
            <div className="absolute inset-0 border-2 border-neon-primary/30 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border-2 border-neon-secondary/40 rounded-full border-dotted animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-primary">
              <Truck size={64} className="opacity-80" />
            </div>
            {/* Target dots */}
            <div className="absolute -top-2 left-1/2 w-4 h-4 bg-neon-primary rounded-full blur-[2px]" />
            <div className="absolute bottom-1/4 -right-2 w-3 h-3 bg-neon-secondary rounded-full blur-[2px]" />
          </div>
        </motion.div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Route Efficiency" value="+42%" icon={Activity} delay={0.1} />
            <MetricCard title="Fuel Saved" value="18.5k" icon={Zap} delay={0.2} />
            <MetricCard title="Active Nodes" value="2,841" icon={Globe2} delay={0.3} />
            <MetricCard title="AI Decisions" value="99.9%" icon={Cpu} delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 px-4 lg:px-8 relative" id="demo">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
            >
              Enterprise-Grade <span className="text-neon-secondary">Capabilities</span>
            </motion.h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built for high-volume logistics networks. Our architecture handles millions of calculations to find the mathematical optimum.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="K-Means Clustering" 
              description="Dynamically group delivery locations into optimized regions based on geospatial density and agent capacity constraints."
              icon={Map}
              delay={0.1}
            />
            <FeatureCard 
              title="Intelligent Dispatch" 
              description="Assign delivery partners using a multi-factor AI engine evaluating distance, historical performance, and real-time workload."
              icon={Cpu}
              delay={0.2}
            />
            <FeatureCard 
              title="Real-time Telemetry" 
              description="Live tracking using WebSockets with sub-second latency. Monitor your entire fleet's movement on an interactive dashboard."
              icon={Activity}
              delay={0.3}
            />
            <FeatureCard 
              title="Distance Matrix API" 
              description="Integration with premium routing APIs to calculate actual road distance, ETA, and traffic-aware optimal paths."
              icon={Route}
              delay={0.4}
            />
            <FeatureCard 
              title="Predictive Analytics" 
              description="Forecast demand spikes, estimate fuel savings, and visualize parcel density with advanced D3.js and Recharts visualizations."
              icon={Box}
              delay={0.5}
            />
            <FeatureCard 
              title="Bank-Level Security" 
              description="Protected routes, encrypted JWT sessions, and role-based access control ensuring your logistics data remains strictly confidential."
              icon={ShieldCheck}
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Futuristic Terminal CTA */}
      <section className="py-24 px-4 lg:px-8">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel border border-neon-primary/30 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-neon-primary/5 to-transparent pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 relative z-10">
              Ready to initialize your <br className="hidden md:block" />
              <span className="text-neon-primary">Command Center?</span>
            </h2>
            <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto relative z-10">
              Join leading logistics providers using our AI infrastructure to power their delivery networks.
            </p>
            
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-background font-bold text-lg hover:bg-neon-primary hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 relative z-10"
            >
              Start System <Zap size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-text-secondary text-sm">
        <div className="container mx-auto">
          <p>© 2026 NexRoute Systems. All rights reserved. Terminal version 2.4.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;