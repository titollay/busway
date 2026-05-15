import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation2, 
  Wifi, 
  WifiOff, 
  Power, 
  MapPin, 
  AlertCircle,
  Clock,
  Activity,
  Zap,
  CheckCircle2,
  Bell,
  CloudSun,
  Bus,
  SignalHigh,
  User,
  Radio,
  ThermometerSun
} from "lucide-react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ---------------------------------
// Helper Components & Decorations
// ---------------------------------

const GlassCard = ({ children, className = "", noPadding = false }) => (
  <motion.div 
    whileHover={{ y: -2, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-colors hover:bg-white/[0.05] hover:border-white/[0.12] ${noPadding ? '' : 'p-5'} ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
);

const ParticleGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#3B82F6] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-[pulse_6s_infinite]" />
    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-[pulse_8s_infinite_reverse]" />
    <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
    
    {/* Subtle bus/transport aesthetic lines */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  </div>
);

// ---------------------------------
// Main Component
// ---------------------------------

const GPSConducteur = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null); // {latitude, longitude}
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("--:--:--");
  const [driverName, setDriverName] = useState("Conducteur");
  const [currentTime, setCurrentTime] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  
  const watchId = useRef(null);
  const mapRef = useRef(null);

  // Time & Connectivity
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.nom) setDriverName(user.nom);
    } catch(e) {}

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Center map on location change
  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.latitude, location.longitude], 16, { animate: true });
    }
  }, [location]);

  // 📡 Send position to backend
  const sendPosition = async (lat, lng) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Non authentifié");

      await axios.post('/api/bus/update_position.php', {
        latitude: lat,
        longitude: lng
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const now = new Date();
      setLastUpdate(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setError(null);
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      if (err.response?.status !== 403) {
        setError(err.response?.data?.message || "Erreur de synchronisation avec le serveur");
      }
    }
  };

  // 🚀 Start Tracking
  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError("Le GPS n'est pas supporté par votre appareil");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/gps/start.php', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsTracking(true);
      setError(null);

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: geoSpeed } = position.coords;
          setLocation({ latitude, longitude });
          
          // Calculate speed in km/h (geolocation returns m/s)
          setSpeed(geoSpeed ? Math.round(geoSpeed * 3.6) : 0);
          
          sendPosition(latitude, longitude);
        },
        (err) => {
          setError("Signal GPS perdu ou refusé");
          stopTracking();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'activation (403)");
    }
  };

  // 🛑 Stop Tracking
  const stopTracking = async () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/gps/stop.php', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error(err);
    }

    setIsTracking(false);
    setLocation(null);
    setSpeed(0);
  };

  // Cleanup GPS active
  useEffect(() => {
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  // Ping server periodically even if stationnary
  useEffect(() => {
    let interval;
    if (isTracking && location) {
      interval = setInterval(() => {
        sendPosition(location.latitude, location.longitude);
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, location]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#06132A] to-[#12051F] text-white overflow-hidden font-sans selection:bg-[#3B82F6]/30">
      <ParticleGlow />

      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto p-6 md:p-8">
        
        {/* --- Top Dashboard Bar --- */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <img src="https://ui-avatars.com/api/?name=Driver&background=random&color=fff" alt="Driver" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#22D3EE] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                Conducteur Actif
              </span>
              <h1 className="text-xl font-medium tracking-tight mt-0.5">
                {driverName}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full backdrop-blur-md border ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {isOnline ? <Wifi size={18} strokeWidth={2.5} /> : <WifiOff size={18} strokeWidth={2.5} />}
            </div>
            <button className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
              <Bell size={18} className="text-white/80" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#06132A]"></span>
            </button>
          </div>
        </header>

        {/* --- Central Interaction (Futuristic Button) --- */}
        <div className="flex flex-col items-center justify-center py-6 mb-8 mt-4">
          <div className="relative flex items-center justify-center">
            
            <AnimatePresence>
              {isTracking ? (
                <>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-[3px] border-[#22D3EE] bg-[#22D3EE]/10 pointer-events-none"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#3B82F6]/50 pointer-events-none"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(34,211,238,0.4)] pointer-events-none" />
                </>
              ) : (
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-white/20 bg-white/5 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={isTracking ? stopTracking : startTracking}
              className={`relative z-10 flex flex-col items-center justify-center w-52 h-52 rounded-full border-[6px] transition-all duration-700 overflow-hidden ${
                isTracking 
                  ? "bg-gradient-to-b from-[#0A1A2A] to-[#040A15] border-[#22D3EE] shadow-[inset_0_0_40px_rgba(34,211,238,0.2)]" 
                  : "bg-gradient-to-b from-white/10 to-white/5 border-white/10"
              }`}
            >
              {isTracking && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0 280deg, rgba(34, 211, 238, 0.8) 360deg)' }}
                />
              )}

              {isTracking ? (
                <div className="flex flex-col items-center z-10">
                  <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 mb-3 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                     <Power size={32} className="text-red-500" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-red-500">Désactiver</span>
                </div>
              ) : (
                <div className="flex flex-col items-center z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="p-4 rounded-full mb-3 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <Navigation2 size={40} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white drop-shadow-md">ACTIVER LE GPS</span>
                </div>
              )}
            </motion.button>
          </div>
          
          <div className="mt-8 flex flex-col items-center">
             <div className="flex items-center gap-3">
               <span className="relative flex h-3 w-3">
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTracking ? 'bg-[#22D3EE]' : 'bg-white/30'}`}></span>
                 <span className={`relative inline-flex rounded-full h-3 w-3 ${isTracking ? 'bg-[#22D3EE]' : 'bg-white/30'}`}></span>
               </span>
               <span className={`text-sm font-medium tracking-wide uppercase ${isTracking ? 'text-[#22D3EE]' : 'text-white/40'}`}>
                 {isTracking ? "Transmission Active" : "Système en veille"}
               </span>
             </div>
          </div>
        </div>

        {/* --- High-end Metrics Grid --- */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Main Info Blocks */}
          <GlassCard className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white/50">
              <Activity size={16} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Vitesse Actuelle</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-white">{speed}</span>
              <span className="text-sm font-medium text-white/40 uppercase tracking-wider">km/h</span>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white/50">
               <MapPin size={16} />
               <span className="text-[10px] font-bold tracking-widest uppercase">Ligne Affectée</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
               <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg border border-white/20">
                 <Bus size={20} className="text-white" />
               </div>
               <span className="text-lg font-medium text-white">L01</span>
            </div>
          </GlassCard>

          {/* Coordinate Blocks */}
          <GlassCard className="flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-widest text-[#22D3EE] uppercase opacity-80">Latitude</span>
            <span className="text-lg font-mono text-white/90">
              {location ? location.latitude.toFixed(6) : "---.------"}
            </span>
          </GlassCard>

          <GlassCard className="flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-widest text-[#22D3EE] uppercase opacity-80">Longitude</span>
            <span className="text-lg font-mono text-white/90">
              {location ? location.longitude.toFixed(6) : "---.------"}
            </span>
          </GlassCard>

          {/* System Info Blocks */}
          <GlassCard className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">Synchronisation</span>
              <Radio size={12} className={isTracking ? "text-blue-400" : "text-white/20"} />
            </div>
            <span className="text-sm font-mono text-white/80">{lastUpdate}</span>
          </GlassCard>

          <GlassCard className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">Autonomie</span>
              <Zap size={12} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">3h 45m</span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Sûr</span>
            </div>
          </GlassCard>
        </div>

        {/* --- Optional Mini Map / Context Area --- */}
        <div className="mt-4 mb-20">
           <GlassCard noPadding className="h-40 relative group">
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                <ThermometerSun size={14} className="text-yellow-400" />
                <span className="text-xs font-medium text-white">24°C Dégagé</span>
              </div>
              <div className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                <span className="text-xs font-mono text-white/80">{currentTime}</span>
              </div>
              
              {/* Map background */}
              {location ? (
                <MapContainer 
                  center={[location.latitude, location.longitude]} 
                  zoom={16} 
                  zoomControl={false}
                  attributionControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  ref={mapRef}
                  style={{ height: '100%', width: '100%' }}
                >
                  {/* Premium dark matter tile map */}
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[location.latitude, location.longitude]} icon={L.divIcon({
                    className: 'driver-marker',
                    html: `<div class="w-6 h-6 bg-[#22D3EE] rounded-full border-[3px] border-[#06132A] shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>`
                  })} />
                  <Circle 
                    center={[location.latitude, location.longitude]} 
                    radius={50} 
                    pathOptions={{ color: '#22D3EE', fillColor: '#22D3EE', fillOpacity: 0.1, weight: 1 }} 
                  />
                </MapContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                   <MapPin size={32} className="text-white/50 mb-2" />
                   <span className="text-[10px] uppercase tracking-widest">En attente du signal GPS...</span>
                </div>
              )}
           </GlassCard>
        </div>

        {/* --- Error Toast --- */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed left-6 right-6 bottom-6 bg-red-500/20 backdrop-blur-2xl border border-red-500/40 text-red-100 p-4 rounded-2xl flex items-start gap-4 shadow-2xl z-50"
            >
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed drop-shadow-md">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GPSConducteur;
