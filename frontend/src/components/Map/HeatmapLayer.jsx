import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Convert points to [lat, lng, intensity]
    const heatData = points.map(p => [p.lat, p.lng, p.weight || 1.0]);

    const heatLayer = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 15,
      max: 4.0,
      gradient: {
        0.4: '#7B61FF', // neon-secondary
        0.6: '#00F5FF', // neon-primary
        0.8: '#39FF14', // neon-accent
        1.0: '#FF003C'  // neon-danger
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
