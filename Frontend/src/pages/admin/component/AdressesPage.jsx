import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay: d, ease: [0.22, 1, 0.36, 1] },
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
// Delete Confirm Modal
// ─────────────────────────────────────────────
function DeleteModal({ item, onConfirm, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl p-7 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center justify-center mb-4">
          <i className="fa-solid fa-trash-can text-red-400 dark:text-red-400/80" />
        </div>
        <p className="text-[0.55rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/30 mb-1">
          Confirm Action
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 mb-2 leading-tight">
          Delete Address?
        </h3>
        <p className="text-[0.78rem] text-gray-500 dark:text-white/50 leading-relaxed mb-6">
          Remove the address of{" "}
          <strong className="text-gray-800 dark:text-white/70">{item?.full_name}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/40
              text-[0.68rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item)}
            className="flex-1 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-500 dark:text-red-400
              text-[0.68rem] tracking-widest uppercase hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Detail Drawer / Modal
// ─────────────────────────────────────────────
function DetailModal({ address, onClose }) {
  const rows = [
    {
      label: "Address ID",
      value: `#${address.id_address}`,
      icon: "fa-hashtag",
    },
    { label: "Full Name", value: address.full_name, icon: "fa-user" },
    { label: "Phone", value: address.phone, icon: "fa-phone" },
    { label: "Country", value: address.country, icon: "fa-earth-africa" },
    { label: "City", value: address.city, icon: "fa-city" },
    { label: "Address", value: address.address_line, icon: "fa-map-pin" },
    {
      label: "Postal Code",
      value: address.postal_code || "—",
      icon: "fa-envelope",
    },
    { label: "Customer", value: address.customer, icon: "fa-circle-user" },
    { label: "Email", value: address.email, icon: "fa-at" },
    {
      label: "Added",
      value: new Date(address.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      icon: "fa-calendar-days",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100 dark:border-white/10">
          <div>
            <p className="text-[0.52rem] tracking-[0.24em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
              Address Details
            </p>
            <h3 className="font-['Cormorant_Garamond'] text-[1.6rem] font-light text-gray-900 dark:text-white/90 leading-none">
              {address.full_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
              text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Map Placeholder */}
        <div
          className="mx-6 mt-5 h-[72px] bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5 border border-orange-100 dark:border-orange-500/20
          rounded-xl flex items-center gap-4 px-5 overflow-hidden relative"
        >
          {/* decorative dots */}
          <div className="absolute right-4 top-2 w-20 h-20 rounded-full border border-orange-200/40 opacity-60" />
          <div className="absolute right-8 top-0 w-14 h-14 rounded-full border border-orange-200/30 opacity-50" />
          <div className="w-9 h-9 bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
            <i className="fa-solid fa-map-location-dot text-orange-400 dark:text-orange-400/80" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.78rem] font-semibold text-orange-700 dark:text-orange-400 truncate">
              {address.city}, {address.country}
            </p>
            <p className="text-[0.62rem] text-orange-400 dark:text-orange-400/60 truncate">
              {address.address_line}
            </p>
          </div>
          {address.postal_code && (
            <span
              className="ml-auto shrink-0 text-[0.58rem] bg-orange-100 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30
              text-orange-500 dark:text-orange-400 px-2 py-0.5 rounded-full"
            >
              {address.postal_code}
            </span>
          )}
        </div>

        {/* Field list */}
        <div className="px-6 py-4 space-y-0 max-h-[340px] overflow-y-auto">
          {rows.map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <i
                    className={`fa-solid ${icon} text-[0.5rem] text-gray-400 dark:text-white/20`}
                  />
                </div>
                <span className="text-[0.58rem] tracking-[0.14em] uppercase text-gray-400 dark:text-white/30">
                  {label}
                </span>
              </div>
              <span className="text-[0.76rem] text-gray-700 dark:text-white/60 font-medium text-right max-w-[55%] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/40
              text-[0.68rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Table helpers
// ─────────────────────────────────────────────
const TH = ({ children, right = false, center = false }) => (
  <th
    className={`text-[0.52rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 px-4 py-3 font-medium
    whitespace-nowrap ${
      right ? "text-right" : center ? "text-center" : "text-left"
    }`}
  >
    {children}
  </th>
);
 const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 text-gray-700 dark:text-white/60 ${className}`}>{children}</td>
);

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [page, setPage] = useState(0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAddresses = () => {
    setLoading(true);
    fetch(`${config.API_BASE_URL}/admin/get-addresses.php`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response. Check your API configuration.");
        }
        return res.json();
      })
      .then((d) => {
        if (d.status === "success") setAddresses(d.data || []);
        else showToast(d.message || "Failed to load addresses", "error");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        showToast(err.message || "Network error", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // derived
  const countries = [
    "all",
    ...Array.from(new Set(addresses.map((a) => a.country).filter(Boolean))),
  ];
  const uniqueCountries = countries.length - 1;
  const uniqueCities = new Set(addresses.map((a) => a.city).filter(Boolean))
    .size;

  const filtered = addresses.filter((a) => {
    const q = search.toLowerCase();
    const mQ =
      !q ||
      `${a.full_name} ${a.city} ${a.country} ${a.customer || ""} ${a.phone}`
        .toLowerCase()
        .includes(q);
    const mC = country === "all" || a.country === country;
    return mQ && mC;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search, country]);

  const handleDelete = async (item) => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/admin/delete-address.php?id=${item.id_address}`,
        { method: "DELETE" }
      );
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showToast("Server error: Non-JSON response received.", "error");
        setToDelete(null);
        return;
      }

      const data = await res.json();
      if (data.status === "success") {
        setAddresses((prev) =>
          prev.filter((a) => a.id_address !== item.id_address)
        );
        showToast(`Address #${item.id_address} deleted`);
      } else {
        showToast(data.message || "Delete failed", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Network error or server misconfiguration", "error");
    }
    setToDelete(null);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Toast toast={toast} />
      <AnimatePresence>
        {toDelete && (
          <DeleteModal
            item={toDelete}
            onConfirm={handleDelete}
            onClose={() => setToDelete(null)}
          />
        )}
        {selected && (
          <DetailModal address={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>

      <div className="min-h-full px-4 sm:px-8 py-6 sm:py-8 font-['DM_Sans']">
        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.52rem] tracking-[0.3em] uppercase text-black/25 dark:text-white/20 mb-1">
            Management
          </p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h1 className="font-['Cormorant_Garamond'] text-[2.5rem] font-light text-[#1a1a1a] dark:text-white/90 leading-none">
              Addresses
            </h1>
            <div className="flex items-center text-[0.75rem] text-gray-500 dark:text-white/40 gap-2">
              <Link
                to="/index"
                className="hover:text-[#FC8C06] dark:hover:text-orange-500 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-300 dark:text-white/10">/</span>
              <span className="text-gray-700 dark:text-white/60 font-medium">Addresses</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[0.6rem] text-black/25 dark:text-white/20 tracking-wide hidden sm:block">
                {today}
              </span>
              <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden sm:block" />
              <button
                onClick={fetchAddresses}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg
                  text-gray-600 dark:text-white/50 text-[0.67rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
              >
                <i className="fa-solid fa-rotate-right text-[0.6rem]" />
                Refresh
              </button>
            </div>
          </div>
          <div className="h-px bg-black/[0.06] dark:bg-white/5 mt-5" />
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Addresses",
              value: addresses.length,
              icon: "fa-address-book",
              color: "orange",
            },
            {
              label: "Countries",
              value: uniqueCountries,
              icon: "fa-earth-africa",
              color: "blue",
            },
            {
              label: "Cities",
              value: uniqueCities,
              icon: "fa-city",
              color: "green",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.05 + i * 0.04)}
              className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                ${
                  s.color === "orange"
                    ? "bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20"
                    : s.color === "blue"
                    ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20"
                    : "bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20"
                }`}
              >
                <i
                  className={`fa-solid ${s.icon} text-sm
                  ${
                    s.color === "orange"
                      ? "text-[#FC8C06] dark:text-orange-400"
                      : s.color === "blue"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-green-500 dark:text-green-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-[0.52rem] tracking-widest uppercase text-gray-400 dark:text-white/20 mb-0.5">
                  {s.label}
                </p>
                <p className="font-['Cormorant_Garamond'] text-[2rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  {s.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Table Card ── */}
        <motion.div {...fadeUp(0.18)}>
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-start justify-between px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-white/5 flex-wrap gap-4">
              <div>
                <p className="text-[0.52rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/20 mb-0.5">
                  All
                </p>
                <h3 className="font-['Cormorant_Garamond'] text-[1.6rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  Addresses
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 w-52">
                  <i className="fa-solid fa-magnifying-glass text-[0.58rem] text-gray-300 dark:text-white/20 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, city, phone..."
                    className="bg-transparent outline-none text-[0.78rem] text-gray-700 dark:text-white/70 w-full placeholder-gray-300 dark:placeholder-white/10"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-300 hover:text-gray-500 dark:hover:text-white/50 shrink-0"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  )}
                </div>
                {/* Country pills */}
                <div className="flex gap-1.5 flex-wrap overflow-x-auto">
                  {countries.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCountry(c)}
                      className={`px-3 py-1.5 rounded-lg text-[0.8rem] tracking-wide border capitalize transition-all
                        ${
                          country === c
                            ? "bg-[#FC8C06]/10 border-[#FC8C06] text-[#FC8C06] dark:bg-orange-500/20 dark:border-orange-500 dark:text-orange-400"
                            : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-6 h-6 border-2 border-[#FC8C06] border-t-transparent rounded-full animate-spin" />
                 <p className="text-[0.58rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/20">
                  Loading
                </p>
              </div>
            ) : paged.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-14 h-14 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-map-location-dot text-gray-300 dark:text-white/20 text-xl" />
                </div>
                <p className="text-[0.75rem] text-gray-400 dark:text-white/20">
                  {search || country !== "all"
                    ? "No addresses match your filters"
                    : "No addresses yet"}
                </p>
                {(search || country !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCountry("all");
                    }}
                    className="text-[0.65rem] text-[#FC8C06] underline underline-offset-2 hover:no-underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ tableLayout: "fixed", minWidth: "900px" }}
                >
                  <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "6%" }} />
                    <col style={{ width: "5%" }} />
                  </colgroup>
                   <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/5">
                      <TH>#</TH>
                      <TH>Full Name</TH>
                      <TH>Customer</TH>
                      <TH>Country</TH>
                      <TH>City</TH>
                      <TH>Address</TH>
                      <TH center>Postal</TH>
                      <TH>Date</TH>
                      <TH right>Actions</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((a, i) => (
                      <motion.tr
                        key={a.id_address}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="border-t border-gray-50 dark:border-white/5 hover:bg-[#FC8C06]/[0.03] dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* ID */}
                        <TD>
                          <span className="text-[0.68rem] font-semibold text-gray-400 dark:text-white/20">
                            #{a.id_address}
                          </span>
                        </TD>

                        {/* Full Name + phone */}
                        <TD>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-[#FC8C06]/10 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                              <span className="text-[0.6rem] font-bold text-[#FC8C06] dark:text-orange-400 uppercase">
                                {a.full_name?.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[0.76rem] font-medium text-gray-800 dark:text-white/80 truncate">
                                {a.full_name}
                              </p>
                              <p className="text-[0.58rem] text-gray-400 dark:text-white/30 flex items-center gap-1">
                                <i className="fa-solid fa-phone text-[0.42rem]" />
                                {a.phone}
                              </p>
                            </div>
                          </div>
                        </TD>

                        {/* Customer */}
                        <TD>
                          <p className="text-[0.72rem] text-gray-600 dark:text-white/60 truncate">
                            {a.customer || "—"}
                          </p>
                          {a.email && (
                            <p className="text-[0.58rem] text-gray-400 dark:text-white/30 truncate">
                              {a.email}
                            </p>
                          )}
                        </TD>

                        {/* Country */}
                        <TD>
                          <div className="flex items-center gap-1.5">
                            <i className="fa-solid fa-earth-africa text-[0.52rem] text-gray-300 dark:text-white/20 shrink-0" />
                            <span className="text-[0.72rem] text-gray-600 dark:text-white/60 capitalize truncate">
                              {a.country}
                            </span>
                          </div>
                        </TD>

                        {/* City */}
                        <TD>
                          <div className="flex items-center gap-1.5">
                            <i className="fa-solid fa-city text-[0.52rem] text-gray-300 dark:text-white/20 shrink-0" />
                            <span className="text-[0.72rem] text-gray-600 dark:text-white/60 truncate">
                              {a.city}
                            </span>
                          </div>
                        </TD>

                        {/* Address line */}
                        <TD>
                          <p className="text-[0.7rem] text-gray-500 dark:text-white/40 truncate leading-relaxed">
                            {a.address_line}
                          </p>
                        </TD>

                        {/* Postal */}
                        <TD className="text-center">
                          {a.postal_code ? (
                            <span
                              className="inline-block text-[0.6rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40
                              px-2 py-0.5 rounded-lg"
                            >
                              {a.postal_code}
                            </span>
                          ) : (
                            <span className="text-gray-300 dark:text-white/10 text-[0.7rem]">
                              —
                            </span>
                          )}
                        </TD>

                        {/* Date */}
                        <TD>
                          <p className="text-[0.66rem] text-gray-400 dark:text-white/20 whitespace-nowrap">
                            {new Date(a.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                              }
                            )}
                          </p>
                        </TD>

                        {/* Actions */}
                        <TD className="text-right">
                          <div className="flex gap-1 justify-end lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setSelected(a)}
                              title="View"
                              className="w-7 h-7 flex items-center justify-center rounded-lg
                                bg-[#FC8C06]/10 dark:bg-orange-500/20 border border-[#FC8C06]/20 dark:border-orange-500/30 text-[#FC8C06] dark:text-orange-400
                                hover:bg-[#FC8C06]/20 dark:hover:bg-orange-500/30 transition-colors"
                            >
                              <i className="fa-solid fa-eye text-[0.55rem]" />
                            </button>
                            <button
                              onClick={() => setToDelete(a)}
                              title="Delete"
                              className="w-7 h-7 flex items-center justify-center rounded-lg
                                bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-400 dark:text-red-400/80
                                hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            >
                              <i className="fa-solid fa-trash-can text-[0.55rem]" />
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
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.01]">
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
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03]
                      text-gray-400 dark:text-white/30 hover:border-[#FC8C06]/50 dark:hover:border-orange-500/50 hover:text-[#FC8C06] dark:hover:text-orange-400
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fa-solid fa-chevron-left text-[0.52rem]" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      className={`w-6 h-6 flex items-center justify-center rounded border text-[0.6rem] font-medium transition-colors
                        ${
                          page === idx
                            ? "bg-[#FC8C06] border-[#FC8C06] text-white"
                            : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-[#FC8C06]/50 dark:hover:border-orange-500/50 hover:text-[#FC8C06] dark:hover:text-orange-400"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                    className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03]
                      text-gray-400 dark:text-white/30 hover:border-[#FC8C06]/50 dark:hover:border-orange-500/50 hover:text-[#FC8C06] dark:hover:text-orange-400
                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fa-solid fa-chevron-right text-[0.52rem]" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer bar */}
            {!loading && filtered.length > 0 && (
              <div className="flex items-center justify-between px-6 py-2.5 bg-gray-50/60 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
                <span className="text-[0.58rem] tracking-wider uppercase text-gray-400 dark:text-white/20">
                  {filtered.length} address{filtered.length !== 1 ? "es" : ""}
                  {(search || country !== "all") && (
                    <span className="text-gray-300 dark:text-white/10 ml-1">(filtered)</span>
                  )}
                </span>
                <div className="flex items-center gap-3 text-[0.58rem] text-gray-400 dark:text-white/20">
                  <span>
                    <i className="fa-solid fa-earth-africa mr-1 text-gray-300 dark:text-white/10" />
                    {uniqueCountries} countr
                    {uniqueCountries !== 1 ? "ies" : "y"}
                  </span>
                  <span className="text-gray-200 dark:text-white/5">·</span>
                  <span>
                    <i className="fa-solid fa-city mr-1 text-gray-300 dark:text-white/10" />
                    {uniqueCities} cit{uniqueCities !== 1 ? "ies" : "y"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
