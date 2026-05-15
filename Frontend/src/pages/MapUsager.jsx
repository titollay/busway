import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Clock, MapPin, Activity, Bus, Compass, Layers, Sun, Moon, Eye, EyeOff, Search, LogOut, Settings } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

// --- HELPERS ---
const getRotation = (start, end) => {
  if (!start || !end) return 0;
  return (Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI) + 90;
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const MAP_STYLES = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  sat: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
};

function CameraFollow({ busPos, active }) {
  const map = useMap();
  useEffect(() => {
    if (active && busPos) map.panTo(busPos, { animate: true, duration: 1 });
  }, [busPos, active, map]);
  return null;
}

function SmoothBus({ busData, isSelected, isNight, onSelect }) {
  const markerRef = useRef(null);
  const currentVisualPos = useRef([parseFloat(busData.latitude), parseFloat(busData.longitude)]);
  const [angle, setAngle] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current) return;
    const start = currentVisualPos.current;
    const end = [parseFloat(busData.latitude), parseFloat(busData.longitude)];
    const newAngle = getRotation(start, end);
    if (Math.abs(newAngle - angle) > 1.5) setAngle(newAngle);

    let startTime = null;
    const move = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 500, 1);
      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;
      currentVisualPos.current = [lat, lng];
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      if (progress < 1) animationRef.current = requestAnimationFrame(move);
    };
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationRef.current);
  }, [busData.latitude, busData.longitude]);

  return (
    <Marker 
      ref={markerRef} 
      position={currentVisualPos.current} 
      eventHandlers={{ click: () => onSelect(busData.id_bus) }}
      icon={L.divIcon({
        className: `bus-pro-icon ${isSelected ? 'selected' : ''} ${isNight ? 'is-night' : ''}`,
        html: `<div class="bus-wrapper" style="transform: rotate(${angle}deg);">
                 <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width:36px; height:36px;" />
                 <div class="heading-arrow"></div>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })}
      zIndexOffset={1000}
    />
  );
}

export default function MapUsager() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState({});
  const [stops, setStops] = useState([]);
  const [userPos, setUserPos] = useState([34.685, -1.912]);
  const [mapStyle, setMapStyle] = useState('dark');
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [nearestStop, setNearestStop] = useState(null);
  const [incomingBuses, setIncomingBuses] = useState([]);
  const [searchID, setSearchID] = useState("");
  const [showStops, setShowStops] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("routes");
  const [clickedStop, setClickedStop] = useState(null);
  const [networkPaths, setNetworkPaths] = useState([]);
  const mapRef = useRef(null);

  const hour = new Date().getHours();
  const isNightTime = hour >= 19 || hour < 7;

  useEffect(() => {
    setMapStyle(isNightTime ? 'dark' : 'light');
    const socket = io("http://localhost:4000");
    socket.on("fleet_update", (data) => Array.isArray(data) && setBuses(prev => {
      const next = {...prev}; data.forEach(b => next[b.id_bus] = b); return next;
    }));
    axios.get('/api/bus/get_network.php').then(res => {
        if(res.data.arrets) setStops(res.data.arrets);
        if(res.data.paths) setNetworkPaths(res.data.paths);
    });
    const watchId = navigator.geolocation.watchPosition(p => setUserPos([p.coords.latitude, p.coords.longitude]));
    return () => { socket.disconnect(); navigator.geolocation.clearWatch(watchId); };
  }, [isNightTime]);

  useEffect(() => {
    if (userPos && stops.length > 0) {
      let minDis = Infinity; let closest = null;
      stops.forEach(s => {
        const d = getDistance(parseFloat(userPos[0]), parseFloat(userPos[1]), parseFloat(s.latitude), parseFloat(s.longitude));
        if (d < minDis) { minDis = d; closest = s; }
      });
      setNearestStop(closest);
      if (closest) {
        const list = Object.values(buses).map(bus => {
          const dist = getDistance(bus.latitude, bus.longitude, closest.latitude, closest.longitude);
          const time = Math.round(dist / 0.4);
          let color = "bg-green-500"; let label = "On Time";
          if (time > 10) { color = "bg-orange-500"; label = "Delayed"; }
          if (bus.nom_ligne === "En Arrêt") { color = "bg-red-500"; label = "Stopped"; }
          return { ...bus, distance: dist, eta: time < 1 ? "Arrivée" : `${time} min`, statusLabel: label, statusColor: color };
        });
        setIncomingBuses(list.sort((a,b) => a.distance - b.distance).slice(0, 3));
      }
    }
  }, [userPos, stops, buses]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchID(val);
    if (buses[val]) setSelectedBusId(parseInt(val));
    else if (val === "") setSelectedBusId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const activeBus = selectedBusId ? buses[selectedBusId] : null;

  return (
    <div className={`h-screen w-full relative overflow-hidden ${mapStyle}`}>
      {/* Top Left Menu Button - Hamburger */}
      <div className="absolute top-6 left-6 z-[2000] pointer-events-auto">
         <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-12 h-12 bg-[#8bcaf9] hover:bg-[#64b5f6] rounded-[14px] flex flex-col items-center justify-center gap-[5px] cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all active:scale-95 border border-[#42a5f5]"
         >
            <div className="w-6 h-[3px] bg-[#020A12] rounded-full"></div>
            <div className="w-6 h-[3px] bg-[#020A12] rounded-full"></div>
            <div className="w-6 h-[3px] bg-[#020A12] rounded-full"></div>
         </button>
      </div>

      <div className="absolute top-6 left-24 right-6 z-[1000] flex items-center justify-end pointer-events-none">


         <div className="flex items-center gap-3 pointer-events-auto">
            <div className="bg-[#0B1120]/90 backdrop-blur-3xl px-5 h-12 rounded-[14px] border border-white/10 shadow-2xl flex items-center gap-3 w-64 focus-within:w-80 focus-within:border-blue-500/50 transition-all duration-500 group">
               <Search className={`w-4 h-4 transition-colors ${searchID && buses[searchID] ? 'text-green-500' : 'text-gray-500 group-focus-within:text-blue-400'}`} />
               <input type="text" placeholder="Entrez N° Bus (ex: 1)..." value={searchID} onChange={handleSearch} className="bg-transparent border-none outline-none text-white text-sm font-bold w-full placeholder:text-gray-600 placeholder:font-black tracking-wide" />
            </div>
            <div className="flex gap-3">
               <button 
                  onClick={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')} 
                  className={`w-12 h-12 rounded-[14px] backdrop-blur-3xl flex items-center justify-center transition-all border outline-none ${mapStyle !== 'sat' ? 'bg-[#8bcaf9] border-[#42a5f5] text-[#020A12] shadow-lg' : 'bg-[#0B1120]/90 border-white/10 text-gray-200 hover:text-white hover:border-white/20'}`}
                  title="Changer Mode"
               >
                  {mapStyle === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               <button 
                  onClick={() => setMapStyle('sat')} 
                  className={`w-12 h-12 rounded-[14px] backdrop-blur-3xl flex items-center justify-center transition-all border outline-none ${mapStyle === 'sat' ? 'bg-[#8bcaf9] border-[#42a5f5] text-[#020A12] shadow-lg' : 'bg-[#0B1120]/90 border-white/10 text-gray-200 hover:text-white hover:border-white/20'}`}
                  title="Mode Satellite"
               >
                  <Layers className="w-5 h-5" />
               </button>

               <button 
                  onClick={handleLogout} 
                  className="w-12 h-12 rounded-[14px] backdrop-blur-3xl flex items-center justify-center transition-all border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-400 shadow-xl group/logout"
                  title="Déconnexion"
               >
                  <LogOut className="w-5 h-5 transition-transform group-hover/logout:-translate-x-1" />
               </button>
            </div>
         </div>
      </div>

      <MapContainer center={[34.67, -1.89]} zoom={14} className="h-full w-full" zoomControl={false} ref={mapRef}>
        <TileLayer url={MAP_STYLES[mapStyle]} />
         {showLines && networkPaths.map(path => (
            <Polyline 
               key={`line-${path.id_ligne}`} 
               positions={path.coordinates} 
               pathOptions={{ 
                  color: path.color, 
                  weight: 5, 
                  opacity: 0.8,
                  dashArray: '10, 10',
                  lineJoin: 'round'
               }} 
            />
         ))}
        {showStops && stops.map(stop => (
            <Marker 
               key={`stop-${stop.id_arret}`} 
               position={[parseFloat(stop.latitude), parseFloat(stop.longitude)]} 
               eventHandlers={{
                  click: () => {
                     setClickedStop(stop);
                     setIsSidebarOpen(true);
                  }
               }}
               icon={L.divIcon({ 
                  className: 'stop-marker-v2', 
                  html: `<div class="stop-container">
                           <div class="stop-main-icon" style="background: ${stop.nom_arret.includes('Institution') ? '#ef4444' : '#3b82f6'};">
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><path d="M17 2H7C5.9 2 5 2.9 5 4V19C5 20.1 5.9 21 7 21V23H9V21H15V23H17V21C18.1 21 19 20.1 19 19V4C19 2.9 18.1 2 17 2ZM7 4H17V9H7V4ZM17 19H7V11H17V19ZM15 13H9V15H15V13Z"/></svg>
                           </div>
                           <div class="stop-label-permanent">${stop.nom_arret}</div>
                           <div class="stop-glow-effect"></div>
                        </div>`, 
                  iconSize: [24, 24], 
                  iconAnchor: [12, 12] 
               })} 
               zIndexOffset={500}
            />
        ))}
 
         {/* Premium Sidebar (Replaces Modal) */}
         <AnimatePresence>
            {isSidebarOpen && (
               <>
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsSidebarOpen(false)}
                     className="absolute inset-0 bg-black/40 z-[2000] lg:hidden pointer-events-auto"
                  />
                  
                  <motion.div 
                     initial={{ x: "-100%" }}
                     animate={{ x: 0 }}
                     exit={{ x: "-100%" }}
                     transition={{ type: "spring", damping: 25, stiffness: 200 }}
                     className="absolute top-0 left-0 h-full w-full sm:w-96 bg-[#0B1120] border-r border-white/5 shadow-[30px_0_100px_rgba(0,0,0,0.9)] z-[2001] flex flex-col pointer-events-auto overflow-hidden"
                  >
                     <div className="flex bg-[#1a2b3c] text-white shadow-xl relative z-20">
                         <button 
                             onClick={() => setSidebarTab("routes")}
                             className={`flex-1 py-4 flex flex-col items-center justify-center font-bold text-[10px] uppercase transition-colors ${sidebarTab === 'routes' ? 'border-b-2 border-blue-500 text-blue-400 bg-white/5' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                         >
                             <Search className="w-5 h-5 mb-1" /> Routes
                         </button>
                         <button 
                             onClick={() => setSidebarTab("settings")}
                             className={`flex-1 py-4 flex flex-col items-center justify-center font-bold text-[10px] uppercase transition-colors ${sidebarTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-400 bg-white/5' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                         >
                             <Settings className="w-5 h-5 mb-1" /> Paramètres
                         </button>
                         <button 
                             onClick={() => setIsSidebarOpen(false)} 
                             className="flex-1 py-4 flex flex-col items-center justify-center font-medium opacity-60 hover:opacity-100 hover:bg-white/5 text-[10px] uppercase transition-colors border-l border-white/10"
                         >
                             <i className="fa-solid fa-angles-left text-lg mb-1"></i> Hide
                         </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-5 relative bg-[#020A12]">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        {sidebarTab === 'routes' ? (
                           <div className="w-full relative z-10 mt-2">
                              <div className="flex items-center gap-6 mb-8">
                                 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] shrink-0">
                                    <i className="fa-solid fa-location-dot text-[#42a5f5] text-xl"></i>
                                 </div>
                                 <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Votre prochain arrêt</p>
                                    <h3 className="text-xl font-black text-white tracking-tight leading-none uppercase">{clickedStop ? clickedStop.nom_arret : nearestStop?.nom_arret || "Recherche..."}</h3>
                                 </div>
                              </div>

                              <div className="flex flex-col gap-4">
                                 {incomingBuses.length > 0 ? incomingBuses.map((bus, idx) => (
                                    <motion.div 
                                       key={bus.id_bus}
                                       initial={{ opacity: 0, x: -20 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       transition={{ delay: 0.1 * (idx + 1) }}
                                       onClick={() => setSelectedBusId(bus.id_bus)}
                                       className={`bg-[#0B1120] border rounded-3xl p-5 flex items-center justify-between group transition-all cursor-pointer ${selectedBusId === bus.id_bus ? 'border-blue-500 scale-[1.02] bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}
                                    >
                                       <div className="flex items-center gap-5">
                                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0 transition-transform ${selectedBusId === bus.id_bus ? 'bg-white text-blue-600' : 'bg-[#216cf3] text-white group-hover:scale-105'}`}>
                                             #{bus.id_bus}
                                          </div>
                                          <div className="text-left">
                                             <h4 className="text-sm font-black text-white tracking-wide uppercase">{bus.nom_ligne}</h4>
                                             <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${bus.statusColor.replace('text', 'bg')} shadow-[0_0_8px_currentColor] animate-pulse`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${bus.statusColor}`}>{bus.statusLabel}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <div className={`text-xl font-black leading-none ${selectedBusId === bus.id_bus ? 'text-white' : 'text-[#42a5f5]'}`}>{bus.eta}</div>
                                          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Estimé</div>
                                       </div>
                                    </motion.div>
                                 )) : (
                                    <div className="text-center text-gray-500 mt-10">
                                       <i className="fa-solid fa-spinner fa-spin text-2xl mb-4 text-blue-500"></i>
                                       <p className="text-xs font-bold uppercase">Calcul de l'itinéraire...</p>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <div className="w-full relative z-10 mt-4 flex flex-col gap-8 text-white font-sans px-2">
                              <div>
                                 <h4 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Apparence de la Carte</h4>
                                 
                                 <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-300 font-bold">Mode Sombre</span>
                                    <button 
                                       onClick={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')}
                                       className={`w-11 h-6 rounded-full relative transition-colors ${mapStyle === 'dark' ? 'bg-[#3b82f6]' : 'bg-gray-600'}`}
                                    >
                                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${mapStyle === 'dark' ? 'translate-x-5' : ''}`}></div>
                                    </button>
                                 </div>
                        
                                 <div className="flex items-center justify-between py-3 border-b border-white/5">
                                   <span className="text-sm text-gray-300 font-bold">Mode Satellite</span>
                                   <button 
                                      onClick={() => setMapStyle(mapStyle === 'sat' ? 'dark' : 'sat')}
                                      className={`w-11 h-6 rounded-full relative transition-colors ${mapStyle === 'sat' ? 'bg-[#3b82f6]' : 'bg-gray-600'}`}
                                   >
                                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${mapStyle === 'sat' ? 'translate-x-5' : ''}`}></div>
                                   </button>
                                 </div>
                              </div>
                        
                              <div>
                                 <h4 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Données Géographiques</h4>
                                 
                                 <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-300 font-bold">Ma Position Externe</span>
                                    <button className="w-11 h-6 rounded-full relative transition-colors bg-[#3b82f6]">
                                       <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform translate-x-5 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                    </button>
                                 </div>
                        
                                 <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-300 font-bold">Afficher les lignes (Routes)</span>
                                    <button 
                                       onClick={() => setShowLines(!showLines)}
                                       className={`w-11 h-6 rounded-full relative transition-colors ${showLines ? 'bg-[#3b82f6]' : 'bg-gray-600'}`}
                                    >
                                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showLines ? 'translate-x-5 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}></div>
                                    </button>
                                 </div>

                                 <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-sm text-gray-300 font-bold">Afficher les arrêts (Filtre)</span>
                                    <button 
                                       onClick={() => setShowStops(!showStops)}
                                       className={`w-11 h-6 rounded-full relative transition-colors ${showStops ? 'bg-[#3b82f6]' : 'bg-gray-600'}`}
                                    >
                                       <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${showStops ? 'translate-x-5 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}></div>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>

        {userPos && (
           <Marker 
              position={[parseFloat(userPos[0]), parseFloat(userPos[1])]} 
              icon={L.divIcon({ 
                 className: 'user-marker-pro', 
                 html: `<div class="user-marker-wrapper">
                          <div class="user-vignette">
                             <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                          </div>
                          <div class="user-pulse-ring"></div>
                        </div>`, 
                 iconSize: [32, 32], 
                 iconAnchor: [16, 16] 
              })} 
              zIndexOffset={2000} 
           />
        )}
        {Object.values(buses).map(bus => <SmoothBus key={`bus-pro-${bus.id_bus}`} busData={bus} isSelected={selectedBusId === bus.id_bus} isNight={isNightTime} onSelect={setSelectedBusId} />)}
        <CameraFollow busPos={activeBus ? [activeBus.latitude, activeBus.longitude] : null} active={!!selectedBusId} />
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute top-[88px] right-6 z-1000 flex flex-col gap-3">
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
               if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
               } else {
                  document.exitFullscreen();
               }
            }}
            className="w-12 h-12 bg-[#0B1120]/90 backdrop-blur-xl rounded-[14px] shadow-2xl border border-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
         >
            <i className="fa-solid fa-expand text-lg group-hover:rotate-12 transition-transform"></i>
         </motion.button>

         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
               if(userPos && mapRef.current) {
                  mapRef.current.flyTo(userPos, 16, { duration: 1.5 });
               }
            }}
            className="w-12 h-12 bg-[#0B1120]/90 backdrop-blur-xl rounded-[14px] shadow-2xl border border-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
         >
            <i className="fa-solid fa-location-crosshairs text-lg group-active:scale-125 transition-transform text-blue-500"></i>
         </motion.button>

         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-12 h-12 bg-[#0B1120]/90 backdrop-blur-xl rounded-[14px] shadow-2xl border border-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
         >
            <i className="fa-solid fa-arrows-rotate text-lg group-hover:rotate-180 duration-500 transition-transform"></i>
         </motion.button>
      </div>

      {/* Left-side Map Controls (Moved to Bottom Left) */}
      <div className="absolute bottom-8 left-6 z-[1000] flex flex-col gap-3">
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStops(!showStops)}
            className={`w-12 h-12 backdrop-blur-xl rounded-[14px] shadow-2xl border flex items-center justify-center transition-all group ${showStops ? 'bg-[#8bcaf9] border-[#42a5f5] text-[#020A12] shadow-[0_0_20px_rgba(139,202,249,0.3)]' : 'bg-[#0B1120]/90 border-white/10 text-gray-200 hover:border-white/20 hover:text-white'}`}
         >
            <i className="fa-solid fa-filter text-lg"></i>
         </motion.button>

         <div className="flex flex-col bg-[#0B1120]/90 backdrop-blur-xl rounded-[14px] shadow-2xl border border-white/10 overflow-hidden">
            <motion.button 
               whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
               onClick={() => {
                  const map = mapRef.current;
                  if (map) map.setZoom(map.getZoom() + 1);
               }}
               className="w-12 h-12 flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/5 border-b border-white/10 transition-colors"
            >
               <i className="fa-solid fa-plus text-lg"></i>
            </motion.button>
            <motion.button 
               whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
               onClick={() => {
                  const map = mapRef.current;
                  if (map) map.setZoom(map.getZoom() - 1);
               }}
               className="w-12 h-12 flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/5 border-b border-white/10 transition-colors"
            >
               <i className="fa-solid fa-minus text-lg"></i>
            </motion.button>
            <motion.button 
               whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
               onClick={() => {
                  if (userPos) mapRef.current?.setView(userPos, mapRef.current.getZoom());
               }}
               className="w-12 h-12 flex items-center justify-center text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
            >
               <i className="fa-solid fa-location-arrow text-lg -rotate-45"></i>
            </motion.button>
         </div>
      </div>



      {selectedBusId && (
        <button onClick={() => {setSelectedBusId(null); setSearchID("");}} className="absolute bottom-[350px] right-8 z-1000 bg-red-600/90 backdrop-blur-md text-white px-6 py-4 rounded-[1.8rem] shadow-2xl hover:bg-red-700 transition-all active:scale-90 flex items-center gap-2 font-black uppercase text-[10px]">
           <EyeOff className="w-4 h-4" /> Reset
        </button>
      )}

      <style>{`
        .leaflet-marker-icon { transition: none !important; }
        
        /* New Stop Marker Styles */
        .stop-container { position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
        .stop-main-icon { 
           width: 20px; height: 20px; background: #3b82f6; border: 2.5px solid white; border-radius: 8px; 
           display: flex; align-items: center; justify-content: center; z-index: 2;
           box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 8px rgba(59,130,246,0.6);
           transition: transform 0.3s ease;
        }
        .stop-container:hover .stop-main-icon { transform: scale(1.2) rotate(-5deg); background: #2563eb; }
        .stop-glow-effect { 
           position: absolute; width: 100%; height: 100%; background: rgba(59, 130, 246, 0.25); 
           border-radius: 50%; z-index: 1; animation: stop-pulse 2.5s infinite;
        }
        .stop-label-permanent {
           position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
           background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
           color: white; padding: 2px 8px; border-radius: 6px; font-size: 8px;
           font-weight: 800; white-space: nowrap; border: 1px solid rgba(255,255,255,0.1);
           pointer-events: none; z-index: 10; text-transform: uppercase;
           box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .light .stop-label-permanent { background: rgba(255, 255, 255, 0.9); color: #1e293b; border: 1px solid rgba(0,0,0,0.1); }
        @keyframes stop-pulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(3.2); opacity: 0; } }

        /* User Location Marker */
        .user-marker-wrapper { position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
        .user-vignette { 
           width: 26px; height: 26px; background: #ef4444; border: 2.5px solid white; border-radius: 50%; 
           display: flex; align-items: center; justify-content: center; z-index: 5;
           box-shadow: 0 0 20px rgba(239,68,68,0.8), inset 0 0 8px rgba(255,255,255,0.3);
        }
        .user-pulse-ring { 
           position: absolute; width: 100%; height: 100%; background: rgba(239, 68, 68, 0.4); 
           border-radius: 50%; z-index: 1; animation: user-ping-pro 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes user-ping-pro { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(4.5); opacity: 0; } }

        .bus-pro-icon .bus-wrapper { width: 36px; height: 36px; position: relative; }
        .bus-pro-icon .bus-wrapper img { width: 36px !important; height: 36px !important; }
        .heading-arrow { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 9px solid #3b82f6; }
      `}</style>
    </div>
  );
}