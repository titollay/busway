import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Clock, MapPin, Activity, Bus, Compass, Layers, Sun, Moon, Eye, EyeOff, Search, LogOut } from "lucide-react";
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

  const hour = new Date().getHours();
  const isNightTime = hour >= 19 || hour < 7;

  useEffect(() => {
    setMapStyle(isNightTime ? 'dark' : 'light');
    const socket = io("http://localhost:4000");
    socket.on("fleet_update", (data) => Array.isArray(data) && setBuses(prev => {
      const next = {...prev}; data.forEach(b => next[b.id_bus] = b); return next;
    }));
    axios.get('/api/bus/get_network.php').then(res => res.data.arrets && setStops(res.data.arrets));
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
      <div className="absolute top-6 left-6 right-6 z-1000 flex items-center justify-between pointer-events-none">
         <div className="flex items-center gap-4 bg-black/80 backdrop-blur-3xl p-2.5 rounded-[2.5rem] border border-white/10 shadow-2xl pointer-events-auto group text-left">
            <div onClick={() => setSelectedBusId(null)} className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-90 overflow-hidden relative">
               <img src={logo} alt="BusWay Logo" className="w-11 h-11 object-contain relative z-10" />
               <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="pr-6">
               <h1 className="text-2xl font-black tracking-tight text-white leading-none">Bus<span className="text-blue-500">Way</span></h1>
               <div className="flex items-center gap-2 mt-1.5 ml-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">Suivi en direct</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-3xl px-6 py-4 rounded-4xl border border-white/10 shadow-2xl flex items-center gap-4 w-64 focus-within:w-80 focus-within:border-blue-500/50 transition-all duration-500 group">
               <Search className={`w-5 h-5 transition-colors ${searchID && buses[searchID] ? 'text-green-500' : 'text-gray-500 group-focus-within:text-blue-400'}`} />
               <input type="text" placeholder="Entrez N° Bus (ex: 1)..." value={searchID} onChange={handleSearch} className="bg-transparent border-none outline-none text-white text-sm font-bold w-full placeholder:text-gray-600 placeholder:font-black tracking-wide" />
            </div>
            <div className="flex gap-2">
               {/* Bouton Toggle Dark/Light */}
               <button 
                  onClick={() => setMapStyle(mapStyle === 'dark' ? 'light' : 'dark')} 
                  className={`w-14 h-14 rounded-3xl backdrop-blur-3xl flex items-center justify-center transition-all border outline-none ${mapStyle !== 'sat' ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/80 border-white/10 text-gray-400'}`}
                  title="Changer Mode (Sombre/Clair)"
               >
                  {mapStyle === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>

               {/* Bouton Satellite (Indépendant) */}
               <button 
                  onClick={() => setMapStyle('sat')} 
                  className={`w-14 h-14 rounded-3xl backdrop-blur-3xl flex items-center justify-center transition-all border outline-none ${mapStyle === 'sat' ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/80 border-white/10 text-gray-400'}`}
                  title="Mode Satellite"
               >
                  <Layers className="w-5 h-5" />
               </button>

               <button 
                  onClick={handleLogout} 
                  className="w-14 h-14 rounded-3xl backdrop-blur-3xl flex items-center justify-center transition-all border bg-red-600/10 border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-400 shadow-xl group/logout"
                  title="Déconnexion"
               >
                  <LogOut className="w-5 h-5 transition-transform group-hover/logout:-translate-x-1" />
               </button>
            </div>
         </div>
      </div>

      <MapContainer center={[34.685, -1.912]} zoom={14} className="h-full w-full" zoomControl={false}>
        <TileLayer url={MAP_STYLES[mapStyle]} />
        {stops.map(stop => (
           <Marker 
              key={`stop-${stop.id_arret}`} 
              position={[parseFloat(stop.latitude), parseFloat(stop.longitude)]} 
              icon={L.divIcon({ 
                 className: 'stop-marker-v2', 
                 html: `<div class="stop-container">
                          <div class="stop-main-icon">
                             <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><path d="M17 2H7C5.9 2 5 2.9 5 4V19C5 20.1 5.9 21 7 21V23H9V21H15V23H17V21C18.1 21 19 20.1 19 19V4C19 2.9 18.1 2 17 2ZM7 4H17V9H7V4ZM17 19H7V11H17V19ZM15 13H9V15H15V13Z"/></svg>
                          </div>
                          <div class="stop-glow-effect"></div>
                        </div>`, 
                 iconSize: [24, 24], 
                 iconAnchor: [12, 12] 
              })} 
              zIndexOffset={500}
           >
              <Popup><b className="text-[10px] uppercase font-black">{stop.nom_arret}</b></Popup>
           </Marker>
        ))}
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-1000 w-[92%] max-w-sm">
           <div className={`bg-black/90 backdrop-blur-3xl border rounded-[2.5rem] p-7 shadow-2xl transition-all duration-700 ${selectedBusId ? 'border-blue-500/40' : 'border-white/5'}`}>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center"><MapPin className="text-blue-500 w-6 h-6" /></div>
                 <div className="text-left">
                    <p className="text-gray-500 text-[0.6rem] font-black uppercase mb-1 leading-none tracking-[0.2em]">Votre prochain arrêt</p>
                    <h2 className="text-white text-md font-black tracking-tight uppercase leading-tight">{nearestStop?.nom_arret || "Localisation..."}</h2>
                 </div>
              </div>
              <div className="space-y-3">
                 {incomingBuses.map((bus) => (
                    <div key={bus.id_bus} onClick={() => setSelectedBusId(bus.id_bus)} className={`flex items-center justify-between p-4 rounded-[1.8rem] border cursor-pointer transition-all duration-500 ${selectedBusId === bus.id_bus ? 'bg-blue-600 border-blue-400 translate-x-2 shadow-lg' : 'bg-white/5 border-white/5'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs ${selectedBusId === bus.id_bus ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>#{bus.id_bus}</div>
                          <div className="text-left">
                             <p className={`text-[11px] font-black uppercase ${selectedBusId === bus.id_bus ? 'text-white' : 'text-gray-200'}`}>{bus.nom_ligne}</p>
                             <div className="flex items-center gap-2 mt-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${bus.statusColor} animate-pulse`}></div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${selectedBusId === bus.id_bus ? 'text-blue-200' : 'text-gray-500'}`}>{bus.statusLabel}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-lg font-black tracking-tighter ${selectedBusId === bus.id_bus ? 'text-white' : 'text-blue-500'}`}>{bus.eta}</div>
                          <p className={`text-[0.5rem] font-bold uppercase tracking-widest ${selectedBusId === bus.id_bus ? 'text-white/40' : 'text-gray-600'}`}>Estimé</p>
                       </div>
                    </div>
                 ))}
              </div>
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