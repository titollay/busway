import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import PieChart from "../common/pie";
import BarChart from "../common/bar";
// Assuming config is available 2 levels up relative to pages

export default function Fleet() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/bus/busway/backend/api/admin/buses_list.php")
      .then((res) => {
        if (res.data.status === "success") {
          setBuses(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Analytics logic
  const activeBuses = buses.filter((b) => b.id_ligne !== null).length;
  const unassignedBuses = buses.length - activeBuses;
  
  const lineCountMap = {};
  buses.forEach(b => {
    if (b.nom_ligne) {
      lineCountMap[b.nom_ligne] = (lineCountMap[b.nom_ligne] || 0) + 1;
    }
  });

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Fleet Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor and control your total bus assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp} className="lg:col-span-1 min-h-[300px]">
          <PieChart 
            title="Fleet Assignment"
            labels={["Assigned", "Unassigned"]} 
            values={[activeBuses, unassignedBuses]} 
            colorsMap={{"Assigned": "#10B981", "Unassigned": "#F59E0B"}}
            icon="fa-bus"
          />
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-2 min-h-[300px]">
           <BarChart 
             title="Buses per Line"
             labels={Object.keys(lineCountMap)}
             values={Object.values(lineCountMap)}
             color="#3B82F6"
             icon="fa-route"
           />
        </motion.div>
      </div>

      {/* Table */}
      <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buses Database</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-600 rounded-full">{buses.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/20 dark:bg-black/10">
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Reg. Num (Immatriculation)</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Bus ID (Matricule)</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Current Line</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : buses.map((bus, i) => (
                <tr key={bus.id_bus} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 transition-colors dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{bus.immatriculation}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{bus.matricule}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {bus.nom_ligne ? (
                      <span className="flex items-center gap-2"><i className="fa-solid fa-route text-blue-400"></i> {bus.nom_ligne}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {bus.id_ligne ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium border border-green-200">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">Standby</span>
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
