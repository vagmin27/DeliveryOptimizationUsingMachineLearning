import { create } from 'zustand';

const useLogisticsStore = create((set) => ({
  agents: [],
  clusters: [],
  parcels: [],
  activeRoute: null,
  socketConnected: false,

  setAgents: (agents) => set({ agents }),
  updateAgentLocation: (agentId, coordinates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.id === agentId ? { ...agent, coordinates } : agent
    )
  })),
  
  setClusters: (clusters) => set({ clusters }),
  setParcels: (parcels) => set({ parcels }),
  
  setActiveRoute: (route) => set({ activeRoute: route }),
  setSocketConnected: (status) => set({ socketConnected: status }),
}));

export default useLogisticsStore;
