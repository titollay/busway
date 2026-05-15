import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import PieChart from "../common/pie";

export default function Drivers() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", mot_de_passe: "", matricule: "" });
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        axios.get("/api/admin/drivers_list.php")
            .then((res) => {
                if (res.data.status === "success") {
                    setDrivers(res.data.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleAddDriver = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/admin/add_driver.php", formData);
            if (res.data.status === "success") {
                setDrivers([res.data.data, ...drivers]);
                setShowModal(false);
                setFormData({ nom: "", email: "", telephone: "", mot_de_passe: "", matricule: "" });
            } else {
                setErrorMsg(res.data.message || "Erreur lors de l'ajout.");
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Une erreur inattendue est survenue.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeDrivers = drivers.filter(d => parseInt(d.gps_active) === 1).length;
    const inactiveDrivers = drivers.length - activeDrivers;

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
                {/* Header Section */}
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
                        <i className="fa-solid fa-chevron-right" style={{ fontSize: 8, color: isDark ? "#4b5563" : "#94a3b8" }} />
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Flotte</span>
                    </div>

                    <div className="max-lg:w-full max-lg:justify-center flex items-center gap-4 flex-1 justify-end">
                        <button 
                            onClick={() => setShowModal(true)}
                            className="text-xs font-black px-5 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                            <i className="fa-solid fa-plus mr-2"></i>
                            Conducteur
                        </button>
                        <Link 
                            to="/map"
                            className="text-xs font-black px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                            <i className="fa-solid fa-map-location-dot mr-2"></i>
                            Cibler
                        </Link>
                    </div>
                </div>

                {/* Top Metrics Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants} className="lg:col-span-1 min-h-[310px] flex p-1 rounded-[32px] overflow-hidden"
                         style={{ 
                             background: isDark ? "#111827" : "#ffffff", 
                             border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                             boxShadow: "0 10px 40px rgba(0,0,0,0.03)" 
                         }}>
                        <div className="w-full h-full p-4">
                            <PieChart 
                                title="Statut GPS Actuel"
                                labels={["Actif", "Hors Ligne"]} 
                                values={[activeDrivers, inactiveDrivers]} 
                                colorsMap={{"Actif": "#10B981", "Hors Ligne": "#94a3b8"}}
                                icon="fa-satellite-dish"
                                isDark={isDark}
                            />
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
                            <i className="fa-solid fa-user-tie text-[15rem] -mt-10 -mr-10"></i>
                        </div>
                        
                        <h2 className="text-6xl font-black mb-2">{drivers.length}</h2>
                        <p className="text-blue-100 uppercase tracking-widest text-sm font-semibold mb-8">Employés Enregistrés</p>
                        
                        <div className="flex gap-4">
                            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="block text-[10px] text-blue-100 uppercase font-black tracking-widest mb-1">En Service / Actifs</span>
                                <span className="text-2xl font-black">{activeDrivers}</span>
                            </div>
                            <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
                                <span className="block text-[10px] text-blue-200 uppercase font-black tracking-widest mb-1">En Repos / Hors Ligne</span>
                                <span className="text-2xl font-black">{inactiveDrivers}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table Section */}
                <motion.div variants={itemVariants} className="p-1 rounded-[32px] overflow-hidden" 
                     style={{ 
                         background: isDark ? "#111827" : "#ffffff", 
                         border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                         boxShadow: "0 10px 40px rgba(0,0,0,0.03)" 
                     }}>
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                        <i className="fa-solid fa-address-card"></i>
                                    </div>
                                    Registre des Conducteurs
                                </h3>
                                <p className="text-xs font-bold text-slate-400 mt-1 ml-13">Liste détaillée des employés</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 rounded-tl-2xl">MATRICULE</th>
                                        <th className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">NOM COMPLET</th>
                                        <th className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">CONTACT</th>
                                        <th className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">SIGNAL GPS</th>
                                        <th className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/10 rounded-tr-2xl">REJOINT LE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16">
                                                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-blue-500 mb-4"></i>
                                                <p className="text-sm font-bold text-slate-500">Chargement des données...</p>
                                            </td>
                                        </tr>
                                    ) : drivers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16 text-sm font-bold text-slate-500">
                                                Aucun conducteur trouvé.
                                            </td>
                                        </tr>
                                    ) : drivers.map((driver, i) => (
                                        <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0" style={{ borderColor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc" }}>
                                            <td className="px-6 py-5 text-sm font-black text-gray-900 dark:text-gray-100">
                                                #{driver.matricule}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black shrink-0">
                                                        {driver.nom ? driver.nom[0].toUpperCase() : "?"}
                                                    </div>
                                                    <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                                                        {driver.nom || "Utilisateur"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{driver.telephone || "N/A"}</span>
                                                    <span className="text-xs font-bold text-slate-400">{driver.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {parseInt(driver.gps_active) === 1 ? (
                                                    <span className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-lg w-max">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                        </span>
                                                        Connecté
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg w-max">
                                                        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                        Hors Ligne
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                {driver.date_ajout ? new Date(driver.date_ajout).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal Ajoutez Conducteur */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${isDark ? 'bg-[#111827] border border-white/10' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <i className="fa-solid fa-user-plus text-blue-500 mr-2"></i>
                                    Nouveau Conducteur
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <i className="fa-solid fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            {errorMsg && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl">
                                    <i className="fa-solid fa-circle-exclamation mr-1"></i> {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleAddDriver} className="space-y-4">
                                <div>
                                    <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Nom Complet</label>
                                    <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="Ex: Ahmed Yassin" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Matricule</label>
                                        <input type="text" required value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="DRV-001" />
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Téléphone</label>
                                        <input type="tel" required value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="06..." />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="ahmed@busway.ma" />
                                </div>
                                <div>
                                    <label className={`block text-xs font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Mot de Passe</label>
                                    <input type="password" required minLength="6" value={formData.mot_de_passe} onChange={e => setFormData({...formData, mot_de_passe: e.target.value})} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} placeholder="••••••••" />
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full mt-2 py-3.5 rounded-xl bg-blue-600 text-white font-black uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Sauvegarder"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
