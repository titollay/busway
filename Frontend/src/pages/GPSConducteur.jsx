import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation2, Wifi, WifiOff, Power, MapPin, AlertCircle, Clock, Activity, Zap, CheckCircle2, Bell, Bus, Radio, ThermometerSun, Truck, TrafficCone, ShieldAlert 
} from "lucide-react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
  </div>
);

const GPSConducteur = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("--:--:--");
  const [driverName, setDriverName] = useState("Conducteur");
  const [driverImage, setDriverImage] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAlertSending, setIsAlertSending] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  
  const watchId = useRef(null);
  const mapRef = useRef(null);

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
    setIsOnline(navigator.onLine);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        if (user.nom) setDriverName(user.nom);
        if (user.image) setDriverImage(user.image);
      }
    } catch(e) {}

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setView([location.latitude, location.longitude], 16, { animate: true });
    }
  }, [location]);

  const sendPosition = async (lat, lng) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.post('/api/bus/update_position.php', { latitude: lat, longitude: lng }, { headers: { Authorization: `Bearer ${token}` } });
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setError(null);
    } catch (err) {
      if (err.response?.status !== 403) setError("Erreur de synchronisation");
    }
  };

  const handleSendIncident = async (message, type = 'Incident') => {
    setIsAlertSending(true);
    try {
      // Get real driver info from storage
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const driverId = userInfo.id_user || 1; 
      const busNumber = userInfo.numero_bus || "B-402"; // Example fallback

      const response = await axios.post('/api/bus/send_notification.php', {
        id_user: driverId, 
        message: message,
        type: type,
        bus_number: busNumber,
        estimation: "15-20 min" // We can make this dynamic later
      });
      
      if (response.data.status === 'success') {
        setAlertSuccess(true);
        setTimeout(() => setAlertSuccess(false), 3000);
      } else {
        setError("Erreur serveur: " + response.data.message);
      }
    } catch (err) {
      console.error("Notification Error:", err);
      setError("Échec de l'envoi : " + (err.response?.data?.message || err.message));
    } finally { setIsAlertSending(false); }
  };

  const startTracking = async () => {
    if (!navigator.geolocation) { setError("GPS non supporté"); return; }
    try {
      const token = localStorage.getItem('token');
      if (token) await axios.post('/api/gps/start.php', {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsTracking(true);
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, speed: geoSpeed } = position.coords;
          setLocation({ latitude, longitude });
          setSpeed(geoSpeed ? Math.round(geoSpeed * 3.6) : 0);
          sendPosition(latitude, longitude);
        },
        () => { setError("Signal GPS perdu"); stopTracking(); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } catch (err) { setError("Erreur d'activation"); }
  };

  const stopTracking = async () => {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    try {
      const token = localStorage.getItem('token');
      if (token) await axios.post('/api/gps/stop.php', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {}
    setIsTracking(false);
    setLocation(null);
    setSpeed(0);
  };

  return (
    <div className="relative min-h-screen bg-[#040B1A] text-white overflow-hidden font-sans selection:bg-blue-500/30">
      <ParticleGlow />
           <div className="relative z-10 flex flex-col min-h-screen w-full p-6 md:p-12">
        
        {/* --- Header Section --- */}
        <header className="flex items-center justify-start gap-8 mb-16 w-full px-4">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-2xl bg-[#091120]">
                 <img src={driverImage || `https://ui-avatars.com/api/?name=${driverName}&background=0D8ABC&color=fff`} alt="Driver" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
              </div>
            </div>
            <div className="flex flex-col items-start translate-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-pulse"></span>
                <span className="text-[11px] font-black tracking-[0.25em] text-cyan-400/80 uppercase text-left">Conducteur Actif</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-white capitalize text-left leading-none">{driverName}</h1>
            </div>
          </div>
          
          <div className="flex gap-4 items-center ml-6">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => setIsAlertModalOpen(true)} 
              className="relative p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <Bell size={24} className="relative z-10" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-[#040B1A] animate-ping"></span>
            </motion.button>
            
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
            </div>
          </div>
        </header>

        {/* --- Main Dashboard Area --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          
          {/* Left Column: GPS & Map */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col items-center justify-center py-10 bg-white/[0.02] border border-white/5 rounded-[40px] relative overflow-hidden backdrop-blur-sm group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10 group">
                <AnimatePresence>
                  {isTracking && (
                    <>
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: [1.2, 2.2, 1.2], opacity: [0.1, 0.4, 0.1] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                        className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-3xl" 
                      />
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 2.2, opacity: [0, 0.5, 0] }} 
                        transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} 
                        className="absolute -inset-4 rounded-full border-2 border-cyan-400/30" 
                      />
                    </>
                  )}
                </AnimatePresence>
                
                <motion.button 
                  onClick={isTracking ? stopTracking : startTracking} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }} 
                  className={`relative z-20 w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-1000 p-2 
                    ${isTracking 
                      ? 'bg-blue-600 border-[1.5px] border-white/40 shadow-[0_0_100px_rgba(37,99,235,0.4)]' 
                      : 'bg-white/5 border-[1.5px] border-white/10 shadow-inner'}`}
                >
                  <div className={`w-18 h-18 rounded-full flex items-center justify-center mb-5 transition-all duration-500 ${isTracking ? 'bg-white/20 rotate-180' : 'bg-blue-500 shadow-xl shadow-blue-500/30'}`}>
                    {isTracking ? <Power size={36} className="text-white" /> : <Navigation2 size={36} className="fill-white" />}
                  </div>
                  <span className="text-[14px] font-black tracking-[0.35em] uppercase text-white">
                    {isTracking ? "ACTIF" : "DÉMARRER"}
                  </span>
                  <span className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest text-center text-white">
                    {isTracking ? "Position Partagée" : "Prêt pour service"}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl min-h-[350px] group">
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-all z-10 pointer-events-none"></div>
              {location ? (
                <MapContainer center={[location.latitude, location.longitude]} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  <Marker position={[location.latitude, location.longitude]} icon={L.divIcon({ html: `
                    <div class="relative items-center justify-center flex">
                      <div class="absolute w-14 h-14 bg-blue-500/30 rounded-full animate-ping"></div>
                      <div class="w-6 h-6 bg-white rounded-full border-[5px] border-blue-500 shadow-2xl"></div>
                    </div>`, className: '' })} />
                </MapContainer>
              ) : (
                 <div className="w-full h-full bg-white/[0.01] flex flex-col items-center justify-center gap-4">
                    <Radio className="w-10 h-10 text-white/5 animate-pulse" />
                    <span className="text-xs text-white/10 uppercase font-black tracking-[0.4em]">Signal GPS Recherché...</span>
                 </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats & Fleet Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <GlassCard className="p-8 group hover:bg-white/[0.08]">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Zap size={18} />
                    </div>
                    <span className="text-[11px] text-white/40 uppercase font-black tracking-[0.2em] leading-none">Vitesse</span>
                  </div>
                  <div className="mt-8 flex items-baseline gap-3">
                    <span className="text-7xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors duration-500">
                       {speed}
                    </span>
                    <span className="text-sm font-bold text-white/10 uppercase tracking-[0.3em]">km/h</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8 group hover:bg-white/[0.08]">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Bus size={18} />
                    </div>
                    <span className="text-[11px] text-white/40 uppercase font-black tracking-[0.2em] leading-none">Bus / Ligne</span>
                  </div>
                  <div className="mt-8 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-all duration-500">
                       1
                    </div>
                    <div className="flex flex-col">
                       <span className="text-3xl font-black tracking-tight group-hover:text-blue-400 transition-colors">L01</span>
                       <span className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">Sidi Yahya</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="py-6 px-10 border-white/5 ring-1 ring-white/5">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="relative">
                       <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-cyan-400 shadow-[0_0_15px_#22D3EE]' : 'bg-white/10'} transition-all duration-1000 animate-pulse`}></div>
                       {isTracking && <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-40"></div>}
                    </div>
                    <span className="text-[11px] text-white/30 uppercase font-black tracking-[0.3em]">Synchronisation Serveur</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className={`text-xl font-mono font-bold tracking-widest transition-all duration-500 ${isTracking ? 'text-white' : 'text-white/20'}`}>
                       {lastUpdate}
                    </span>
                    <span className="text-[9px] text-cyan-400/50 font-black tracking-widest mt-1 uppercase">Temps Réel</span>
                 </div>
              </div>
            </GlassCard>

            {/* Quick Actions / Notifications Hub Placeholder */}
            <div className="flex flex-col gap-4 flex-1">
               <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.5em] ml-2 mb-2">Centre d'Alertes</h3>
               {[1, 2].map((_, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center gap-5 opacity-40"
                 >
                   <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                      <ShieldAlert size={20} className="text-white/10" />
                   </div>
                   <div className="h-4 w-32 bg-white/5 rounded-full" />
                 </motion.div>
               ))}
            </div>
          </div>

        </div>

        {/* --- Incident Sheet --- */}
        <AnimatePresence>
          {isAlertModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsAlertModalOpen(false)} 
                className="fixed inset-0 bg-[#040B1A]/90 backdrop-blur-xl z-1000" 
              />
              <motion.div 
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                exit={{ y: '100%' }} 
                transition={{ type: 'spring', damping: 35, stiffness: 300, mass: 0.8 }} 
                className="fixed bottom-0 left-0 right-0 bg-[#0B1425] rounded-t-[60px] p-12 pb-16 z-1001 border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.6)]"
              >
                <div className="w-20 h-2 bg-white/10 rounded-full mx-auto mb-12" />
                <div className="flex flex-col gap-3 mb-12 items-center">
                   <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Signaler Incident</h2>
                   <p className="text-sm text-white/30 font-bold tracking-widest uppercase">Canal de communication prioritaire</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {[
                    { id: 'panne', label: 'Panne Technique', icon: <Truck className="w-8 h-8" />, color: 'orange', msg: 'Panne technique sur le bus', type: 'Panne' },
                    { id: 'trafic', label: 'Trafic Intense', icon: <TrafficCone className="w-8 h-8" />, color: 'blue', msg: 'Trafic intense, retard prévu', type: 'Trafic' },
                    { id: 'accident', label: 'Accident Signalé', icon: <ShieldAlert className="w-8 h-8" />, color: 'red', msg: 'Accident signalé', type: 'Accident' }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        handleSendIncident(item.msg, item.type);
                        setIsAlertModalOpen(false);
                      }}
                      className="group relative flex flex-col items-center gap-6 p-10 rounded-[48px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 hover:scale-[1.05] transition-all duration-500"
                    >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl
                         ${item.color === 'orange' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-orange-500/20' : 
                           item.color === 'blue' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-blue-500/20' : 
                           'bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-red-500/20'}`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <span className="text-xl font-black text-white uppercase">{item.label}</span>
                         <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Alerte Immédiate</span>
                      </div>
                    </button>
                   ))}
                </div>
                {alertSuccess && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex items-center justify-center gap-3 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] max-w-md mx-auto">
                     <CheckCircle2 size={24} className="text-emerald-400" />
                     <span className="text-lg text-emerald-400 font-black uppercase tracking-[0.2em]">Transmission Réussie</span>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- Connection Error Toast --- */}
        <AnimatePresence>
          {error && (
            <motion.div 
               initial={{ y: 50, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               exit={{ y: 50, opacity: 0 }}
               className="fixed bottom-12 left-12 right-12 p-6 bg-red-600 rounded-[32px] text-base font-black shadow-[0_20px_50px_rgba(220,38,38,0.3)] z-[250] border-2 border-white/10"
            >
               <div className="flex items-center justify-center gap-4">
                  <AlertCircle size={24} />
                  <span className="uppercase tracking-[0.2em]">{error}</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GPSConducteur;
