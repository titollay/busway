import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && children}
    </div>
  );
}

// Notification type → icon mapper
function notifIcon(type) {
  switch (type?.toLowerCase()) {
    case "warning": return "fa-solid fa-triangle-exclamation";
    case "bus_approche": return "fa-solid fa-bus";
    case "danger":  return "fa-solid fa-circle-exclamation";
    default:        return "fa-solid fa-bell";
  }
}
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr`;
  return `${Math.floor(diff / 86400)} j`;
}

const MESSAGES = [
  { name: "Emay Walter", msg: "Do you want to go see movie?" },
  { name: "Jason Borne", msg: "Thank you for rating us." },
  { name: "Sarah Loren", msg: "What's the project report update?" },
];

const LANGS = [
  { code: "en", flag: "🇺🇸", label: "English", sub: "(US)" },
  { code: "de", flag: "🇩🇪", label: "Deutsch", sub: "" },
  { code: "es", flag: "🇪🇸", label: "Español", sub: "" },
  { code: "fr", flag: "🇫🇷", label: "Français", sub: "" },
  { code: "pt", flag: "🇵🇹", label: "Português", sub: "(BR)" },
  { code: "cn", flag: "🇨🇳", label: "中文", sub: "" },
  { code: "ae", flag: "🇦🇪", label: "العربية", sub: "(ae)" },
];

export default function TopBar({ user: initialUser, collapsed, setCollapsed }) {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [lang, setLang] = useState("en");
  const [fullscreen, setFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // ── Real notifications state ──
  const [liveNotifs, setLiveNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchLiveNotifs = useCallback(async () => {
    try {
      // Fetch first page with enough items to show latest 5 in dropdown
      const res = await axios.get("/api/admin/get_notifications.php?page=1&limit=5");
      if (res.data.success) {
        setLiveNotifs(res.data.data.slice(0, 5));
        // Count unread from full total — ask for a count-only request
        const countRes = await axios.get("/api/admin/get_notifications.php?page=1&limit=100");
        if (countRes.data.success) {
          setUnreadCount(countRes.data.data.filter(n => Number(n.lu) === 0).length);
        }
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchLiveNotifs();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchLiveNotifs, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveNotifs]);

  const markTopbarRead = async (id) => {
    try {
      await axios.post("/api/admin/mark_notification_read.php", { id_notification: id });
      setLiveNotifs(prev => prev.map(n => n.id_notification === id ? { ...n, lu: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_) {}
  };

  useEffect(() => {
    const handleSync = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (updatedUser) setCurrentUser(updatedUser);
    };
    window.addEventListener("userUpdate", handleSync);
    return () => window.removeEventListener("userUpdate", handleSync);
  }, []);

  // ✅ إصلاح: handleColor كاملة داخل الـ component
  const handleColor = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const iconBtn = `flex items-center justify-center w-9 h-9 rounded-lg hover:text-blue-400 transition-all duration-200 cursor-pointer ${
    darkMode
      ? "text-gray-400 hover:bg-white/5"
      : "text-gray-500 hover:bg-black/5"
  }`;
  const dropMenu = `absolute right-0 top-full mt-2 shadow-xl z-50 overflow-hidden rounded-xl ${
    darkMode
      ? "bg-gray-900/90 border border-white/10 backdrop-blur-xl"
      : "bg-white border border-black/10"
  }`;
  const dropHdr = `flex items-center gap-3 px-4 py-3 ${
    darkMode ? "border-b border-white/6" : "border-b border-black/8"
  }`;
  const dropItem = `flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${
    darkMode
      ? "hover:bg-white/5 border-b border-white/5"
      : "hover:bg-gray-50 border-b border-black/5"
  } last:border-0`;

  return (
    <header
      className="h-17.5 flex items-center justify-between px-5 gap-4 shrink-0 z-40 relative w-full transition-all duration-300"
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: darkMode ? "#0a0a0a" : "#ffffff",
        backdropFilter: darkMode ? "blur(12px)" : "none",
        borderBottom: darkMode
          ? "1px solid rgba(255,255,255,0.05)"
          : "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg hover:text-blue-400 transition-all duration-200 cursor-pointer ${
            darkMode ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-black/5"
          }`}
          title="Toggle Sidebar"
        >
          <i className="fa-solid fa-bars text-sm"></i>
        </button>
        <span
          className={`text-[0.6rem] uppercase tracking-[0.2em] font-medium hidden xs:block ${
            darkMode ? "text-white/25" : "text-black/25"
          }`}
        >
          Admin Panel
        </span>
      </div>

      {/* CENTER: Search */}
      <div
        className={`flex-1 max-w-xs hidden md:flex items-center gap-2 px-3 py-2 ${
          darkMode
            ? "bg-white/5 border border-white/8"
            : "bg-black/5 border border-black/10"
        }`}
      >
        <i
          className={`fa-solid fa-magnifying-glass text-xs shrink-0 ${
            darkMode ? "text-white/25" : "text-black/25"
          }`}
        ></i>
        <input
          type="text"
          placeholder="Search here..."
          className={`bg-transparent border-none outline-none text-xs w-full ${
            darkMode
              ? "text-white/70 placeholder:text-white/20"
              : "text-black/70 placeholder:text-black/20"
          }`}
          style={{ fontFamily: "'DM Sans',sans-serif" }}
        />
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Home */}
        <button className={iconBtn} onClick={() => navigate("/")} title="Go to Website">
          <i className="fa-solid fa-house text-sm"></i>
        </button>

        {/* Mobile search */}
        <button className={`${iconBtn} md:hidden`}>
          <i className="fa-solid fa-magnifying-glass text-sm"></i>
        </button>

        {/* Dark mode */}
        <button
          onClick={handleColor}
          className={iconBtn}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          <i
            className={`text-sm ${
              darkMode
                ? "fa-solid fa-sun text-blue-400"
                : "fa-regular fa-moon"
            }`}
          ></i>
        </button>

        {/* Notifications */}
        <Dropdown
          trigger={
            <div className={`${iconBtn} relative`}>
              <i className="fa-regular fa-bell text-sm"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full border border-white dark:border-gray-900 flex items-center justify-center text-[9px] font-black text-white leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          }
        >
          <div className={dropMenu} style={{ minWidth: 320 }}>
            {/* Header */}
            <div className={`${dropHdr} justify-between`}>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-bell text-blue-400 text-sm"></i>
                <h6 className={`text-sm font-bold ${darkMode ? "text-white/80" : "text-black/80"}`}>
                  Notifications
                </h6>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black">
                  {unreadCount} non lus
                </span>
              )}
            </div>

            {/* List */}
            {liveNotifs.length === 0 ? (
              <div className={`px-4 py-6 text-center text-xs ${darkMode ? "text-white/30" : "text-black/30"}`}>
                <i className="fa-regular fa-bell-slash text-2xl mb-2 block opacity-30"></i>
                Aucune notification
              </div>
            ) : (
              liveNotifs.map((n) => (
                <div
                  key={n.id_notification}
                  className={`${dropItem} ${Number(n.lu) === 0 ? (darkMode ? "bg-blue-500/5" : "bg-blue-50/60") : ""}`}
                  onClick={() => Number(n.lu) === 0 && markTopbarRead(n.id_notification)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    Number(n.lu) === 0 ? "bg-blue-100 dark:bg-blue-500/20" : "bg-gray-100 dark:bg-white/5"
                  }`}>
                    <i className={`${notifIcon(n.type)} text-xs ${
                      Number(n.lu) === 0 ? "text-blue-500" : (darkMode ? "text-white/30" : "text-black/25")
                    }`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${
                      Number(n.lu) === 0
                        ? (darkMode ? "text-white/80 font-semibold" : "text-black/80 font-semibold")
                        : (darkMode ? "text-white/45" : "text-black/50")
                    }`}>
                      {n.message}
                    </p>
                    {n.driver_name && (
                      <p className={`text-[0.6rem] mt-0.5 font-bold uppercase tracking-tight ${
                        darkMode ? "text-blue-400/70" : "text-blue-500/70"
                      }`}>
                        <i className="fa-solid fa-user-tie mr-1"></i>{n.driver_name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[0.6rem] ${darkMode ? "text-white/25" : "text-black/25"}`}>
                      {timeAgo(n.date_heure)}
                    </span>
                    {Number(n.lu) === 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Footer */}
            <div className="px-4 py-3">
              <button
                onClick={() => navigate("/index/notifications")}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs uppercase tracking-widest transition-all rounded-sm font-bold"
              >
                Voir toutes les notifications
              </button>
            </div>
          </div>
        </Dropdown>

        {/* Messages */}
        <Dropdown
          trigger={
            <div className={`${iconBtn} relative`}>
              <i className="fa-regular fa-message text-sm"></i>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white"></span>
            </div>
          }
        >
          <div className={dropMenu} style={{ minWidth: 300 }}>
            <div className={dropHdr}>
              <i className="fa-regular fa-message text-blue-400 text-sm"></i>
              <h6
                className={`text-sm font-medium ${
                  darkMode ? "text-white/80" : "text-black/80"
                }`}
              >
                Messages
              </h6>
            </div>
            {MESSAGES.map((m, i) => (
              <div key={i} className={dropItem}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-500 text-xs font-bold">
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p
                    className={`text-xs font-medium mb-0.5 ${
                      darkMode ? "text-white/70" : "text-black/70"
                    }`}
                  >
                    {m.name}
                  </p>
                  <p
                    className={`text-[0.65rem] truncate ${
                      darkMode ? "text-white/35" : "text-black/35"
                    }`}
                  >
                    {m.msg}
                  </p>
                </div>
                <button className="text-black/15 hover:text-red-400 transition-colors shrink-0 ml-2">
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            ))}
            <div className="px-4 py-3 ">
              <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs uppercase tracking-widest transition-colors">
                Check Messages
              </button>
            </div>
          </div>
        </Dropdown>

        {/* Fullscreen */}
        <button
          className={iconBtn}
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          <i
            className={`fa-solid ${
              fullscreen ? "fa-compress" : "fa-expand"
            } text-sm`}
          ></i>
        </button>

        {/* Language */}
        <Dropdown
          trigger={
            <div className={iconBtn} title="Language">
              <i className="fa-solid fa-globe text-sm"></i>
            </div>
          }
        >
          <div className={dropMenu} style={{ minWidth: 200 }}>
            {LANGS.map((l) => (
              <div
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`${dropItem} ${
                  lang === l.code ? "bg-blue-50" : ""
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  {l.label}
                </span>
                {l.sub && (
                  <span
                    className={`text-[0.6rem] ${
                      darkMode ? "text-white/25" : "text-black/25"
                    }`}
                  >
                    {l.sub}
                  </span>
                )}
                {lang === l.code && (
                  <i className="fa-solid fa-check text-blue-400 text-xs ml-auto"></i>
                )}
              </div>
            ))}
          </div>
        </Dropdown>

        <span
          className={`w-px h-5 mx-1 ${
            darkMode ? "bg-white/10" : "bg-black/10"
          }`}
        />

        {/* Profile */}
        <Dropdown
          trigger={
            <div
              className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-colors ${
                darkMode ? "hover:bg-white/5" : "hover:bg-black/5"
              }`}
            >
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden shadow-sm border border-black/5 dark:border-white/10">
                {currentUser?.image ? (
                  <img src={currentUser.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="pointer-events-none select-none uppercase">{currentUser?.nom?.[0] || "A"}</span>
                )}
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <p
                  className={`text-xs font-black uppercase tracking-tighter ${
                    darkMode ? "text-white/80" : "text-black/80"
                  }`}
                >
                  {currentUser?.nom}
                </p>
                <p className="text-[0.55rem] text-blue-500 font-bold uppercase tracking-widest">
                  {currentUser?.role || "admin"}
                </p>
              </div>
              <i
                className={`fa-solid fa-chevron-down text-[0.55rem] hidden sm:block ${
                  darkMode ? "text-white/25" : "text-black/25"
                }`}
              ></i>
            </div>
          }
        >
          <div className={dropMenu} style={{ minWidth: 200 }}>
            <div
              className={`px-4 py-3 ${
                darkMode ? "border-b border-white/8" : "border-b border-black/8"
              }`}
            >
              <p
                className={`text-sm font-black text-blue-500 uppercase tracking-tighter`}
              >
                {currentUser?.nom}
              </p>
              <p
                className={`text-[10px] uppercase font-bold opacity-40 mt-0.5`}
              >
                {currentUser?.email}
              </p>
            </div>
            {[
              { icon: "fa-solid fa-user", label: "Account", href: "#" },
              { icon: "fa-regular fa-envelope", label: "Inbox", href: "#" },
              { icon: "fa-solid fa-gear", label: "Settings", href: "#" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`${dropItem} no-underline`}
              >
                <i
                  className={`${item.icon} text-xs w-4 text-center ${
                    darkMode ? "text-white/30" : "text-black/30"
                  }`}
                ></i>
                <span
                  className={`text-xs ${
                    darkMode ? "text-white/60" : "text-black/60"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            ))}
            <div
              className={`border-t ${
                darkMode ? "border-white/8" : "border-black/8"
              }`}
            >
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
                className={`${dropItem} w-full text-left border-0`}
              >
                <i className="fa-solid fa-right-from-bracket text-red-400 text-xs w-4 text-center"></i>
                <span className="text-xs text-red-400">Log out</span>
              </button>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
