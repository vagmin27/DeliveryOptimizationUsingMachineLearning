import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import HeatmapLayer from './HeatmapLayer';
import useLogisticsStore from '../../store/useLogisticsStore';
import 'leaflet/dist/leaflet.css';
import '../../styles/Map.css';

// Fix Leaflet Default Icon
delete L.Icon.Default.prototype._getIconUrl;

const createAgentIcon = () => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="absolute inset-0 bg-neon-primary rounded-full opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div class="absolute inset-2 bg-neon-primary rounded-full opacity-40 animate-pulse"></div>
        <div class="relative z-10 w-8 h-8 bg-background border-2 border-neon-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.8)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M15 18H9"/><circle cx="17" cy="18" r="2"/></svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

const createParcelIcon = () => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative w-6 h-6 flex items-center justify-center">
        <div class="w-3 h-3 bg-neon-secondary rounded-full shadow-[0_0_10px_rgba(123,97,255,0.8)]"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function LiveTrackingMap({ 
  center = [40.7128, -74.0060], 
  zoom = 12,
  showHeatmap = false 
}) {
  const { agents, parcels } = useLogisticsStore();
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    if (parcels.length > 0) {
      const hData = parcels.map(p => ({
        lat: p.origin.coordinates[1],
        lng: p.origin.coordinates[0],
        weight: p.weight || 1
      }));
      setHeatmapData(hData);
    }
  }, [parcels]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative bg-background">
      {/* Radar Overlay Effect */}
      <div className="absolute inset-0 z-[400] pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(99,102,241,0.3)_360deg)] rounded-full animate-[spin_4s_linear_infinite] origin-center"></div>
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0a0a0f' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          className="map-tiles-dark"
        />

        {showHeatmap && heatmapData.length > 0 && (
          <HeatmapLayer points={heatmapData} />
        )}

        {/* Parcels */}
        {!showHeatmap && parcels.map((parcel, idx) => (
          <Marker 
            key={parcel._id || idx} 
            position={[parcel.origin.coordinates[1], parcel.origin.coordinates[0]]}
            icon={createParcelIcon()}
          >
            <Popup className="futuristic-popup">
              <div className="p-2 text-text-primary">
                <p className="font-bold text-neon-secondary mb-1">Parcel: {parcel.trackingId}</p>
                <p className="text-xs text-text-secondary">Status: {parcel.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Agents */}
        {agents.map((agent, idx) => (
          <Marker 
            key={agent._id || idx} 
            position={[agent.currentLocation.coordinates[1], agent.currentLocation.coordinates[0]]}
            icon={createAgentIcon()}
          >
            <Popup className="futuristic-popup">
              <div className="p-2 text-text-primary min-w-[150px]">
                <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                  <div className="w-2 h-2 rounded-full bg-neon-primary animate-pulse"></div>
                  <p className="font-bold text-white">{agent.name}</p>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <p className="flex justify-between"><span>Status:</span> <span className="text-white capitalize">{agent.status}</span></p>
                  <p className="flex justify-between"><span>Efficiency:</span> <span className="text-neon-accent">{agent.performanceScore}%</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
