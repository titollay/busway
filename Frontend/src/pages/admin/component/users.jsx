import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import styled from "styled-components";
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

  const stats = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7;
    if (day !== 1) {
      startOfWeek.setDate(startOfWeek.getDate() - (day - 1));
    }
    startOfWeek.setHours(0, 0, 0, 0);
    
    let weekCount = 0;
    let monthCount = 0;
    let yearCount = 0;
    
    users.forEach((u) => {
      const d = parseDate(u.created_at);
      if (!d) return;
      
      if (d >= startOfWeek) weekCount++;
      if (d >= startOfMonth) monthCount++;
      if (d >= startOfYear) yearCount++;
    });
    
    return { week: weekCount, month: monthCount, year: yearCount };
  }, [users]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Cette Semaine" count={stats.week} desc="Nouvelles inscriptions au cours des 7 derniers jours." />
        <StatsCard title="Ce Mois" count={stats.month} desc="Nouvelles inscriptions pour le mois en cours." />
        <StatsCard title="Cette Année" count={stats.year} desc="Nouvelles inscriptions pour l'année en cours." />
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

const StyledWrapper = styled.div`
  .card-title {
    color: #111827;
    font-size: 1.5em;
    line-height: normal;
    font-weight: 900;
    margin-bottom: 0.5em;
    transition: all 0.4s ease-out;
  }

  .small-desc {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5em;
    color: #6b7280;
    transition: all 0.4s ease-out;
  }

  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 2.5em;
    height: 2.5em;
    overflow: hidden;
    top: 0;
    right: 0;
    background: #3b82f6;
    border-radius: 0 14px 0 32px;
  }

  .go-arrow {
    margin-top: -6px;
    margin-right: -6px;
    color: white;
    font-weight: bold;
  }

  .card {
    display: block;
    position: relative;
    width: 100%;
    min-height: 140px;
    background-color: #ffffff;
    border-radius: 14px;
    border: 1px solid rgba(226, 232, 240, 0.95);
    padding: 2em 1.5em;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
    font-family: 'DM Sans', sans-serif;
  }

  .card:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: #2563eb;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.4s ease-out;
  }

  .card:hover:before {
    transform: scale(35);
  }

  .card:hover .small-desc {
    color: rgba(255, 255, 255, 0.9);
  }

  .card:hover .card-title {
    color: #ffffff;
  }

  .dark & .card, :global(.dark) & .card {
    background-color: rgba(17, 24, 39, 0.78);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22);
  }
  
  .dark & .card-title, :global(.dark) & .card-title {
    color: #ffffff;
  }

  .dark & .small-desc, :global(.dark) & .small-desc {
    color: #9ca3af;
  }

  .dark & .card:before, :global(.dark) & .card:before {
    background: #3b82f6;
  }
`;

const StatsCard = ({ title, count, desc }) => {
  return (
    <StyledWrapper>
      <div className="card shadow-sm border border-gray-100 dark:border-white/5">
        <p className="card-title">{count} Users</p>
        <p className="small-desc" style={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem', fontSize: '1.1em' }}>{title}</p>
        <p className="small-desc">
          {desc}
        </p>
        <div className="go-corner">
          <div className="go-arrow">→</div>
        </div>
      </div>
    </StyledWrapper>
  );
};
