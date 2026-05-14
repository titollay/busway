import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BarChart from "../common/bar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost/bus/busway/backend/api/admin/users_list.php")
      .then((res) => {
        if (res.data.status === "success") {
          setUsers(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Analytics for registrations over time (simulated via parsing created_at)
  const monthMap = {};
  users.forEach(u => {
     if(u.created_at) {
        const date = new Date(u.created_at);
        const m = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
        monthMap[m] = (monthMap[m] || 0) + 1;
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
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Passenger App Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor app usage and passenger accounts.</p>
        </div>
      </div>

      <div className="w-full min-h-[300px]">
        <motion.div {...fadeUp} className="h-full">
           <BarChart 
             title="Registration Trends"
             labels={Object.keys(monthMap).length ? Object.keys(monthMap) : ["No Data"]}
             values={Object.keys(monthMap).length ? Object.values(monthMap) : [0]}
             color="#F59E0B"
             icon="fa-users"
           />
        </motion.div>
      </div>

      {/* Table */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Passengers</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-600 rounded-full">{users.length} Users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/20 dark:bg-black/10">
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold w-16">ID</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Name</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Email</th>
                <th className="text-[0.65rem] tracking-[0.15em] uppercase text-gray-400 px-6 py-4 font-semibold">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading user data...</td></tr>
              ) : users.map((u, i) => (
                <tr key={u.id_user || i} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 transition-colors dark:hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-400">#{u.id_user}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">{u.nom} {u.prenom}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                     {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
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
