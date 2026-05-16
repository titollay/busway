import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  Area as ReArea,
  AreaChart as ReAreaChart,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  useChartHeight,
  useYAxisScale,
} from "recharts";
import Chart from "react-apexcharts";
import { RefreshCw, Users as UsersIcon, Clock, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { ActionButton, Breadcrumb, MetricCard, Pagination, getPagination } from "../common/adminUi";

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
  const [isDark, setIsDark] = useState(false);
  const [page, setPage] = useState(1);
  const [timeRange, setTimeRange] = useState("total");
  const [fleetCount, setFleetCount] = useState(0);
  const [linesCount, setLinesCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/admin/users_list.php")
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
    if (day !== 1) startOfWeek.setDate(startOfWeek.getDate() - (day - 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);

    let weekCount = 0, monthCount = 0, yearCount = 0, dayCount = 0;
    let verifiedCount = 0;
    
    users.forEach((u) => {
      const d = parseDate(u.created_at);
      if (!d) return;
      if (d >= dayStart) dayCount++;
      if (d >= startOfWeek) weekCount++;
      if (d >= startOfMonth) monthCount++;
      if (d >= startOfYear) yearCount++;

      // Simulating "Verified" if tel exists or email is present
      if (u.telephone) verifiedCount++;
    });

    // Calculate growth rate compared to previous month
    const currentMonth = chartData[6]?.registrations || 0;
    const lastMonth = chartData[5]?.registrations || 0;
    const growth = lastMonth === 0 ? 100 : Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
    
    return { 
      today: dayCount, 
      month: monthCount, 
      year: yearCount, 
      verified: verifiedCount,
      pending: users.length - verifiedCount,
      growth: growth > 0 ? `+${growth}%` : `${growth}%`
    };
  }, [users, chartData]);

  const filteredInscriptions = useMemo(() => {
    const now = new Date();
    if (timeRange === "total") return users.length;

    let startLimit = new Date();
    if (timeRange === "day") {
      startLimit.setHours(0, 0, 0, 0);
    } else if (timeRange === "week") {
      const day = now.getDay() || 7;
      startLimit.setDate(now.getDate() - (day - 1));
      startLimit.setHours(0, 0, 0, 0);
    } else if (timeRange === "month") {
      startLimit = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === "year") {
      startLimit = new Date(now.getFullYear(), 0, 1);
    }

    return users.filter((u) => {
      const d = parseDate(u.created_at);
      return d && d >= startLimit;
    }).length;
  }, [users, timeRange]);

  const pagination = getPagination(users, page, PAGE_SIZE);

  useEffect(() => {
    if (page !== pagination.safePage) setPage(pagination.safePage);
  }, [page, pagination.safePage]);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="px-4 md:px-8 w-full relative pb-12 min-h-screen bg-[#f4f6fa] dark:bg-[#0a0a0a] font-['DM_Sans',sans-serif]">
      <div className="w-full space-y-8">
                <div
                    className="max-lg:flex-col max-lg:justify-center max-lg:items-center"
                    style={{
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : `1px solid rgba(0,0,0,0.05)`,
                        padding: "20px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16,
                        marginBottom: "24px"
                    }}
                >
                    <div className="max-lg:w-full max-lg:flex max-lg:justify-center max-lg:mb-2" style={{ flex: 1 }}>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "1.2rem",
                                fontWeight: 900,
                                color: isDark ? "#f1f5f9" : "#1e293b",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                        <div
                            style={{
                                width: 42,
                                height: 42,
                                background: "rgba(37, 99, 235, 0.1)",
                                border: "1px solid rgba(37, 99, 235, 0.2)",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative"
                            }}
                        >
                            <i className="fa-solid fa-users text-blue-600 text-xl" />
                        </div>
                        <span style={{ letterSpacing: "-0.02em" }}>Passagers</span>
                        </h1>
                    </div>

                    <div
                        className="flex max-lg:static max-lg:my-2 absolute left-1/2 -translate-x-1/2 max-lg:left-auto max-lg:translate-x-0"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 14px",
                            background: isDark ? "#111827" : "#ffffff",
                            borderRadius: 20,
                            border: isDark ? "1px solid #374151" : `1px solid #e5e7eb`,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >
                        <span style={{ fontSize: "0.7rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Admin</span>
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: 8, color: isDark ? "#4b5563" : "#94a3b8" }} />
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Passagers</span>
                    </div>

                    <div className="max-lg:w-full max-lg:justify-center flex items-center gap-4 flex-1 justify-end">
                        {/* No action button for users currently */}
                    </div>
                </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          label="Passagers" 
          value={loading ? "..." : filteredInscriptions} 
          helper={`${timeRange === 'total' ? 'Total historique' : 'Nouveaux inscrits'}`}
          icon={UsersIcon} 
          color="blue" 
          filter={{
            value: timeRange,
            options: [
              { label: "Aujourd'hui", value: "day" },
              { label: "Semaine", value: "week" },
              { label: "Mois", value: "month" },
              { label: "Année", value: "year" },
              { label: "Total", value: "total" },
            ]
          }}
          onFilterChange={setTimeRange}
        />
        <MetricCard 
          label="Taux de Croissance" 
          value={loading ? "..." : stats.growth} 
          helper="Vs mois précédent" 
          icon={TrendingUp} 
          color="emerald" 
        />
        <MetricCard 
          label="Profils Vérifiés" 
          value={loading ? "..." : stats.verified} 
          helper="Comptes avec tel." 
          icon={CheckCircle} 
          color="purple" 
        />
        <MetricCard 
          label="Comptes en Attente" 
          value={loading ? "..." : stats.pending} 
          helper="Action requise" 
          icon={AlertCircle} 
          color="amber" 
        />
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Registration Chart */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-8 p-8 rounded-[32px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                Croissance des Passagers
              </h3>
              <p className="text-xs font-bold text-gray-400 mt-1">Historique des 7 derniers mois</p>
            </div>
          </div>
          
          <Chart 
            options={{
              chart: { type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
              colors: ['#2563eb'],
              fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
              dataLabels: { enabled: false },
              stroke: { curve: 'smooth', width: 3 },
              xaxis: { 
                categories: chartData.map(d => d.name),
                labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } },
                axisBorder: { show: false }, axisTicks: { show: false }
              },
              yaxis: { labels: { style: { colors: isDark ? '#94a3b8' : '#64748b' } } },
              grid: { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', strokeDashArray: 4 },
              tooltip: { theme: isDark ? 'dark' : 'light' }
            }}
            series={[{ name: 'Inscriptions', data: chartData.map(d => d.registrations) }]}
            type="area"
            height={320}
          />
        </motion.div>

        {/* Verification Status Gauge */}
        <motion.div 
          variants={fadeUp}
          className="lg:col-span-4 p-8 rounded-[32px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">Qualité des Données</h3>
          
          <Chart 
            options={{
              chart: { type: 'radialBar' },
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 135,
                  hollow: { size: '70%', margin: 15 },
                  track: { background: isDark ? '#1f2937' : '#f1f5f9', strokeWidth: '100%' },
                  dataLabels: {
                    name: { show: true, color: isDark ? '#94a3b8' : '#64748b', fontSize: '12px', fontWeight: 800, offsetY: 0, textAnchor: 'middle' },
                    value: { show: true, color: isDark ? '#f8fafc' : '#1e293b', fontSize: '30px', fontWeight: 900, offsetY: 15, formatter: (val) => `${val}%` }
                  }
                }
              },
              colors: [stats.verified > stats.pending ? '#10b981' : '#3b82f6'],
              labels: ['Profils Vérifiés'],
              stroke: { lineCap: 'round' }
            }}
            series={[users.length ? Math.round((stats.verified / users.length) * 100) : 0]}
            type="radialBar"
            height={300}
          />
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              <span className="text-blue-600 dark:text-blue-400">{stats.verified}</span> passagers ont validé leur téléphone
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/5 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              Engagement Optimal
            </div>
          </div>
        </motion.div>
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
    </div>
  );
}


