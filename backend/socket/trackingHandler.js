export default function setupTrackingSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Agent joins their specific room
    socket.on('joinAgentRoom', (agentId) => {
      socket.join(`agent_${agentId}`);
      console.log(`Socket ${socket.id} joined agent room: agent_${agentId}`);
    });

    // Admins join tracking room to see all agents
    socket.on('joinTrackingRoom', () => {
      socket.join('admin_tracking');
      console.log(`Socket ${socket.id} joined admin tracking room`);
    });

    // Agent updates location
    socket.on('updateLocation', (data) => {
      // data: { agentId, coordinates: [lng, lat], status }
      
      // In a real app, we would also update the DB here or via an API call
      // DeliveryAgent.findByIdAndUpdate(data.agentId, { currentLocation: { type: 'Point', coordinates: data.coordinates } })

      // Broadcast to admins
      io.to('admin_tracking').emit('agentLocationUpdate', data);
    });

    // Agent status change (e.g. online, offline, busy)
    socket.on('agentStatusChange', (data) => {
      io.to('admin_tracking').emit('agentStatusChanged', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
