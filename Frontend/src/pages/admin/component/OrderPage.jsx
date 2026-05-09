import { useState, useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";
import InvoiceModal from "./InvoiceModal";


const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
});

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function Toast({ toast }) {
  const ok = toast?.type !== "error";
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-7 right-7 z-[200] flex items-center gap-3 px-5 py-3
            rounded-xl border text-sm font-['DM_Sans'] shadow-2xl shadow-black/10
            ${
              ok
                ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
            }`}
        >
          <i
            className={`fa-solid fa-${ok ? "circle-check" : "circle-xmark"}`}
          />
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    paid: {
      cls: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400",
      icon: "fa-circle-check",
    },
    pending: {
      cls: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-500 dark:text-orange-400",
      icon: "fa-clock",
    },
    shipped: {
      cls: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400",
      icon: "fa-truck",
    },
    cancelled: {
      cls: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400",
      icon: "fa-circle-xmark",
    },
    refunded: {
      cls: "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400",
      icon: "fa-rotate-left",
    },
    processing: {
      cls: "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
      icon: "fa-gear",
    },
  };
  const c = cfg[status?.toLowerCase()] ?? cfg.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[0.55rem] tracking-widest uppercase font-semibold
      px-2.5 py-1 rounded-full border ${c.cls}`}
    >
      <i className={`fa-solid ${c.icon} text-[0.5rem]`} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// Order Detail Modal
