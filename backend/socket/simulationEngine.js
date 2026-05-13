import DeliveryAgent from '../models/DeliveryAgent.js';
import Parcel from '../models/Parcel.js';

let simulationInterval = null;
let speedMultiplier = 1;
let isRunning = false;

// Mock data tracking for simulation loop
let activeAgents = [];
let pendingParcels = [];

export default function setupSimulationSocket(io) {
  io.on('connection', (socket) => {
    
    socket.on('startSimulation', async () => {
      if (isRunning) return;
      console.log('Simulation Engine: STARTED');
      isRunning = true;
      
      // Load initial state
      activeAgents = await DeliveryAgent.find({ status: 'available' }).limit(15);
      pendingParcels = await Parcel.find({ status: 'pending' }).limit(50);
      
      io.emit('simulationStatus', { isRunning: true, speed: speedMultiplier });

      simulationInterval = setInterval(() => {
        tickSimulation(io);
      }, 2000 / speedMultiplier);
    });

    socket.on('pauseSimulation', () => {
      console.log('Simulation Engine: PAUSED');
      isRunning = false;
      if (simulationInterval) clearInterval(simulationInterval);
      io.emit('simulationStatus', { isRunning: false, speed: speedMultiplier });
    });

    socket.on('setSimulationSpeed', (speed) => {
      console.log(`Simulation Engine: SPEED SET TO ${speed}x`);
      speedMultiplier = speed;
      if (isRunning) {
        clearInterval(simulationInterval);
        simulationInterval = setInterval(() => {
          tickSimulation(io);
        }, 2000 / speedMultiplier);
      }
      io.emit('simulationStatus', { isRunning, speed: speedMultiplier });
    });
  });
}

function tickSimulation(io) {
  if (activeAgents.length === 0 || pendingParcels.length === 0) return;

  // 1. Simulate Agent Movement
  activeAgents.forEach(agent => {
    // Random wiggle (simulating driving)
    const latMove = (Math.random() - 0.5) * 0.005;
    const lngMove = (Math.random() - 0.5) * 0.005;
    
    agent.currentLocation.coordinates[0] += lngMove;
    agent.currentLocation.coordinates[1] += latMove;

    io.emit('agentLocationUpdate', {
      agentId: agent._id,
      coordinates: agent.currentLocation.coordinates,
      status: agent.status
    });
  });

  // 2. Simulate random AI dispatch events
  if (Math.random() > 0.7 && pendingParcels.length > 0) {
    const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    const randomParcel = pendingParcels.pop(); // Remove from pending

    io.emit('aiDispatchLog', {
      type: 'optimization',
      msg: `AI Assigned Parcel ${randomParcel.trackingId} to ${randomAgent.name}. Route distance optimized by 14%.`,
      time: new Date().toLocaleTimeString(),
      agentId: randomAgent._id,
      parcelId: randomParcel._id
    });
  }

  // 3. Simulate Anomalies
  if (Math.random() > 0.95) {
    io.emit('aiDispatchLog', {
      type: 'alert',
      msg: `Traffic Anomaly Detected near Lat: ${activeAgents[0].currentLocation.coordinates[1].toFixed(4)}. Rerouting active assignments.`,
      time: new Date().toLocaleTimeString()
    });
    
    io.emit('smartAlert', {
      id: Date.now(),
      severity: 'high',
      title: 'Traffic Congestion',
      message: 'Unexpected traffic delay affecting Cluster 3.',
      time: new Date().toISOString()
    });
  }
}
