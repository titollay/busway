import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  useChartHeight,
  useYAxisScale,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { Breadcrumb, Pagination, getPagination } from "../common/adminUi";

const PAGE_SIZE = 6;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
};

const addMonths = (date, amount) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
};

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (date) => date.toLocaleString("fr-FR", { month: "short" });

const Gradient = () => {
  const scale = useYAxisScale();
  const height = useChartHeight();
  const scaledZero = scale?.(0);

  if (scaledZero == null || height == null) return null;

  const ratio = Math.min(1, Math.max(0, scaledZero / height));

  return (
    <defs>
      <linearGradient id="splitColor" x1="0" x2="0" y1="0" y2={height} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="green" stopOpacity={1} />
        <stop offset={`${ratio}`} stopColor="green" stopOpacity={0.1} />
        <stop offset={`${ratio}`} stopColor="red" stopOpacity={0.1} />
        <stop offset="1" stopColor="red" stopOpacity={1} />
      </linearGradient>
    </defs>
  );
};

function PassengerTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0].payload;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-xl dark:border-white/10 dark:bg-gray-950">
      <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
      <p className="mt-1 text-gray-500 dark:text-gray-400">{row.registrations} inscriptions</p>
      <p className={row.uv >= 0 ? "mt-1 font-bold text-green-600" : "mt-1 font-bold text-red-500"}>
        {row.uv >= 0 ? "+" : ""}
        {row.uv} vs mois precedent
      </p>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get("/api/admin/users_list.php")
      .then((res) => {
        if (res.data.status === "success") {
          setUsers(res.data.data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [users.length]);

  const chartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 7 }, (_, index) => {
      const date = addMonths(now, index - 6);
      return {
        key: monthKey(date),
        name: monthLabel(date),
        registrations: 0,
      };
    });

    const monthMap = new Map(months.map((month) => [month.key, month]));

    users.forEach((user) => {
      const date = parseDate(user.created_at);
      if (!date) return;

      const key = monthKey(date);
      if (monthMap.has(key)) {
        monthMap.get(key).registrations += 1;
      }
    });

    return months.map((month, index) => ({
      ...month,
      uv: index === 0 ? month.registrations : month.registrations - months[index - 1].registrations,
    }));
  }, [users]);

  const chartLimit = useMemo(() => {
    const max = Math.max(1, ...chartData.map((row) => Math.abs(row.uv)));
    return Math.ceil(max + 1);
  }, [chartData]);

  const pagination = getPagination(users, page, PAGE_SIZE);

  useEffect(() => {
    if (page !== pagination.safePage) setPage(pagination.safePage);
  }, [page, pagination.safePage]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full">
      <Breadcrumb crumbs={[{ label: "Dashboard", href: "/index" }, { label: "Passengers" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Passenger App Users</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor app usage and passenger accounts.</p>
        </div>
      </div>

      <div className="w-full min-h-[300px]">
        <motion.div
          {...fadeUp}
          className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 transition-colors duration-300 w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">Passenger Registration Trends</h2>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>

          <div className="w-full h-[360px]">
            <AreaChart
              responsive
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              style={{ width: "100%", height: "100%" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width="auto" domain={[-chartLimit, chartLimit]} />
              <Tooltip content={<PassengerTooltip />} />
              <Gradient />
              <Area type="monotone" dataKey="uv" stroke="#000" fill="url(#splitColor)" />
            </AreaChart>
          </div>
        </motion.div>
      </div>

      <motion.div
        {...fadeUp}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300"
      >
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Passengers</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-600 rounded-full">
            {users.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
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
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-gray-400" />
                    Loading user data...
                  </td>
                </tr>
              ) : pagination.rows.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No passenger users found.
                  </td>
                </tr>
              ) : (
                pagination.rows.map((u, i) => (
                  <tr
                    key={u.id_user || i}
                    className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 transition-colors dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-400">#{u.id_user}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {u.nom} {u.prenom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <Pagination
            page={pagination.safePage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            onPageChange={setPage}
            itemLabel="users"
          />
        )}
      </motion.div>
    </div>
  );
}
