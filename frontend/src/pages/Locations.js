import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import LocationService from '../services/location.service';
import Map from '../components/Map';
import '../styles/Locations.css';
import { useToast } from '../components/ToastProvider';
import { FaPlus, FaMapMarkedAlt, FaEdit, FaTrash, FaWarehouse, FaMapPin } from 'react-icons/fa';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [previewLocations, setPreviewLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapCenter, setMapCenter] = useState([22.7196, 75.8577]);
  const [mapZoom, setMapZoom] = useState(10);
  const { notify } = useToast();

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LocationService.getAll();
      const fetchedLocations = response || [];
      setLocations(fetchedLocations);
      
      // Auto-center map if locations exist
      if (fetchedLocations.length > 0) {
        const validLocations = fetchedLocations.filter(loc => 
          loc.latitude && loc.longitude && 
          !isNaN(Number(loc.latitude)) && !isNaN(Number(loc.longitude))
        );
        
        if (validLocations.length > 0) {
          const avgLat = validLocations.reduce((sum, loc) => sum + Number(loc.latitude), 0) / validLocations.length;
          const avgLng = validLocations.reduce((sum, loc) => sum + Number(loc.longitude), 0) / validLocations.length;
          setMapCenter([avgLat, avgLng]);
          setMapZoom(validLocations.length > 1 ? 12 : 15);
        }
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load locations');
      notify('Failed to load locations', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await LocationService.remove(id);
        setLocations(locations.filter(location => location._id !== id));
        setError('');
        notify('Location deleted successfully', 'success');
      } catch (err) {
        const msg = err?.response?.data?.msg || 'Failed to delete location';
        setError(msg);
        notify(msg, 'error');
        console.error('Delete location error:', err?.response?.data || err);
      }
    }
  };

  const handleLocationSelect = ({ latitude, longitude, name }) => {
    setPreviewLocations([{ 
      _id: 'preview', 
      name: name || 'Selected Location', 
      latitude, 
      longitude, 
      demand: 0, 
      isDepot: false 
    }]);
  };

  const getLocationStats = () => {
    const total = locations.length;
    const depots = locations.filter(loc => loc.isDepot).length;
    const deliveryPoints = total - depots;
    const totalDemand = locations.reduce((sum, loc) => sum + (loc.demand || 0), 0);
    
    return { total, depots, deliveryPoints, totalDemand };
  };

  const stats = getLocationStats();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto flex items-center justify-center">
        <div className="animate-pulse text-neon-primary text-xl font-bold flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-neon-primary border-t-transparent rounded-full animate-spin"></div>
          LOADING CLUSTER DATA...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-6 px-4 lg:px-8 max-w-[1800px] mx-auto">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-1">
              Network <span className="text-neon-primary">Clusters</span>
            </h1>
            <p className="text-sm text-text-secondary font-medium tracking-wide">
              Manage Geospatial Nodes & Routing Hubs
            </p>
          </div>
          <Link 
            to="/locations/add" 
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all duration-300 bg-neon-primary text-background hover:shadow-[0_0_15px_rgba(0,245,255,0.5)]"
          >
            <FaPlus />
            ADD NODE
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Nodes</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-neon-primary/10 rounded-xl flex items-center justify-center border border-neon-primary/30">
                <FaMapPin className="text-2xl text-neon-primary" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Depot Hubs</p>
                <p className="text-3xl font-bold text-white">{stats.depots}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/30">
                <FaWarehouse className="text-2xl text-orange-500" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Delivery Points</p>
                <p className="text-3xl font-bold text-white">{stats.deliveryPoints}</p>
              </div>
              <div className="w-12 h-12 bg-neon-accent/10 rounded-xl flex items-center justify-center border border-neon-accent/30">
                <FaMapMarkedAlt className="text-2xl text-neon-accent" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neon-secondary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Demand</p>
                <p className="text-3xl font-bold text-white">{stats.totalDemand}</p>
              </div>
              <div className="w-12 h-12 bg-neon-secondary/10 rounded-xl flex items-center justify-center border border-neon-secondary/30">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-6">
            <FaMapMarkedAlt className="mr-2" />
            {error}
          </div>
        )}
  
        {/* Map Section */}
        {locations.length > 0 && (
          <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-bold text-white tracking-wider">
                Geospatial Topology
              </h2>
            </div>
            <div className="h-96 md:h-[500px] lg:h-[600px]">
              {(() => {
                const allLocations = [...locations, ...previewLocations];
                return (
                  <Map 
                    locations={allLocations} 
                    onLocationSelect={handleLocationSelect}
                    center={mapCenter}
                    zoom={mapZoom}
                    height="100%"
                  />
                );
              })()}
            </div>
          </div>
        )}

        {/* Locations List */}
        {locations.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-12 text-center">
            <div className="w-24 h-24 bg-neon-primary/10 border border-neon-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaMapMarkedAlt className="text-4xl text-neon-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No nodes detected
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Initialize your network topology by adding delivery points or depot hubs.
            </p>
            <Link 
              to="/locations/add" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-neon-primary text-background hover:shadow-[0_0_15px_rgba(0,245,255,0.5)] transition-all"
            >
              <FaPlus />
              Add Initial Node
            </Link>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-bold text-white tracking-wider">
                Node Registry
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Coordinates
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Demand
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-black/20">
                  {locations.map((location) => (
                    <tr 
                      key={location._id} 
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-white">
                            {location.name}
                          </div>
                          {location.address && (
                            <div className="text-xs text-text-secondary mt-1">
                              {location.address}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-neon-secondary font-mono bg-neon-secondary/10 px-2 py-1 rounded inline-block">
                          {Number(location?.latitude ?? 0).toFixed(6)}, {Number(location?.longitude ?? 0).toFixed(6)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {location.isDepot ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-[10px] font-bold uppercase tracking-wider">
                            <FaWarehouse /> HUB
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neon-primary/20 text-neon-primary border border-neon-primary/30 rounded text-[10px] font-bold uppercase tracking-wider">
                            <FaMapPin /> DROP
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white">
                          {location.demand || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link 
                            to={`/locations/edit/${location._id}`} 
                            className="px-3 py-1.5 text-xs font-bold rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </Link>
                          <button
                            className="px-3 py-1.5 text-xs font-bold rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
                            onClick={() => handleDelete(location._id)}
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;