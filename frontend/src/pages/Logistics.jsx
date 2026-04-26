import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, MapPinned, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Logistics = () => {
  const [shipments, setShipments] = useState([
    { id: 1, order_id: 'ORD-881', status: 'In Transit', eta: '2026-04-28', lat: 40.7128, lng: -74.0060, dest: 'New York, USA' },
    { id: 2, order_id: 'ORD-902', status: 'In Transit', eta: '2026-04-29', lat: 34.0522, lng: -118.2437, dest: 'Los Angeles, USA' },
    { id: 3, order_id: 'ORD-115', status: 'Delayed', eta: '2026-05-02', lat: 51.5074, lng: -0.1278, dest: 'London, UK' },
    { id: 4, order_id: 'ORD-442', status: 'In Transit', eta: '2026-05-01', lat: 48.8566, lng: 2.3522, dest: 'Paris, France' },
    { id: 5, order_id: 'ORD-309', status: 'In Transit', eta: '2026-04-27', lat: 35.6762, lng: 139.6503, dest: 'Tokyo, Japan' },
  ]);

  // Simulate Live GPS Tracking Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setShipments(current => current.map(ship => ({
        ...ship,
        lat: ship.lat + (Math.random() * 0.2 - 0.1), // Larger movement for visible effect
        lng: ship.lng + (Math.random() * 0.2 - 0.1)
      })));
    }, 2000); // Updates every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight">Global Logistics</h2>
          <p className="text-slate-400 mt-1">Real-time satellite telematics and convoy routing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full pb-6">
        {/* Shipment List (Sidebar) */}
        <div className="glass-panel border-white/5 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[600px] lg:h-full bg-slate-900/50 backdrop-blur-xl">
          <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck size={20} className="text-purple-400" />
              Active Convoys
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="group p-4 rounded-xl bg-black/20 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-white text-sm">{shipment.order_id}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold border ${
                      shipment.status === 'Delayed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {shipment.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1 font-medium">
                     <Clock size={12} className="text-slate-500" />
                     ETA: {shipment.eta}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                     <MapPinned size={12} className="text-slate-500" />
                     Dest: {shipment.dest}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-3 glass-panel border-white/5 rounded-2xl shadow-2xl overflow-hidden relative h-[600px] lg:h-full p-2 bg-slate-900/50 backdrop-blur-xl z-0">
          <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 relative z-0">
             <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; CARTO'
               />
               {shipments.map(ship => (
                 <Marker key={ship.id} position={[ship.lat, ship.lng]}>
                   <Popup>
                     <div className="font-bold text-slate-800">{ship.order_id}</div>
                     <div className="text-xs text-slate-500">Destination: {ship.dest}</div>
                     <div className="text-xs text-blue-600 font-bold mt-1">Status: {ship.status}</div>
                   </Popup>
                 </Marker>
               ))}
             </MapContainer>
             
             {/* UI Map Overlay */}
             <div className="absolute top-4 left-4 glass-panel border border-white/10 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md text-xs font-bold text-white shadow-2xl flex items-center gap-3 z-[1000]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                LIVE SATELLITE TRACKING
             </div>
             
             <div className="absolute bottom-4 right-4 glass-panel border border-white/10 bg-black/60 px-4 py-3 rounded-xl backdrop-blur-md text-xs font-bold text-slate-300 shadow-2xl z-[1000] flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" /> SECURE LINK
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="font-mono text-purple-400 animate-pulse">UPDATING COORDS...</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
