import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Search,
  RefreshCw,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Loader from "../../../components/Loader";

const ITEMS_PER_PAGE = 8;

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all");
  const [search, setSearch]               = useState("");
  const [isDark, setIsDark]               = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage]   = useState(1);
  const [pagination, setPagination]     = useState(null); // meta from API
  const [totalUnread, setTotalUnread]   = useState(0);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Fetch with page
  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/admin/get_notifications.php?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.data.success) {
        setNotifications(response.data.data);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count separately (page=1, no limit needed — just read meta)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/get_notifications.php?page=1&limit=1`);
      if (res.data.success) {
        // We'll track unread from current loaded notifs
        // This is a local approximation; for exact count use a dedicated endpoint
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Recompute unread from current page notifs
  const unreadCount = notifications.filter((n) => Number(n.lu) === 0).length;

  const markAsRead = async (id) => {
    try {
      await axios.post("/api/admin/mark_notification_read.php", { id_notification: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id_notification === id ? { ...n, lu: 1 } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.post("/api/admin/delete_notification.php", { id_notification: id });
      // Refetch current page (count changed)
      await fetchNotifications(currentPage);
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "danger":  return <AlertTriangle className="text-red-500"    size={18} />;
      case "warning": return <AlertTriangle className="text-amber-500"  size={18} />;
      case "success": return <CheckCircle   className="text-emerald-500" size={18} />;
      default:        return <Info          className="text-blue-500"   size={18} />;
    }
  };

  // Client-side filter/search on current page
  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch = n.message?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "unread" && Number(n.lu) === 0);
    return matchesSearch && matchesFilter;
  });

  // ─── Pagination helpers ───────────────────────────────────────────────
  const goToPage = (p) => {
    if (!pagination) return;
    const clamped = Math.max(1, Math.min(p, pagination.totalPages));
    if (clamped !== currentPage) fetchNotifications(clamped);
  };

  const pageNumbers = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const cur   = currentPage;
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, cur - delta);
      i <= Math.min(total, cur + delta);
      i++
    ) range.push(i);

    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < total - 1) range.push("...");
    if (range[range.length - 1] !== total) range.push(total);
    return range;
  };

  // ─── Styles ──────────────────────────────────────────────────────────
  const pageBtnBase =
    "flex items-center justify-center w-9 h-9 rounded-xl text-xs font-black transition-all select-none";

  return (
    <div className="px-4 md:px-8 w-full relative pb-16 min-h-screen">
      {loading && notifications.length === 0 && <Loader />}

      {/* ── Header ── */}
      <div
        className="max-lg:flex-col max-lg:justify-center max-lg:items-center"
        style={{
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(0,0,0,0.05)",
          padding: "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: "32px",
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
                width: 42, height: 42,
                background: "rgba(37, 99, 235, 0.1)",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}
            >
              <Bell className="text-blue-600 text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]" />
              )}
            </div>
            <span style={{ letterSpacing: "-0.02em" }}>Centre de Notifications</span>
          </h1>
        </div>

        {/* Breadcrumb */}
        <div className="flex max-lg:static max-lg:my-2 absolute left-1/2 -translate-x-1/2 max-lg:left-auto max-lg:translate-x-0"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 14px",
            background: isDark ? "#111827" : "#ffffff",
            borderRadius: 20,
            border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Admin</span>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: 8, color: isDark ? "#4b5563" : "#94a3b8" }} />
          <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Notifications</span>
        </div>

        <div className="max-lg:w-full flex items-center justify-end flex-1 gap-3">
          <button
            onClick={() => fetchNotifications(currentPage)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Filters & Search ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit border border-gray-200 dark:border-white/5 shadow-inner">
            <button
              onClick={() => { setFilter("all"); setCurrentPage(1); }}
              className={`px-6 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl transition-all ${filter === "all" ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Tous
              {pagination && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[8px]">
                  {pagination.total}
                </span>
              )}
            </button>
            <button
              onClick={() => { setFilter("unread"); setCurrentPage(1); }}
              className={`px-6 py-2 text-[10px] uppercase font-black tracking-widest rounded-xl transition-all ${filter === "unread" ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Non lus ({unreadCount})
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 w-full md:w-80 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* ── Notification Cards ── */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n, idx) => (
                <motion.div
                  key={n.id_notification}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`relative group bg-white dark:bg-[#111827] border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all shadow-xs hover:shadow-xl hover:-translate-y-0.5 ${
                    Number(n.lu) === 0
                      ? "border-blue-100 bg-blue-50/30 dark:bg-blue-600/5 dark:border-blue-500/20"
                      : "border-gray-50 dark:border-white/5"
                  }`}
                >
                  <div className="flex items-start md:items-center gap-5 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${Number(n.lu) === 0 ? "bg-white dark:bg-gray-800 border-blue-500/20" : "bg-gray-50 dark:bg-white/5 border-transparent"}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-sm font-black uppercase tracking-wide ${Number(n.lu) === 0 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                          {n.type || "Notification"}
                        </h4>
                        {Number(n.lu) === 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-[8px] font-black text-white uppercase tracking-widest">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${Number(n.lu) === 0 ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-500"}`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-4 pt-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                          <Clock size={10} />
                          {new Date(n.date_heure).toLocaleString("fr-FR", {
                            day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        {n.driver_name && (
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-lg border border-blue-500/10 uppercase tracking-tighter">
                            <i className="fa-solid fa-user-tie text-[8px]" />
                            {n.driver_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {Number(n.lu) === 0 && (
                      <button
                        onClick={() => markAsRead(n.id_notification)}
                        className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                        title="Marquer comme lu"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id_notification)}
                      className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-white/10">
                  <Bell size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-400 dark:text-white/20 uppercase tracking-widest">
                    Aucune Notification
                  </h3>
                  <p className="text-sm font-bold text-gray-400/60 uppercase tracking-tighter">
                    Tout est à jour !
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Pagination Bar ── */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5"
          >
            {/* Info text */}
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Page{" "}
              <span className="text-blue-600 dark:text-blue-400">{currentPage}</span>
              {" "}/ {pagination.totalPages} —{" "}
              <span className="text-gray-600 dark:text-gray-300">{pagination.total}</span>{" "}
              notifications
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-1.5">
              {/* First page */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`${pageBtnBase} ${
                  currentPage === 1
                    ? "text-gray-300 dark:text-white/10 cursor-not-allowed"
                    : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30"
                }`}
                title="Première page"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`${pageBtnBase} ${
                  !pagination.hasPrev
                    ? "text-gray-300 dark:text-white/10 cursor-not-allowed"
                    : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30"
                }`}
                title="Page précédente"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-gray-400 dark:text-gray-600 text-xs font-bold select-none">
                    ···
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`${pageBtnBase} ${
                      p === currentPage
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                        : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`${pageBtnBase} ${
                  !pagination.hasNext
                    ? "text-gray-300 dark:text-white/10 cursor-not-allowed"
                    : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30"
                }`}
                title="Page suivante"
              >
                <ChevronRight size={14} />
              </button>

              {/* Last page */}
              <button
                onClick={() => goToPage(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
                className={`${pageBtnBase} ${
                  currentPage === pagination.totalPages
                    ? "text-gray-300 dark:text-white/10 cursor-not-allowed"
                    : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30"
                }`}
                title="Dernière page"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
