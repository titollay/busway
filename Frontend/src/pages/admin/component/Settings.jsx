import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Shield, 
  Camera,
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import Loader from "../../../components/Loader";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isDark, setIsDark] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  // Robust name resolution
  const fullName = storedUser.nom || 
                   (storedUser.first_name ? `${storedUser.first_name} ${storedUser.last_name || ''}` : "") || 
                   "Admin";

  const [formData, setFormData] = useState({
    nom: fullName,
    email: storedUser.email || "",
    telephone: storedUser.telephone || "",
    role: storedUser.role || "Admin",
    image: storedUser.image || null,
    date_ajout: storedUser.date_ajout || new Date().toISOString(),
    bio: "Gestionnaire principal du système BusWay. Responsable du suivi de la flotte et de la maintenance du réseau."
  });

  const fileInputRef = React.useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const response = await fetch("http://localhost/bus/busway/backend/api/admin/update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: storedUser.id_user,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          image: formData.image,
          role: formData.role
        })
      });

      const result = await response.json();
      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.user));
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
        window.dispatchEvent(new Event("userUpdate"));
      } else {
        setMessage({ type: "error", text: result.message || "Erreur lors de la mise à jour" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur de connexion au serveur" });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="px-4 md:px-8 w-full relative pb-12 min-h-screen">
      {isUpdating && <Loader />}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        className="hidden" 
      />
      {/* Standardized Header Area */}
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
                  <i className="fa-solid fa-user-gear text-blue-600 text-xl" />
              </div>
              <span style={{ letterSpacing: "-0.02em" }}>Paramètres & Profil</span>
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
              <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Paramètres</span>
          </div>

          <div className="max-lg:w-full flex-1 md:block hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Overview */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div {...fadeUp} className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="h-32 bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)]"></div>
            </div>
            <div className="px-8 pb-10 -mt-16 flex flex-col items-center text-center relative z-10">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-[#111827] bg-white dark:bg-[#1f2937] overflow-hidden shadow-2xl relative transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 flex items-center justify-center">
                  {formData.image ? (
                    <img src={formData.image} alt={formData.nom} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-5xl text-blue-600 uppercase bg-linear-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 pointer-events-none select-none">
                      {formData.nom?.trim()?.[0] || "A"}
                    </div>
                  )}
                </div>
                {(formData.role.toLowerCase() === "admin" || formData.role.toLowerCase() === "conducteur") && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-gray-600 dark:text-white hover:text-blue-600 dark:hover:bg-blue-500 transition-all z-30 border-2 border-white dark:border-gray-800 hover:scale-110 active:scale-95"
                    title="Changer la photo"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {formData.nom}
                </h2>
                <p className="text-sm font-bold text-blue-600/60 dark:text-blue-400/60 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  {formData.role}
                </p>
              </div>

              <div className="w-full mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Complétion Profil</span>
                  <span className="text-[10px] font-black text-blue-600">85%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-6">
              <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400">
                  <Mail size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Pro</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400">
                  <Phone size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Téléphone</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{formData.telephone || "Non défini"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100/50 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400">
                  <Calendar size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Inscrit le</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {new Date(formData.date_ajout).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Settings Tabs */}
        <div className="lg:col-span-8 flex flex-col">
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#111827] rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm flex flex-col flex-1">
            <div className="flex items-center border-b border-gray-100 dark:border-white/5 px-4 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: "personal", label: "Détails Personnels", icon: <User size={16} /> },
                { id: "security", label: "Mote de Passe", icon: <Lock size={16} /> },
                { id: "experience", label: "Activité", icon: <Shield size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-5 text-[10px] uppercase font-black tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="tab-indicator" 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col flex-1">
              <div className="p-8 lg:p-12 flex-1">
                <AnimatePresence mode="wait">
                  {activeTab === "personal" && (
                    <motion.div
                      key="personal-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom Complet</label>
                            <input 
                              type="text" 
                              value={formData.nom}
                              onChange={(e) => setFormData({...formData, nom: e.target.value})}
                              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all text-sm font-bold text-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Pro</label>
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all text-sm font-bold text-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                            <input 
                              type="tel" 
                              value={formData.telephone}
                              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                              placeholder="+212 6..."
                              className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all text-sm font-bold text-gray-700 dark:text-white"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</label>
                            <input 
                              type="text" 
                              readOnly
                              value={formData.role}
                              className="w-full px-5 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent cursor-not-allowed text-sm font-bold text-gray-400 dark:text-gray-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Bio / Description</label>
                          <textarea 
                            rows="4" 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-black focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all text-sm font-bold text-gray-700 dark:text-white resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div
                      key="security-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="max-w-2xl space-y-8"
                    >
                      <div className="p-6 rounded-[24px] bg-amber-500/10 border border-amber-500/20 text-amber-600 flex gap-4">
                        <AlertCircle className="shrink-0 mt-1" size={20} />
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tighter mb-1">Attention Sécurité</h4>
                           <p className="text-xs font-bold opacity-80 leading-relaxed">Une fois votre mot de passe modifié, vous serez déconnecté de toutes les sessions actives.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mot de passe actuel</label>
                          <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-500 transition-all text-sm font-bold text-gray-700 dark:text-white focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nouveau mot de passe</label>
                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-500 transition-all text-sm font-bold text-gray-700 dark:text-white focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Confirmer le mot de passe</label>
                            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-blue-500 transition-all text-sm font-bold text-gray-700 dark:text-white focus:outline-none" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons: Full-width Footer */}
              <div className="px-10 py-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-4 shrink-0">
                <button 
                  type="button"
                  className="px-6 py-2.5 text-xs font-black text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <i className="fa-solid fa-check-double text-xs"></i>
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-2xl bg-emerald-500 text-white shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md"
          >
            <CheckCircle size={20} />
            <span className="text-sm font-black uppercase tracking-widest">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
