import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../commont/card";
import { Bus, MapPin, Route, Users, Activity, ShieldCheck, Map as MapIcon, Clock } from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview", icon: "fa-solid fa-chart-pie" },
  { key: "fleet", label: "Fleet Status", icon: "fa-solid fa-bus" },
  { key: "routes", label: "Routes & Stops", icon: "fa-solid fa-route" },
  { key: "staff", label: "Staff & Drivers", icon: "fa-solid fa-user-tie" },
  { key: "live", label: "Live Monitor", icon: "fa-solid fa-satellite" },
];

const FleetAlerts = () => {
  return (
    <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
            <i className="fa-solid fa-triangle-exclamation text-orange-500 text-[0.7rem]" />
          </div>
          <h4 className="text-[0.8rem] font-semibold text-gray-800 dark:text-white/80">Vehicle Maintenance</h4>
        </div>
        <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold tracking-wider">
          3 Alerts
        </span>
      </div>
      <div className="p-2 space-y-1">
        {[
            { id: 'B-042', name: 'Engine Check Required', status: 'Warning', color: 'text-orange-500' },
            { id: 'B-108', name: 'Oil Level Low', status: 'Critical', color: 'text-red-500' },
            { id: 'B-015', name: 'Tire Pressure Alert', status: 'Minor', color: 'text-yellow-500' },
        ].map((v) => (
          <div key={v.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <Bus className="w-5 h-5 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.78rem] font-medium text-gray-800 dark:text-white/80 truncate">{v.name}</p>
                <p className="text-[0.6rem] text-gray-400 dark:text-white/30">Vehicle ID: #{v.id}</p>
              </div>
            </div>
            <div className="text-right">
               <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${v.color}`}>{v.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed = () => {
    const logs = [
        { id: 1, action: "Bus Started", details: "Vehicle #12 started Route A", time: "2 mins ago", type: "success" },
        { id: 2, action: "Delay Alert", details: "Route B experiencing 5 min delay", time: "15 mins ago", type: "warning" },
        { id: 3, action: "New Driver", details: "Ahmed Salhi assigned to Bus #08", time: "1 hour ago", type: "info" },
        { id: 4, action: "Stop Modified", details: "Admin modified 'Place de Paris' stop", time: "3 hours ago", type: "update" },
    ];

  return (
    <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/2">
        <h4 className="text-[0.7rem] uppercase tracking-widest font-bold text-gray-500">Live Operations Log</h4>
        <span className="text-[0.6rem] text-gray-400">Updates every 30s</span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {logs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/1 transition-colors flex items-start gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              log.type === 'warning' ? 'bg-orange-50 text-orange-500' : 
              log.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
            }`}>
               <Activity className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[0.75rem] font-bold text-gray-800 dark:text-white/80">{log.action}</p>
                <span className="text-[0.6rem] text-gray-400">{log.time}</span>
              </div>
              <p className="text-[0.68rem] text-gray-500 dark:text-white/40 truncate">{log.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    totalLines: 0,
    totalStops: 0,
    activeDrivers: 0,
    todayPassengers: "0",
    growth: "+0%"
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard_stats.php');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: "Buses in Service", value: stats.activeBuses, sub: `Of ${stats.totalBuses} total vehicles`, status: "online", icon: <Bus /> },
    { title: "Transit Lines", value: stats.totalLines, sub: `${stats.totalStops} managed stops`, status: "active", icon: <Route /> },
    { title: "Daily Ridership", value: stats.todayPassengers, sub: "Based on check-ins", trend: 5.2, icon: <Users /> },
    { title: "Network Status", value: "Optimal", sub: "All systems operational", status: "secure", icon: <Activity /> },
  ];

  return (
    <div className="px-4 py-8 space-y-6 sm:py-5 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-col text-left">
          <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 dark:text-white/40">Transit Control Center</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Admin <span className="text-blue-500">Analytics</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap pointer-events-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-600 dark:text-gray-400 text-xs font-bold transition-all hover:bg-white dark:hover:bg-white/10">
            <Clock className="w-4 h-4" />
             Last sync: Just now
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all">
             Generate System Report
          </button>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 justify-start overflow-x-auto p-1.5 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/5 dark:border-white/5 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-3 px-6 py-3 text-[0.7rem] uppercase tracking-widest font-black transition-all duration-300 rounded-[1.2rem] whitespace-nowrap
              ${tab === t.key
                ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
              }`}
          >
            <i className={`${t.icon} text-sm`}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ CONTENT ══ */}
      <div className="py-4">
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cards.map((c, i) => (
                    <motion.div key={c.title} {...fadeUp(i * 0.1)} className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-6 rounded-4xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">{c.icon}</div>
                          {c.trend && <span className="text-[0.65rem] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+{c.trend}%</span>}
                       </div>
                       <p className="text-[0.65rem] uppercase font-black tracking-widest text-gray-400 mb-1 leading-none text-left">{c.title}</p>
                       <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-none text-left">{c.value}</h3>
                       <p className="text-[0.7rem] text-gray-500 dark:text-white/40 font-medium text-left">{c.sub}</p>
                    </motion.div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                     <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm h-full min-h-[400px] flex flex-col justify-center items-center text-center relative overflow-hidden group">
                        <div className="absolute top-8 left-8 text-left">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white">Transit Network Load</h4>
                            <p className="text-xs text-gray-500">Hourly passenger distribution</p>
                        </div>
                        <Activity className="w-16 h-16 text-blue-500/20 mb-4 animate-pulse" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Visualizing Real-time Matrix...</p>
                        <div className="mt-8 flex gap-2">
                           {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                               <div key={i} className="w-4 bg-blue-600/10 rounded-full h-32 relative overflow-hidden">
                                   <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="absolute bottom-0 w-full bg-blue-500" />
                               </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <FleetAlerts />
                     <ActivityFeed />
                  </div>
               </div>
            </motion.div>
          )}

          {tab !== "overview" && (
            <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="py-20 text-center">
               <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-blue-500" />
               </div>
               <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">Module Under Optimization</h3>
               <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium transition-all">This administrative section is currently being synchronized with the new BusWay 3.1 Fleet Protocol.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
