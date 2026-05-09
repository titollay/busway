// src/admin/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";
import Card from "../commont/card";
import OrdersStatusChart from "../commont/pie";
import TopProducts, { OrdersByCountryChart } from "../commont/bar";
import LineSalesMonth from "../commont/lineChart";
import LatestOrders from "../commont/tabOrder";
import TopCustomers from "../commont/tabTopCus";
import InvoiceModal from "./InvoiceModal";
const TABS = [
  { key: "overview", label: "Overview", icon: "fa-solid fa-chart-pie" },
  { key: "orders", label: "Orders", icon: "fa-solid fa-cart-shopping" },
  { key: "customers", label: "Customers", icon: "fa-solid fa-users" },
  { key: "products", label: "Products", icon: "fa-solid fa-box" },
  { key: "finance", label: "Finance", icon: "fa-solid fa-coins" },
  { key: "activity", label: "Activity", icon: "fa-solid fa-bolt" },
];

const LowStockAlerts = ({ variants }) => {
  if (!variants || variants.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-[0.7rem]" />
          </div>
          <h4 className="text-[0.8rem] font-semibold text-gray-800 dark:text-white/80">Low Stock Alerts</h4>
        </div>
        <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">
          {variants.length} Items
        </span>
      </div>
      <div className="p-2 space-y-1">
        {variants.map((v) => (
          <div key={v.id_product} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/[0.05] overflow-hidden flex items-center justify-center shrink-0">
                {v.image ? (
                  <img src={`${config.ASSETS_BASE_URL}/${v.image}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-image text-gray-300 dark:text-white/10 text-xs" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[0.78rem] font-medium text-gray-800 dark:text-white/80 truncate">{v.name}</p>
                <p className="text-[0.6rem] text-gray-400 dark:text-white/30">ID: #{v.id_product}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-[0.85rem] font-bold text-gray-900 dark:text-white/90">{v.stock}</span>
                <span className="text-[0.6rem] text-gray-400 dark:text-white/30 uppercase tracking-widest">Left</span>
              </div>
               <div className="h-1 w-16 bg-gray-100 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${(v.stock / 5) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-white/10">
        <Link to="/index/product" className="block text-center py-2 text-[0.65rem] text-[#FC8C06] dark:text-[#FC8C06]/80 font-bold uppercase tracking-widest hover:text-[#d97500] transition-colors">
          View All Inventory →
        </Link>
      </div>
    </div>
  );
};

const ActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/admin/audit-logs.php`)
      .then(r => r.json())
      .then(res => {
        if(res.status === 'success') setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-xs text-gray-400 uppercase tracking-widest">Loading Logs...</div>;

  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
        <h4 className="text-[0.7rem] uppercase tracking-widest font-bold text-gray-500">System Activity Audit</h4>
        <span className="text-[0.6rem] text-gray-400">{logs.length} Recent actions</span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {logs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors flex items-start gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              log.action.includes('DELETE') ? 'bg-red-50 text-red-500' : 
              log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-500'
            }`}>
              <i className={`fa-solid ${
                log.action.includes('DELETE') ? 'fa-trash' : 
                log.action.includes('UPDATE') ? 'fa-pen-to-square' : 'fa-circle-info'
              } text-[0.7rem]`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[0.75rem] font-bold text-gray-800 dark:text-white/80">{log.action}</p>
                <span className="text-[0.6rem] text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              <p className="text-[0.68rem] text-gray-500 dark:text-white/40 truncate">{log.details}</p>
              <p className="text-[0.55rem] text-gray-300 dark:text-white/10 mt-1 uppercase tracking-tighter">IP: {log.ip_address}</p>
            </div>
          </div>
        ))}
        {logs.length === 0 && <div className="p-10 text-center text-xs text-gray-400">No activity recorded yet.</div>}
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
  const { currency } = useSettings();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showInvoiceId, setShowInvoiceId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/admin/dashboard.php`);
        const data = await res.json();
        if (data.status === "success") setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F6FA] dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p
            className="text-xs uppercase tracking-widest text-black/25 dark:text-white/25"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            Loading
          </p>
        </div>
      </div>
    );

  const cards = stats
    ? [
        {
          title: "Staff",
          value: stats.staff,
          sub: `${stats.new_users} new this month`,
          trend: 12,
        },
        {
          title: "Clients",
          value: stats.clients,
          sub: `${stats.new_users} registered recently`,
          trend: 8,
        },
        {
          title: "Orders",
          value: stats.orders,
          sub: `${stats.orders_today} orders today`,
          trend: -3,
        },
        {
          title: "Sales",
          value: `${parseFloat(stats.sales).toLocaleString()} ${currency}`,
          sub: "Total revenue",
          trend: 26,
        },
        {
          title: "Products",
          value: stats.products,
          sub: "Active in catalog",
          trend: 5,
        },
      ]
    : [];

  return (
    <div className="px-4 py-8 space-y-6 sm:py-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-col">
          <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 dark:text-white/40">
            Overview
          </p>
          <h1 className="font-serif text-3xl font-light text-black/70 dark:text-white/80">
            Dashboard
          </h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center text-[0.65rem] text-gray-400 gap-1.5 bg-white/50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/10 hidden sm:flex">
            <a href="/" className="hover:text-orange-500">
              Home
            </a>
            <i className="fa-solid fa-chevron-right text-[0.5rem]"></i>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Dashboard</span>
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-white/10 hidden md:block" />

          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f5f2] dark:bg-white/5 border border-gray-200 dark:border-white/10
              rounded-lg text-gray-600 dark:text-gray-400 text-[0.65rem] tracking-wide hover:border-gray-300
              hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-rotate-right text-[0.55rem]"></i>
            <span className="hidden lg:inline">Refresh</span>
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-[#FE6A08] border-none
              rounded-lg text-white text-[0.65rem] tracking-wide hover:bg-[#d97500] transition-colors"
          >
            <i className="fa-solid fa-plus text-[0.55rem]"></i>
            <span className="hidden lg:inline">New Order</span>
          </button>
        </div>
      </motion.div>
      </motion.div>
      {/* ── Tabs ── */}
      <div className="flex gap-0 justify-center rounded bg-[#FE6A08] dark:bg-[#cc5500]/20 dark:border dark:border-white/5 overflow-x-auto p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2.5 px-6 py-2.5 text-[0.65rem] uppercase tracking-widest font-semibold transition-all duration-300 rounded-lg
              ${
                tab === t.key
                  ? "bg-white text-[#FE6A08] shadow-lg shadow-black/10 scale-[1.02]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
          >
            <i className={`${t.icon} text-[0.7rem]`}></i>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      {/* ══ CONTENT ══ */}
      <div className="py-4">
        <AnimatePresence mode="wait">
          {/* ── OVERVIEW TAB ── */}
          {tab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[0.6rem] tracking-[0.2em] uppercase text-black/30 dark:text-white/30">
                      Loading
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {cards.map((c, i) => (
                      <motion.div key={c.title} {...fadeUp(i * 0.06)}>
                        <Card {...c} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Line Chart — full */}
                  <motion.div {...fadeUp(0.2)}>
                    <LineSalesMonth month={stats.sales_by_month} />
                  </motion.div>

                  {/* Pie | Top Products | Top Customers */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <motion.div {...fadeUp(0.25)}>
                      <OrdersStatusChart orders={stats.orders_by_status} />
                    </motion.div>
                    <motion.div {...fadeUp(0.3)}>
                      <TopProducts products={stats.top_products} />
                    </motion.div>
                    <motion.div {...fadeUp(0.35)}>
                      <TopCustomers customers={stats.top_customers} />
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── ORDERS TAB ── */}
          {tab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Mini KPIs */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Orders",
                      val: stats.orders,
                      icon: "fa-solid fa-cart-shopping",
                      color: "text-orange-500",
                      bg: "bg-orange-50",
                    },
                    {
                      label: "Orders Today",
                      val: stats.orders_today,
                      icon: "fa-solid fa-clock",
                      color: "text-blue-500",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Total Revenue",
                      val: `${parseFloat(stats.sales).toLocaleString()} ${currency}`,
                      icon: "fa-solid fa-coins",
                      color: "text-green-500",
                      bg: "bg-green-50",
                    },
                    {
                      label: "Monthly Sales",
                      val: `${parseFloat(
                        stats.monthly_sales
                      ).toLocaleString()} ${currency}`,
                      icon: "fa-solid fa-chart-line",
                      color: "text-purple-500",
                      bg: "bg-purple-50",
                    },
                  ].map((k, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.06)}
                      className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm p-5"
                    >
                      <div
                        className={`w-9 h-9 ${k.bg} dark:${k.bg} rounded-lg flex items-center justify-center mb-3`}
                      >
                        <i className={`${k.icon} ${k.color} text-sm`}></i>
                      </div>
                      <p className="text-[0.58rem] tracking-widest uppercase text-gray-400 dark:text-[#ececec] mb-1">
                        {k.label}
                      </p>
                      <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-semibold text-gray-900 dark:text-[#ececec] leading-none">
                        {k.val}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Latest Orders full */}
              <motion.div {...fadeUp(0.2)}>
                {stats && <LatestOrders orders={stats.latest_orders} onView={(o) => setShowInvoiceId(o.id_order)} />}
              </motion.div>

              {/* Orders by status + country */}
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <motion.div {...fadeUp(0.25)}>
                    <OrdersStatusChart orders={stats.orders_by_status} />
                  </motion.div>
                  <motion.div {...fadeUp(0.3)}>
                    <OrdersByCountryChart countries={stats.orders_by_country} />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── CUSTOMERS TAB ── */}
          {tab === "customers" && (
            <motion.div
              key="customers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {stats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Total Clients",
                        val: stats.clients,
                        icon: "fa-solid fa-users",
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                      },
                      {
                        label: "Staff Members",
                        val: stats.staff,
                        icon: "fa-solid fa-user-tie",
                        color: "text-purple-500",
                        bg: "bg-purple-50",
                      },
                      {
                        label: "New This Month",
                        val: stats.new_users,
                        icon: "fa-solid fa-user-plus",
                        color: "text-green-500",
                        bg: "bg-green-50",
                      },
                    ].map((k, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.06)}
                        className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm p-5"
                      >
                        <div
                          className={`w-9 h-9 ${k.bg} dark:${k.bg} rounded-lg flex items-center justify-center mb-3`}
                        >
                          <i className={`${k.icon} ${k.color} text-sm`}></i>
                        </div>
                        <p className="text-[0.58rem] tracking-widest uppercase text-gray-400 dark:text-[#ececec] mb-1">
                          {k.label}
                        </p>
                        <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-semibold text-gray-900 dark:text-[#ececec] leading-none">
                          {k.val}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div {...fadeUp(0.2)}>
                    <TopCustomers customers={stats.top_customers} />
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {tab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {stats && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <motion.div {...fadeUp(0)}>
                      <TopProducts products={stats.top_products} />
                    </motion.div>
                    <motion.div {...fadeUp(0.15)}>
                      <LowStockAlerts variants={stats.low_stock} />
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── FINANCE TAB ── */}
          {tab === "finance" && (
            <motion.div
              key="finance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {stats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total Sales",
                        val: `${parseFloat(stats.sales).toLocaleString()} ${currency}`,
                        color: "text-orange-500",
                        bg: "bg-orange-50",
                        icon: "fa-solid fa-sack-dollar",
                      },
                      {
                        label: "Monthly Sales",
                        val: `${parseFloat(
                          stats.monthly_sales
                        ).toLocaleString()} ${currency}`,
                        color: "text-blue-500",
                        bg: "bg-blue-50",
                        icon: "fa-solid fa-chart-line",
                      },
                      {
                        label: "Total Orders",
                        val: stats.orders,
                        color: "text-green-500",
                        bg: "bg-green-50",
                        icon: "fa-solid fa-receipt",
                      },
                      {
                        label: "Orders Today",
                        val: stats.orders_today,
                        color: "text-purple-500",
                        bg: "bg-purple-50",
                        icon: "fa-solid fa-calendar-day",
                      },
                    ].map((k, i) => (
                      <motion.div
                        key={i}
                        {...fadeUp(i * 0.06)}
                        className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm p-5"
                      >
                        <div
                          className={`w-9 h-9 ${k.bg} dark:${k.bg} rounded-lg flex items-center justify-center mb-3`}
                        >
                          <i className={`${k.icon} ${k.color} text-sm`}></i>
                        </div>
                        <p className="text-[0.58rem] tracking-widest uppercase text-gray-400 dark:text-[#ececec] mb-1">
                          {k.label}
                        </p>
                        <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-semibold text-gray-900 dark:text-[#ececec] leading-none">
                          {k.val}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div {...fadeUp(0.2)}>
                    <LineSalesMonth month={stats.sales_by_month} />
                  </motion.div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <motion.div {...fadeUp(0.25)}>
                      <OrdersStatusChart orders={stats.orders_by_status} />
                    </motion.div>
                    <motion.div {...fadeUp(0.3)}>
                      <LatestOrders orders={stats.latest_orders} onView={(o) => setShowInvoiceId(o.id_order)} />
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── ACTIVITY TAB ── */}
          {tab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityFeed />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showInvoiceId && (
          <InvoiceModal
            orderId={showInvoiceId}
            onClose={() => setShowInvoiceId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
