import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PieChart from "../common/pie";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/bus/busway/backend/api/admin/drivers_list.php")
      .then((res) => {
        if (res.data.status === "success") {
          setDrivers(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeDrivers = drivers.filter(d => parseInt(d.gps_active) === 1).length;
  const inactiveDrivers = drivers.length - activeDrivers;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Driver Personnel</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time driver shift and GPS tracking overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} className="lg:col-span-1 min-h-[300px]">
          <PieChart 
            title="GPS Transmission Status"
            labels={["Transmitting (Active)", "Offline"]} 
            values={[activeDrivers, inactiveDrivers]} 
            colorsMap={{"Transmitting (Active)": "#10B981", "Offline": "#EF4444"}}
            icon="fa-satellite-dish"
          />
        </motion.div>
        
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-linear-to-br from-blue-600 to-indigo-800 rounded-2xl shadow-sm border border-white/10 p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <i className="fa-solid fa-users text-[15rem] -mt-10 -mr-10"></i>
          </div>
          <h2 className="text-4xl font-black mb-2">{drivers.length}</h2>
          <p className="text-blue-100 uppercase tracking-widest text-sm font-semibold mb-6">Total Employed Drivers</p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <span className="block text-xs text-blue-200 uppercase tracking-wider mb-1">On Shift</span>
              <span className="text-xl font-bold">{activeDrivers}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <span className="block text-xs text-blue-200 uppercase tracking-wider mb-1">Resting</span>
              <span className="text-xl font-bold">{inactiveDrivers}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Drivers Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/20 dark:bg-black/10">
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Matricule</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Name</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Email Contact</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Live GPS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading personnel data...</td></tr>
              ) : drivers.map((driver, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 transition-colors dark:hover:bg-white/5 group">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200">#{driver.matricule}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                           {driver.nom[0]}{driver.prenom[0]}
                        </div>
                        <span className="capitalize">{driver.nom} {driver.prenom}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{driver.email}</td>
                  <td className="px-6 py-4">
                    {parseInt(driver.gps_active) === 1 ? (
                      <span className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-wider">
                         <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                         </span>
                         Tracking Signal
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                         <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                         Offline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