// ─────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const statuses = [
    "pending",
    "processing",
    "shipped",
    "paid",
    "cancelled",
    "refunded",
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("id_order", order.id_order);
      fd.append("status", status);
      const res = await fetch(
        `${config.API_BASE_URL}/admin/update-order-status.php`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (data.status === "success") {
        onStatusChange(order.id_order, status);
        onClose();
      }
    } catch {
      /* silent */
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10">
          <div>
            <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
              Order
            </p>
            <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
              #{order.id_order}
            </h3>
          </div>
           <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        <div className="px-6 py-3 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-2">
          <span className="text-[0.6rem] uppercase tracking-widest text-gray-400 font-bold">Documents & Contact</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const subject = encodeURIComponent(`Regarding your ${config.BRAND_NAME} Order #${order.id_order}`);
                const body = encodeURIComponent(`Hello ${order.customer},\n\nWe are contacting you regarding your order #${order.id_order} placed on ${new Date(order.created_at).toLocaleDateString()}.\n\nBest regards,\n${config.BRAND_NAME} Team`);
                window.location.href = `mailto:${order.email}?subject=${subject}&body=${body}`;
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg 
              text-[0.6rem] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors"
            >
              <i className="fa-solid fa-envelope" />
              Contact
            </button>
            <button
              onClick={() => onPrintInvoice(order.id_order)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg 
              text-[0.6rem] uppercase tracking-widest font-bold text-gray-600 dark:text-white/60 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
            >
              <i className="fa-solid fa-print text-orange-500" />
              Invoice
            </button>
          </div>
        </div>
Line 168: 
Line 169:         <div className="p-6 space-y-5">
          {/* Info */}
          <div className="space-y-3">
            {[
              { label: "Customer", value: order.customer },
              {
                value: `${parseFloat(order.total_price).toFixed(2)} ${currency}`,
              },
              {
                label: "Date",
                value: new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
              { label: "Status", value: <StatusBadge status={order.status} /> },
            ].map(({ label, value }) => (
               <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <span className="text-[0.6rem] tracking-[0.16em] uppercase text-gray-400 dark:text-white/30">
                  {label}
                </span>
                <span className="text-[0.78rem] text-gray-700 dark:text-white/70 font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Change status */}
          <div>
             <p className="text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-2">
              Update Status
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-1.5 rounded-lg text-[0.6rem] tracking-wide uppercase border transition-all
                     ${
                      status === s
                        ? "bg-[#FC8C06] border-[#FC8C06] text-white"
                        : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
             <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/30 text-[0.7rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || status === order.status}
              className="flex-1 py-2.5 bg-[#FC8C06] rounded-xl text-white text-[0.7rem] tracking-widest uppercase hover:bg-[#d97500] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk text-[0.6rem]" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// TH / TD helpers
// ─────────────────────────────────────────────
 const TH = ({ children, right = false }) => (
  <th
    className={`text-[0.52rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 px-4 py-3 font-medium whitespace-nowrap
    ${right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);
 const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 text-gray-600 dark:text-white/60 ${className}`}>{children}</td>
);

const PAGE_SIZE = 8;

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function OrdersPage() {
  const { currency } = useSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // modal
  const [showInvoiceId, setShowInvoiceId] = useState(null);
  const [toast, setToast] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "" , end: "" });

  const [selectedIds, setSelectedIds] = useState([]);

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paged.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paged.map((o) => o.id_order));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Action
  const handleBulkAction = async (action, value = null) => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} orders?`)) return;

    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/bulk-ops.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "orders", action, ids: selectedIds, value }),
      });

      if (!res.ok) {
        showToast(`Server error: ${res.status}`, "error");
        return;
      }

      const text = (await res.text()).trim();
      try {
        const data = JSON.parse(text);
        showToast(data.message, data.status === "success" ? "success" : "error");
        if (data.status === "success") {
          setSelectedIds([]);
          fetchOrders();
        }
      } catch (e) {
        showToast("Invalid server response", "error");
        console.error("Non-JSON response:", text);
      }
    } catch (err) {
      showToast("Network error", "error");
      console.error(err);
    }
  };

  // Export CSV
  const downloadCSV = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Phone",
      "Total (DH)",
      "Status",
      "Date",
      "Address",
      "City",
      "Country",
      "Postal Code"
    ];
    const rows = filtered.map((o) => [
      o.id_order,
      o.customer,
      o.email,
      o.phone,
      o.total_price,
      o.status,
      o.created_at,
      o.address_line1,
      o.city,
      o.country,
      o.postal_code,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${config.BRAND_NAME.toLowerCase()}_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${config.API_BASE_URL}/admin/get-orders.php`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setOrders(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // filter + search
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const mQ = !q || `${o.customer} #${o.id_order}`.toLowerCase().includes(q);
    const mS = statusF === "all" || o.status?.toLowerCase() === statusF;
    
    // Date filter
    let mDate = true;
    if (dateRange.start || dateRange.end) {
      const oDate = new Date(o.created_at);
      if (dateRange.start) {
        const start = new Date(dateRange.start);
        start.setHours(0, 0, 0, 0);
        if (oDate < start) mDate = false;
      }
      if (dateRange.end) {
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59, 999);
        if (oDate > end) mDate = false;
      }
    }

    return mQ && mS && mDate;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search, statusF]);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id_order === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${id} → ${newStatus}`);
  };

  // stats from orders
  const totalRevenue = orders.reduce(
    (s, o) => s + parseFloat(o.total_price || 0),
    0
  );
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const statusOptions = [
    "all",
    "pending",
    "processing",
    "shipped",
    "paid",
    "cancelled",
    "refunded",
  ];

  return (
    <>
      <Toast toast={toast} />
      <AnimatePresence>
        {selected && (
          <OrderModal
            order={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onPrintInvoice={(id) => setShowInvoiceId(id)}
            currency={currency}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoiceId && (
          <InvoiceModal
            orderId={showInvoiceId}
            onClose={() => setShowInvoiceId(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-full px-4 sm:px-8 py-6 sm:py-8 font-['DM_Sans']">
        {/* ── Page Header ── */}
         <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
            Management
          </p>
          <div className="flex items-end justify-between flex-wrap gap-3">
             <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light text-[#1a1a1a] dark:text-white/90 leading-none">
              Orders
            </h1>
             <div className="flex items-center text-sm text-gray-500 dark:text-white/30 gap-2">
              <Link to="/">
                <p className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Home</p>
              </Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-white/60 font-medium">Orders</span>
            </div>
             <div className="flex items-center gap-2.5">
              <span className="text-[0.62rem] text-black/30 dark:text-white/20 tracking-wide hidden sm:block">
                {today}
              </span>
              <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden sm:block" />
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-white/50
                  text-[0.68rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-all"
                >
                  <i className="fa-solid fa-file-csv text-[0.8rem]" />
                  Export
                </button>
                <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-white/60
                    text-[0.68rem] tracking-widest uppercase hover:text-orange-500 hover:border-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-file-csv text-[0.8rem]" />
                  Export CSV
                </button>
                <button
                  onClick={fetchOrders}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-white/60
                    text-[0.68rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                >
                  <i className="fa-solid fa-rotate-right text-[0.6rem]" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
           <div className="h-px bg-black/[0.07] dark:bg-white/5 mt-4" />
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          {...fadeUp(0.06)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: "fa-bag-shopping",
              color: "orange",
            },
            {
              label: "Revenue",
              value: `${totalRevenue.toFixed(0)} ${currency}`,
              icon: "fa-coins",
              color: "green",
            },
            {
              label: "Paid",
              value: paidCount,
              icon: "fa-circle-check",
              color: "blue",
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: "fa-clock",
              color: "yellow",
            },
          ].map((s, i) => (
             <motion.div
              key={i}
              {...fadeUp(0.06 + i * 0.04)}
              className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm px-5 py-4 flex items-center gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                 ${
                  s.color === "orange"
                    ? "bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20"
                    : s.color === "green"
                    ? "bg-green-50 dark:bg-green-500/10  border border-green-100 dark:border-green-500/20"
                    : s.color === "blue"
                    ? "bg-blue-50 dark:bg-blue-500/10   border border-blue-100 dark:border-blue-500/20"
                    : "bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-100 dark:border-yellow-500/20"
                }`}
              >
                <i
                  className={`fa-solid ${s.icon} text-sm
                  ${
                    s.color === "orange"
                      ? "text-orange-400"
                      : s.color === "green"
                      ? "text-green-500"
                      : s.color === "blue"
                      ? "text-blue-500"
                      : "text-yellow-500"
                  }`}
                />
              </div>
               <div>
                <p className="text-[0.55rem] tracking-widest uppercase text-gray-400 dark:text-white/20">
                  {s.label}
                </p>
                <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  {s.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Table Card ── */}
         <motion.div {...fadeUp(0.18)}>
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
            {/* Toolbar */}
             <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10 flex-wrap gap-3">
              <div>
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                  All
                </p>
                <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  Orders
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                 <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 w-48">
                  <i className="fa-solid fa-magnifying-glass text-[0.6rem] text-gray-300 dark:text-white/10 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders..."
                    className="bg-transparent outline-none text-[0.78rem] text-gray-700 dark:text-white/70 w-full placeholder-gray-300 dark:placeholder-white/10"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-300 dark:text-white/10 hover:text-gray-500 dark:hover:text-white/30 shrink-0"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  )}
                </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[0.65rem] text-gray-500 dark:text-white/40 outline-none focus:border-orange-500"
                    />
                    <span className="text-[0.65rem] text-gray-300 dark:text-white/10">to</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-[0.65rem] text-gray-500 dark:text-white/40 outline-none focus:border-orange-500"
                    />
                    {(dateRange.start || dateRange.end) && (
                      <button 
                        onClick={() => setDateRange({ start: "", end: "" })}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <i className="fa-solid fa-xmark text-[0.7rem]" />
                      </button>
                    )}
                  </div>
                {/* Status filter */}
                <div className="flex gap-1 flex-wrap">
                  {statusOptions.map((v) => (
                    <button
                      key={v}
                      onClick={() => setStatusF(v)}
                      className={`px-3 py-1.5 rounded-lg text-[0.6rem] tracking-wide border transition-all capitalize
                         ${
                          statusF === v
                            ? "bg-[#FC8C06]/10 border-[#FC8C06] text-[#FC8C06]"
                            : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                    >
                      {v === "all" ? "All" : v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
             {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/20">
                  Loading
                </p>
              </div>
            ) : paged.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 bg-gray-50 dark:bg-white/[0.02] rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-bag-shopping text-gray-300 dark:text-white/10 text-lg" />
                </div>
                <p className="text-[0.75rem] text-gray-400 dark:text-white/20">
                  {search ? "No orders match your search" : "No orders yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ tableLayout: "fixed", minWidth: "750px" }}
                >
                  <colgroup>
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "18%" }} />
                  </colgroup>
                   <thead>
                    <tr className="bg-gray-50/70 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/5">
                      <TH>
                        <input
                          type="checkbox"
                          checked={selectedIds.length === paged.length && paged.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-orange-500 focus:ring-orange-500/20 bg-transparent"
                        />
                      </TH>
                      <TH>#</TH>
                      <TH>Customer</TH>
                      <TH>Amount</TH>
                      <TH>Status</TH>
                      <TH>Date</TH>
                      <TH right>Actions</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((o, i) => (
                      <motion.tr
                        key={o.id_order}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.18, delay: i * 0.03 }}
                        className="border-t border-gray-50 dark:border-white/5 hover:bg-orange-50/20 dark:hover:bg-orange-500/[0.02] transition-colors group"
                      >
                        <TD>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(o.id_order)}
                            onChange={() => toggleSelectOne(o.id_order)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-orange-500 focus:ring-orange-500/20 bg-transparent"
                          />
                        </TD>
                        {/* Order ID */}
                         <TD>
                          <span className="text-[0.72rem] font-semibold text-gray-500 dark:text-white/30">
                            #{o.id_order}
                          </span>
                        </TD>

                        {/* Customer */}
                        <TD>
                           <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                              <span className="text-[0.6rem] font-bold text-orange-600 dark:text-orange-400 uppercase">
                                {o.customer?.charAt(0)}
                              </span>
                            </div>
                            <p className="text-[0.78rem] font-medium text-gray-800 dark:text-white/80 truncate">
                              {o.customer}
                            </p>
                          </div>
                        </TD>

                        {/* Amount */}
                        <TD>
                          <span className="font-['Cormorant_Garamond'] text-[1.1rem] font-semibold text-gray-800 dark:text-white/80">
                            {parseFloat(o.total_price || 0).toFixed(2)}
                          </span>
                          <span className="text-[0.56rem] text-gray-400 dark:text-white/20 ml-0.5">
                            {currency}
                          </span>
                        </TD>

                        {/* Status */}
                        <TD>
                          <StatusBadge status={o.status} />
                        </TD>

                        {/* Date */}
                         <TD>
                          <p className="text-[0.72rem] text-gray-500 dark:text-white/40">
                            {new Date(o.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-[0.6rem] text-gray-400 dark:text-white/20">
                            {new Date(o.created_at).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </TD>

                        {/* Actions */}
                        <TD className="text-right">
                          <div className="flex gap-1.5 justify-end lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                             {/* <button
                              onClick={() => setSelected(o)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20
                                text-orange-500 dark:text-orange-400 text-[0.62rem] tracking-wide uppercase hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                            >
                              <i className="fa-solid fa-pen text-[0.55rem]" />
                              Edit
                            </button> */}
                            <button
                              onClick={() => setShowInvoiceId(o.id_order)}
                              title="View Invoice"
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                                text-gray-400 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                            >
                              <i className="fa-solid fa-eye text-[0.55rem]" />
                            </button>
                          </div>
                        </TD>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
             {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5">
                 <span className="text-[0.58rem] text-gray-400 dark:text-white/20">
                  {page * PAGE_SIZE + 1}–
                  {Math.min((page + 1) * PAGE_SIZE, filtered.length)}
                  <span className="text-gray-300 dark:text-white/10 mx-1">of</span>
                  {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                   <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-400 dark:text-white/20
                      hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fa-solid fa-chevron-left text-[0.55rem]" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      className={`w-6 h-6 flex items-center justify-center rounded border text-[0.6rem] font-medium transition-colors
                         ${
                          page === idx
                            ? "bg-[#FC8C06] border-[#FC8C06] text-white"
                            : "bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                   <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-400 dark:text-white/20
                      hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fa-solid fa-chevron-right text-[0.55rem]" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            {!loading && filtered.length > 0 && (
              <div className="px-6 py-3 bg-gray-50/60 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                 <span className="text-[0.6rem] tracking-wider uppercase text-gray-400 dark:text-white/30">
                  {filtered.length} order{filtered.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[0.6rem] text-gray-400 dark:text-white/20">
                  Total:{" "}
                  <strong className="text-gray-700 dark:text-white/60 font-['Cormorant_Garamond'] text-sm">
                    {filtered
                      .reduce((s, o) => s + parseFloat(o.total_price || 0), 0)
                      .toFixed(2)}{" "}
                    {currency}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Bulk Actions Bar ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-6 px-6 py-4
              bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/20"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </div>
              <p className="text-[0.7rem] uppercase tracking-widest text-gray-500 dark:text-white/40 font-bold">
                Orders
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("status", "shipped")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-truck" />
                Mark Shipped
              </button>
              <button
                onClick={() => handleBulkAction("status", "paid")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 dark:text-green-400
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-circle-check" />
                Mark Paid
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-trash-can" />
                Delete
              </button>
            </div>

            <div className="w-px h-6 bg-gray-100 dark:bg-white/10 mx-2" />

            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-gray-400 dark:text-white/20 hover:text-gray-600 dark:hover:text-white/40
                text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

