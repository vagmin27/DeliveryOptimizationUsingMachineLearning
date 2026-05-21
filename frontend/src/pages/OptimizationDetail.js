import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import OptimizationService from '../services/optimization.service';
import Map from '../components/Map';
import '../styles/OptimizationDetail.css';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useToast } from '../components/ToastProvider';
import { useAuth } from '../context/AuthContext';
import { Calendar, Download, BarChart3, Printer, Route, Settings, Clock, Truck } from 'lucide-react';

const OptimizationDetail = () => {
  const { id } = useParams();
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('routes');
  const { notify } = useToast();
  const { currentUser } = useAuth();
  const [useRoadNetwork, setUseRoadNetwork] = useState(false);
  const [routedPolylines, setRoutedPolylines] = useState({});

  useEffect(() => {
    fetchOptimization();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (useRoadNetwork && optimization?.routes) {
      // fetch polylines per route
      (async () => {
        const map = {};
        let successCount = 0;
        let fallbackCount = 0;

        for (let i = 0; i < optimization.routes.length; i++) {
          try {
            const data = await OptimizationService.getRoutedPolyline(id, i);
            map[i] = data.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            if (data.fallback) {
              fallbackCount++;
            } else {
              successCount++;
            }
          } catch (e) {
            console.error('Failed to fetch routed polyline for route', i, e);
            fallbackCount++;
          }
        }

        setRoutedPolylines(map);

        if (successCount > 0 && fallbackCount === 0) {
          // Success toast removed
        } else if (successCount > 0) {
          notify(`Real road routes loaded (${successCount} routes), ${fallbackCount} using straight lines`, 'warning', { autoClose: 3000 });
        } else {
          notify('Using straight-line routes (road network unavailable)', 'warning', { autoClose: 2000 });
        }
      })();
    }
  }, [useRoadNetwork, optimization, id, notify]);

  useEffect(() => {
    if (currentUser?.preferences?.preferRoadNetwork) {
      setUseRoadNetwork(true);
    }
  }, [currentUser]);

  const fetchOptimization = async () => {
    try {
      setLoading(true);
      const response = await OptimizationService.get(id);
      setOptimization(response);
      setError('');
    } catch (err) {
      setError('Failed to load optimization details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!optimization) return;
    
    try {
      const dataStr = JSON.stringify(optimization, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `optimization-${optimization.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      notify('Optimization exported', 'success');
    } catch (e) {
      notify('Export failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="optimization-detail-container">
        <LoadingSkeleton lines={6} />
      </div>
    );
  }

  if (!optimization) {
    return (
      <div className="optimization-detail-container">
        <div className="alert alert-danger">
          {error || 'Optimization not found'}
        </div>
        <Link to="/optimizations" className="btn btn-primary">
          Back to Optimizations
        </Link>
      </div>
    );
  }


return (
  <div className="optimization-detail-container container mx-auto px-6 py-8">
    <div className="optimization-header">
      <div>
        <h1>{optimization.name}</h1>
        <p className="optimization-date flex items-center gap-1.5 text-text-secondary text-sm">
          <Calendar className="w-4 h-4 text-neon-primary" />
          {new Date(optimization.date).toLocaleDateString()}
        </p>
      </div>
      <div className="optimization-actions flex gap-3">
        <button className="btn btn-secondary rounded-lg px-4 py-2 flex items-center gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" /> Export JSON
        </button>
        <Link to={`/optimizations/${optimization._id}/compare`} className="btn btn-info rounded-lg px-4 py-2 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Compare Algorithms
          {optimization.algorithmResults && optimization.algorithmResults.length > 1 && (
            <span className="comparison-badge ml-1 bg-neon-secondary text-white text-[10px] px-1.5 py-0.5 rounded-full">{optimization.algorithmResults.length}</span>
          )}
        </Link>
        <Link to={`/optimizations/${optimization._id}/print`} className="btn btn-outline rounded-lg px-4 py-2 flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Route Sheets
        </Link>
        <Link to="/optimizations" className="btn btn-primary rounded-lg px-4 py-2">
          Back to List
        </Link>
      </div>
    </div>

    <div className="optimization-summary grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="summary-card glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-neon-primary/50 transition-colors" data-aos="fade-up">
        <div className="summary-icon w-12 h-12 bg-neon-primary/10 rounded-xl flex items-center justify-center border border-neon-primary/30">
          <Route className="w-6 h-6 text-neon-primary" />
        </div>
        <div className="summary-content">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Routes</h3>
          <p className="summary-value text-2xl font-bold text-white">{optimization.routes.length}</p>
        </div>
      </div>
      <div className="summary-card glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-neon-secondary/50 transition-colors" data-aos="fade-up" data-aos-delay="50">
        <div className="summary-icon w-12 h-12 bg-neon-secondary/10 rounded-xl flex items-center justify-center border border-neon-secondary/30">
          <Settings className="w-6 h-6 text-neon-secondary" />
        </div>
        <div className="summary-content">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Algorithm</h3>
          <p className="summary-value text-xl font-bold text-white">
            {optimization.selectedAlgorithm
              ? optimization.selectedAlgorithm.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
              : 'Clarke Wright'
            }
          </p>
          {optimization.comparisonRun && (
            <small className="comparison-indicator text-[10px] text-text-secondary mt-0.5 block">Compared {optimization.algorithmResults?.length || 0} algorithms</small>
          )}
        </div>
      </div>
      <div className="summary-card glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-neon-accent/50 transition-colors" data-aos="fade-up" data-aos-delay="100">
        <div className="summary-icon w-12 h-12 bg-neon-accent/10 rounded-xl flex items-center justify-center border border-neon-accent/30">
          <Route className="w-6 h-6 text-neon-accent" />
        </div>
        <div className="summary-content">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Distance</h3>
          <p className="summary-value text-2xl font-bold text-white">
            {useRoadNetwork && routedPolylines && Object.keys(routedPolylines).length > 0
              ? `${optimization.routes.reduce((sum, _, idx) => sum + (((routedPolylines[idx]?.distanceKm) || 0)), 0).toFixed(2)} km`
              : `${Number(optimization?.totalDistance ?? 0).toFixed(2)} km`}
          </p>
        </div>
      </div>
      <div className="summary-card glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-neon-primary/50 transition-colors" data-aos="fade-up" data-aos-delay="150">
        <div className="summary-icon w-12 h-12 bg-neon-primary/10 rounded-xl flex items-center justify-center border border-neon-primary/30">
          <Truck className="w-6 h-6 text-neon-primary" />
        </div>
        <div className="summary-content">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Utilization</h3>
          <p className="summary-value text-xl font-bold text-white">
            {(() => {
              const vehCount = (optimization.vehicles || []).length || 1;
              const used = new Set((optimization.routes || []).map(r => r.vehicle).filter(Boolean)).size;
              return `${used}/${vehCount} used`;
            })()}
          </p>
        </div>
      </div>
    </div>

    <div className="analytics-section mt-6 grid md:grid-cols-4 gap-4" data-aos="fade-up">
      {(() => {
        const routes = optimization.routes || [];
        const distances = routes.map(r => Number((r.distance ?? r.totalDistance) ?? 0));
        const totalStops = routes.reduce((s, r) => s + (r.stops?.length || 0), 0);
        const totalDistance = distances.reduce((a, b) => a + b, 0);
        const avgDistance = routes.length ? (totalDistance / routes.length) : 0;

        // Calculate load efficiency
        const totalCapacity = routes.reduce((sum, route) => {
          const vehicle = optimization.vehicles?.find(v => v._id === route.vehicle);
          return sum + (vehicle?.capacity || 0);
        }, 0);
        const totalLoad = routes.reduce((sum, route) => sum + (route.totalCapacity || 0), 0);
        const loadEfficiency = totalCapacity > 0 ? ((totalLoad / totalCapacity) * 100) : 0;

        // Calculate vehicle utilization
        const usedVehicles = new Set(routes.map(r => r.vehicle).filter(Boolean)).size;
        const totalVehicles = optimization.vehicles?.length || 0;
        const vehicleUtilization = totalVehicles > 0 ? ((usedVehicles / totalVehicles) * 100) : 0;

        return (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Stops</div>
              <div className="text-2xl font-bold">{totalStops}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">Load Efficiency</div>
              <div className="text-2xl font-bold text-green-600">{loadEfficiency.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">{totalLoad}/{totalCapacity} units</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">Vehicle Utilization</div>
              <div className="text-2xl font-bold text-blue-600">{vehicleUtilization.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">{usedVehicles}/{totalVehicles} vehicles</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Distance/Route</div>
              <div className="text-2xl font-bold">{avgDistance.toFixed(2)} km</div>
            </div>
          </>
        );
      })()}
    </div>

    <div className="map-wrapper" data-aos="fade-up">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={useRoadNetwork} onChange={() => setUseRoadNetwork(v => !v)} />
          <span>Use road network (beta)</span>
        </label>
      </div>
      <Map
        locations={optimization.locations || []}
        routes={optimization.routes || []}
        vehicles={optimization.vehicles || []}
        useRoadNetwork={useRoadNetwork}
        routedPolylines={routedPolylines}
        optimizationId={optimization._id}
        onRoutedPolylinesUpdate={(routeIndex, coordinates) => {
          setRoutedPolylines(prev => ({
            ...prev,
            [routeIndex]: coordinates
          }));
        }}
        center={optimization.locations && optimization.locations.length > 0
          ? [optimization.locations[0].latitude, optimization.locations[0].longitude]
          : [22.7196, 75.8577]
        }
        zoom={13}
        height="500px"
      />
    </div>

    <div className="optimization-tabs" data-aos="fade-up">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          Routes
        </button>
        <button
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>
      
      <div className="tabs-content">
        {activeTab === 'routes' && (
          <div className="routes-tab">
            {optimization.routes && optimization.routes.map((route, index) => (
              <div key={index} className="route-card rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Route {index + 1} - {route.vehicleName}</h3>
                <div className="chips flex gap-2 mb-4">
                  <span className="chip flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded text-xs text-text-secondary"><Route className="w-3.5 h-3.5 text-neon-primary" />{Number((route.distance ?? route.totalDistance) ?? 0).toFixed(2)} km</span>
                  <span className="chip flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded text-xs text-text-secondary"><Clock className="w-3.5 h-3.5 text-neon-secondary" />{route.duration ? `${Math.floor(route.duration / 60)} min` : 'N/A'}</span>
                </div>
                <p className="text-sm text-text-secondary mb-1">
                  <strong className="text-white">Total Distance:</strong> {Number((route.distance ?? route.totalDistance) ?? 0).toFixed(2)} km
                </p>
                <p className="text-sm text-text-secondary mb-4">
                  <strong className="text-white">Total Capacity:</strong> {route.totalCapacity}
                </p>
                <div className="route-stops">
                  <h4>Stops</h4>
                  <ol className="stops-list">
                    {route.stops.map((stop, stopIndex) => (
                      <li key={stopIndex}>
                        <span>{stop.locationName}</span>
                        <span>
                          {stop.demand > 0 && <span className="chip stop-chip">Demand: {stop.demand}</span>}
                          {stopIndex === 0 || stopIndex === route.stops.length - 1 ? (
                            <span className="badge stop-chip">Depot</span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="details-section">
              <h3>Optimization Details</h3>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{optimization.name}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>{new Date(optimization.date).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Total Routes</td>
                    <td>{optimization.routes.length}</td>
                  </tr>
                  <tr>
                    <td>Total Distance</td>
                    <td>{Number(optimization?.totalDistance ?? 0).toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <td>Total Stops</td>
                    <td>
                      {optimization.routes.reduce(
                        (total, route) => total + route.stops.length,
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default OptimizationDetail;