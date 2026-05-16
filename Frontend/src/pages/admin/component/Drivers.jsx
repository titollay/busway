import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  MapPin, 
  Phone, 
  Trash2, 
  Edit3, 
  Search,
  Signal,
  Key,
  Mail,
  Camera,
  ChevronRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { 
  ActionButton, 
  Pagination, 
  getPagination
} from "../common/adminUi";

const PAGE_SIZE = 6;

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ 
        id_user: "",
        nom: "", 
        email: "", 
        telephone: "", 
        mot_de_passe: "", 
        matricule: "", 
        image: "" 
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const fetchDrivers = () => {
        setLoading(true);
        axios.get("/api/admin/drivers_list.php")
            .then((res) => {
                if (res.data.status === "success") {
                    setDrivers(res.data.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleOpenModal = (mode, driver = null) => {
        setModalMode(mode);
        setErrorMsg("");
        if (mode === "edit" && driver) {
            setSelectedDriver(driver);
            setFormData({
                id_user: driver.id_user,
                nom: driver.nom,
                email: driver.email,
                telephone: driver.telephone,
                matricule: driver.matricule,
                mot_de_passe: "", 
                image: "" 
            });
            setPreviewImage(driver.image);
        } else {
            setFormData({ nom: "", email: "", telephone: "", mot_de_passe: "", matricule: "", image: "" });
            setPreviewImage(null);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);
        try {
            const url = modalMode === "add" ? "/api/admin/add_driver.php" : "/api/admin/update_driver.php";
            const res = await axios.post(url, formData);
            if (res.data.status === "success") {
                fetchDrivers();
                setShowModal(false);
            } else {
                setErrorMsg(res.data.message || "Erreur lors de l'opération.");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Une erreur inattendue est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!driverToDelete) return;
        setIsSubmitting(true);
        try {
            const res = await axios.delete(`/api/admin/delete_driver.php?id_user=${driverToDelete.id_user}`);
            if (res.data.status === "success") {
                setDrivers(drivers.filter(d => d.id_user !== driverToDelete.id_user));
                setShowDeleteModal(false);
                setDriverToDelete(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredDrivers = useMemo(() => {
        return drivers.filter(d => 
            d.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.matricule?.toString().includes(searchQuery) ||
            d.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [drivers, searchQuery]);

    const { 
      safePage, 
      totalPages, 
      totalItems, 
      startItem, 
      endItem, 
      rows: paginatedRows 
    } = getPagination(filteredDrivers, page, PAGE_SIZE);

    const activeCount = drivers.filter(d => parseInt(d.gps_active) === 1).length;
    const offlineCount = drivers.length - activeCount;
    
    const pieData = [
        { name: "Actifs", value: activeCount, color: "#10b981" },
        { name: "Hors Ligne", value: offlineCount, color: isDark ? "#1e293b" : "#e2e8f0" }
    ];
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden" animate="show" variants={containerVariants}
            className="px-4 md:px-8 w-full relative pb-12 min-h-screen"
            style={{ background: isDark ? "#0a0a0a" : "#f4f6fa" }}
        >
            <div className="w-full space-y-8">
                {/* Header Section (Original Style) */}
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
                            <Users className="text-blue-600 text-xl" size={20} />
                        </div>
                        <span style={{ letterSpacing: "-0.02em" }}>Chauffeurs</span>
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
                        <ChevronRight className="rotate-0" size={10} style={{ color: isDark ? "#4b5563" : "#94a3b8" }} />
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Flotte</span>
                    </div>

                    <div className="max-lg:w-full max-lg:justify-center flex items-center gap-4 flex-1 justify-end">
                        <button 
                            onClick={() => handleOpenModal("add")}
                            className="text-xs font-black px-5 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                            <UserPlus size={14} className="inline mr-2" />
                            Conducteur
                        </button>
                        <Link 
                            to="/map"
                            className="text-xs font-black px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                            <MapPin size={14} className="inline mr-2" />
                            Cibler
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Area (Original Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    <motion.div variants={itemVariants} className="lg:col-span-1 min-h-[310px] flex p-1 rounded-[32px] overflow-hidden"
                         style={{ 
                             background: isDark ? "#111827" : "#ffffff", 
                             border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                             boxShadow: "0 10px 40px rgba(0,0,0,0.03)" 
                         }}>
                        <div className="w-full h-full p-4 flex flex-col">
                            <div className="flex items-center gap-2 mb-6 ml-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">Signal GPS Temps Réel</span>
                            </div>

                            <div className="flex-1 min-h-[180px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: '900',
                                                textTransform: 'uppercase'
                                            }} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                
                                {/* Center Text Overlay */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                                        {((activeCount / (drivers.length || 1)) * 100).toFixed(0)}%
                                    </span>
                                    <span className="text-[0.5rem] font-black uppercase text-slate-400">En Ligne</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-around px-2 pb-2">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                        <span className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{activeCount}</span>
                                    </div>
                                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">Actifs</span>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-100 dark:bg-white/5" />
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                        <span className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{offlineCount}</span>
                                    </div>
                                    <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">Hors Ligne</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="lg:col-span-2 rounded-[32px] shadow-2xl p-8 flex flex-col justify-center text-white relative overflow-hidden"
                         style={{ 
                             background: isDark 
                                 ? "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)" 
                                 : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                             border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
                         }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute right-0 top-0 opacity-10">
                            <Users size={240} className="-mt-10 -mr-10" strokeWidth={1} />
                        </div>
                        
                        <h2 className="text-6xl font-black mb-2">{drivers.length}</h2>
                        <p className="text-blue-100 uppercase tracking-widest text-sm font-semibold mb-8">Employés Enregistrés</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="block text-[10px] text-blue-100 uppercase font-black tracking-widest mb-1">En Service / Actifs</span>
                                <span className="text-2xl font-black">{activeCount}</span>
                            </div>
                            <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
                                <span className="block text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">En Repos / Hors Ligne</span>
                                <span className="text-2xl font-black">{drivers.length - activeCount}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-sm ml-auto">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <Search size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs font-bold text-gray-700 outline-none transition-all focus:border-blue-400 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    />
                </div>

                {/* New Table Section (The one you liked) */}
                <motion.div variants={itemVariants} className="busway-glow-card overflow-hidden">
                    <div className="busway-card-bg" />
                    <div className="relative z-10 p-1">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-100/50 dark:border-blue-500/20">
                                            <Users size={20} />
                                        </div>
                                        Registre des Conducteurs
                                    </h3>
                                    <p className="text-[0.65rem] uppercase tracking-widest font-black text-slate-400 mt-1.5 ml-13">Liste détaillée des employés</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-[24px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-gray-100/50 dark:border-white/5">
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5">MATRICULE</th>
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5">NOM COMPLET</th>
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5">CONTACT</th>
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5">SIGNAL GPS</th>
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5">REJOINTS</th>
                                            <th className="text-[0.6rem] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-5 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-20">
                                                    <div className="flex flex-col items-center gap-3">
                                                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-600" />
                                                      <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-400">Synchronisation...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedRows.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-20">
                                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                                      <Users size={40} className="text-slate-300" />
                                                      <p className="text-[0.65rem] uppercase tracking-[0.2em] font-black text-slate-400">Aucun conducteur trouvé</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedRows.map((driver, i) => (
                                            <tr key={driver.id_user || i} className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all duration-300">
                                                <td className="px-6 py-5">
                                                  <span className="text-xs font-black text-gray-900 border-b-2 border-blue-200/50 pb-0.5 dark:text-white dark:border-blue-500/30">
                                                      #{driver.matricule}
                                                  </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-blue-100/50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black shrink-0 shadow-sm border border-slate-200 dark:border-white/10 ring-4 ring-white dark:ring-black">
                                                            {driver.image ? (
                                                                <img src={driver.image} alt={driver.nom} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-xs">{driver.nom ? driver.nom[0].toUpperCase() : "?"}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                          <span className="font-black text-sm text-gray-800 dark:text-gray-100 capitalize">
                                                              {driver.nom || "Utilisateur"}
                                                          </span>
                                                          <span className="text-[0.65rem] font-bold text-slate-400">ID: {driver.id_user}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                                                          <Phone size={12} className="text-blue-400" />
                                                          {driver.telephone || "N/A"}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-[0.65rem] font-bold text-slate-400">
                                                          <Mail size={12} className="text-slate-300" />
                                                          {driver.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {parseInt(driver.gps_active) === 1 ? (
                                                        <span className="inline-flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-100/50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-500/20">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                            </span>
                                                            Connecté
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/10">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                            Hors Ligne
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                  <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 dark:text-gray-100">
                                                      {driver.date_ajout ? new Date(driver.date_ajout).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : "N/A"}
                                                    </span>
                                                    <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">
                                                      {driver.date_ajout ? new Date(driver.date_ajout).getFullYear() : ""}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                  <div className="flex items-center justify-center gap-2 translate-x-2 opacity-20 group-hover:opacity-100 transition-all duration-300">
                                                    <ActionButton 
                                                      label="Modifier" 
                                                      icon={Edit3} 
                                                      onClick={() => handleOpenModal("edit", driver)} 
                                                    />
                                                    <ActionButton 
                                                      label="Supprimer" 
                                                      icon={Trash2} 
                                                      tone="danger"
                                                      onClick={() => {
                                                        setDriverToDelete(driver);
                                                        setShowDeleteModal(true);
                                                      }} 
                                                    />
                                                  </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-8">
                                <Pagination
                                  page={safePage}
                                  totalPages={totalPages}
                                  totalItems={totalItems}
                                  startItem={startItem}
                                  endItem={endItem}
                                  onPageChange={setPage}
                                  itemLabel="conducteurs"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal ajoute/modifier Conducteur */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className={`w-full max-w-lg p-8 rounded-[32px] shadow-[0_32px_64px_-24px_rgba(0,0,0,0.5)] overflow-hidden relative ${isDark ? 'bg-[#0f172a] border border-white/10' : 'bg-white'}`}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all dark:bg-white/5 dark:text-gray-400">
                                    <Trash2 size={20} className="rotate-45" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                                    <UserPlus size={28} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {modalMode === "add" ? "Nouveau Conducteur" : "Modifier Profil"}
                                    </h3>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Saisie des informations de conducteur</p>
                                </div>
                            </div>
                            
                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-6 p-4 bg-red-500/5 border border-red-500/10 text-red-500 text-[0.65rem] font-black uppercase tracking-widest rounded-2xl flex items-center gap-3"
                                >
                                    <Signal size={16} /> {errorMsg}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                          <Users size={12} /> Nom Complet
                                        </label>
                                        <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-400'}`} placeholder="Ex: Ahmed Yassin" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                          <Key size={12} /> Matricule
                                        </label>
                                        <input type="text" required value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-400'}`} placeholder="Ex: #88" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                          <Mail size={12} /> Email de Connexion
                                        </label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-400'}`} placeholder="driver@busway.ma" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                          <Phone size={12} /> Téléphone Mobile
                                        </label>
                                        <input type="tel" required value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-400'}`} placeholder="06..." />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      <Key size={12} /> {modalMode === "edit" ? "Nouveau Mot de Passe (Optionnel)" : "Mot de Passe"}
                                    </label>
                                    <input type="password" required={modalMode === "add"} minLength="6" value={formData.mot_de_passe} onChange={e => setFormData({...formData, mot_de_passe: e.target.value})} className={`w-full px-5 py-4 rounded-2xl border font-bold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:border-blue-400'}`} placeholder="••••••••" />
                                </div>

                                <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                                    <label className={`text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                      <Camera size={12} /> Photo d'identité
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center overflow-hidden shrink-0 relative ${!previewImage ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                            {previewImage ? (
                                                <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <Camera className="text-blue-300 dark:text-blue-900" size={24} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                          <input 
                                              type="file" 
                                              accept="image/*"
                                              onChange={(e) => {
                                                  const file = e.target.files[0];
                                                  if (file) {
                                                      const reader = new FileReader();
                                                      reader.onloadend = () => {
                                                          const base64String = reader.result;
                                                          setPreviewImage(base64String);
                                                          setFormData({ ...formData, image: base64String });
                                                      };
                                                      reader.readAsDataURL(file);
                                                  }
                                              }}
                                              id="driver-image"
                                              className="hidden"
                                          />
                                          <label htmlFor="driver-image" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-[0.6rem] font-black uppercase tracking-widest text-gray-600 cursor-pointer hover:bg-gray-50 transition-all dark:bg-white/5 dark:border-white/10 dark:text-gray-300">
                                            Choisir une image
                                          </label>
                                          <p className="mt-2 text-[0.6rem] text-slate-400 font-bold">PNG, JPG ou GIF. Max 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full mt-4 py-5 rounded-[24px] bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[0.7rem] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {isSubmitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : (
                                      modalMode === "add" ? "Enregistrer Conducteur" : "Mettre à jour"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl transition-all dark:bg-slate-900 border border-red-100 dark:border-red-900/20"
                        >
                            <div className="p-8">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="mb-2 text-2xl font-black text-gray-900 dark:text-white">
                                    Supprimer Conducteur ?
                                </h3>
                                <p className="mb-8 text-sm font-semibold leading-relaxed text-gray-500 dark:text-gray-400">
                                    Voulez-vous vraiment supprimer <span className="text-red-500 font-black">{driverToDelete?.nom}</span> ? 
                                    Cette action est irréversible et supprimera également son accès au système.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDriverToDelete(null);
                                        }}
                                        className="flex-1 rounded-[20px] bg-gray-100 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-200 active:scale-95 dark:bg-white/5 dark:text-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleDelete}
                                        className="flex-1 rounded-[20px] bg-red-500 py-4 text-[0.65rem] font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-600 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Suppression..." : "Supprimer"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
