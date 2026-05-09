import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, 
  Wifi, 
  WifiOff, 
  Play, 
  Square, 
  MapPin, 
  AlertTriangle,
  Info,
  Clock,
  Battery
} from "lucide-react";
import axios from "axios";

const GPSConducteur = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [status, setStatus] = useState("disponible"); // disponible, en_route, error
  
  const watchId = useRef(null);
  const updateInterval = useRef(null);

  // 📡 Function to send position to backend
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

      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      setError("Échec de synchronisation avec le serveur");
    }
  };

  // 🚀 Start Tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Le GPS n'est pas supporté par votre navigateur");
      return;
    }

    setIsTracking(true);
    setStatus("en_route");

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendPosition(latitude, longitude);
      },
      (err) => {
        setError("Impossible d'accéder à votre position");
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 🛑 Stop Tracking
  const stopTracking = () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    setStatus("disponible");
    setLocation(null);
  };

  useEffect(() => {
    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <div className="driver-container">
      {/* 🔮 Aesthetic Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="noise-overlay"></div>
        <div className="gradient-sphere bottom-[-10%] right-[-10%] w-[500px] h-[500px]"></div>
        <div className="gradient-sphere top-[10%] left-[-5%] w-[300px] h-[300px] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto h-full flex flex-col justify-between px-6 py-12">
        
        {/* ── Header ── */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-blue-500 font-bold uppercase mb-1 block">
              BusWay • Driver Mode
            </span>
            <h1 className="text-2xl font-light text-white leading-tight">
              Console de <br /> <span className="font-bold">Navigation</span>
            </h1>
          </div>
          <motion.div 
            animate={{ scale: isTracking ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${
              isTracking ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-white/40 border border-white/10"
            }`}
          >
            {isTracking ? <Wifi size={20} /> : <WifiOff size={20} />}
          </motion.div>
        </header>

        {/* ── Main Dashboard ── */}
        <main className="grow flex flex-col gap-6">
          
          {/* Status Card */}
          <div className="glass-card p-6 border-l-4 border-blue-500 overflow-hidden relative">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">État du Service</p>
                  <p className={`text-lg font-medium ${isTracking ? "text-blue-400" : "text-white/60"}`}>
                    {isTracking ? "En cours de suivi..." : "Prêt à démarrer"}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Mise à jour</p>
                   <p className="text-xs font-mono text-white/80">{lastUpdate || "--:--:--"}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-white/30 mb-1">
                      <MapPin size={10} />
                      <span className="text-[7px] uppercase tracking-tighter">Latitude</span>
                   </div>
                   <p className="text-sm font-mono text-white/90 truncate">
                      {location ? location.latitude.toFixed(6) : "0.000000"}
                   </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                   <div className="flex items-center gap-2 text-white/30 mb-1">
                      <MapPin size={10} />
                      <span className="text-[7px] uppercase tracking-tighter">Longitude</span>
                   </div>
                   <p className="text-sm font-mono text-white/90 truncate">
                      {location ? location.longitude.toFixed(6) : "0.000000"}
                   </p>
                </div>
             </div>
          </div>

          {/* Action Button Area */}
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <div className="relative">
              <AnimatePresence>
                {isTracking && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-blue-500/20 z-0"
                  />
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isTracking ? stopTracking : startTracking}
                className={`relative z-10 w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_50px_rgba(37,99,235,0.2)] ${
                  isTracking 
                    ? "bg-red-500/10 border-2 border-red-500/40 text-red-500 hover:bg-red-500/20" 
                    : "bg-blue-600 border-2 border-blue-400/30 text-white hover:bg-blue-500"
                }`}
              >
                {isTracking ? (
                  <>
                    <Square fill="currentColor" size={32} />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Arrêter</span>
                  </>
                ) : (
                  <>
                    <Play fill="currentColor" size={32} className="ml-1" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Démarrer</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs text-center leading-relaxed"
              >
                <AlertTriangle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </div>
        </main>

        {/* ── Footer Stats ── */}
        <footer className="grid grid-cols-2 gap-4 mt-auto">
          <div className="glass-card-simple p-4 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
               <Clock size={16} />
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-white/40">Autonomie</span>
                <span className="text-xs text-white/80">3h 45m</span>
             </div>
          </div>
          <div className="glass-card-simple p-4 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-orange-400">
               <Info size={16} />
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-white/40">Vitesse Est.</span>
                <span className="text-xs text-white/80">0 km/h</span>
             </div>
          </div>
          <div className="col-span-2 text-center pt-4">
             <p className="text-[8px] text-white/30 tracking-widest uppercase">
                Veuillez garder cette page ouverte pendant votre service.
             </p>
          </div>
        </footer>

      </div>

      <style>{`
        .driver-container {
          min-height: 100dvh;
          background: #0a0c10;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.4;
          mix-blend-mode: overlay;
        }

        .gradient-sphere {
          position: absolute;
          background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%);
          filter: blur(80px);
          border-radius: 50%;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }

        .glass-card-simple {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        @keyframes pulse-soft {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default GPSConducteur;
