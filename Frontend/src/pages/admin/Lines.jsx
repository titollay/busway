import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BarChart from "./commont/bar";

export default function Lines() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/bus/busway/backend/api/admin/lines_list.php")
      .then((res) => {
        if (res.data.status === "success") {
          setLines(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Transit Lines</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage operational routes and topological data.</p>
        </div>
      </div>

      <div className="w-full min-h-[350px]">
        <motion.div {...fadeUp} className="h-full">
           <BarChart 
             title="Stops per Line"
             labels={lines.map(l => l.nom_ligne)}
             values={lines.map(l => l.stops_count)}
             color="#8B5CF6"
             icon="fa-map-location-dot"
             indexAxis="y"
             maintainAspectRatio={false}
           />
        </motion.div>
      </div>

      {/* Table */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Routes Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/20 dark:bg-black/10">
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold w-24">Code</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Departure</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Arrival</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold text-center">Stops</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading tracking data...</td></tr>
              ) : lines.map((line) => (
                <tr key={line.id_ligne} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 transition-colors dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-black text-purple-600 dark:text-purple-400">{line.nom_ligne}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                     <span className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full border-2 border-green-500"></div> {line.point_depart}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                     <span className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500"></div> {line.point_arrivee}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs rounded-full font-bold">
                       {line.stops_count} Nodes
                    </span>
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
