import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import config from "../../config";
import { useSettings } from "../../context/SettingsContext";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
});

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_name: config.BRAND_NAME,
    currency: "DH",
    support_email: "",
    support_phone: "",
    facebook_url: "",
    instagram_url: "",
    maintenance_mode: "false",
  });
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/admin/settings.php`)
      .then((r) => r.json())
      .then((res) => {
        if (res.status === "success" && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: prev[name] === "true" ? "false" : "true",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/settings.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessage({ type: "success", text: "Settings updated successfully" });
        refreshSettings();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update settings" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full px-8 py-8 font-['DM_Sans']">
      <motion.div {...fadeUp(0)} className="mb-8">
        <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
          Store Control
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light text-[#1a1a1a] dark:text-white/90 leading-none">
          General Settings
        </h1>
      </motion.div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Section */}
          <motion.div {...fadeUp(0.05)} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-gray-500 dark:text-white/40">General Identity</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Site Name</label>
                <input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Currency Symbol</label>
                <input
                  type="text"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  placeholder="DH, $, €..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50/50 dark:bg-orange-500/5 rounded-xl border border-orange-100 dark:border-orange-500/10">
                <div>
                  <h4 className="text-[0.75rem] font-bold text-gray-800 dark:text-white/80">Maintenance Mode</h4>
                  <p className="text-[0.6rem] text-gray-500 dark:text-white/40 uppercase tracking-tight">Disable storefront for visitors</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("maintenance_mode")}
                  className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenance_mode === "true" ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-700"}`}
                >
                  <motion.div 
                    animate={{ x: settings.maintenance_mode === "true" ? 26 : 4 }}
                    className="w-4 h-4 rounded-full bg-white absolute top-1 shadow-sm"
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div {...fadeUp(0.1)} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-gray-500 dark:text-white/40">Contact Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Support Email</label>
                <input
                  type="email"
                  name="support_email"
                  value={settings.support_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Support Phone</label>
                <input
                  type="text"
                  name="support_phone"
                  value={settings.support_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Section */}
          <motion.div {...fadeUp(0.15)} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <h3 className="text-[0.65rem] uppercase tracking-widest font-bold text-gray-500 dark:text-white/40">Social Channels</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Facebook URL</label>
                <input
                  type="text"
                  name="facebook_url"
                  value={settings.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30 font-bold mb-2">Instagram URL</label>
                <input
                  type="text"
                  name="instagram_url"
                  value={settings.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-sm text-gray-700 dark:text-white/70 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>

          {/* Save Action */}
          <motion.div {...fadeUp(0.2)} className="flex items-center justify-between pt-4">
            <div>
              {message && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-xs font-bold uppercase tracking-wider ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {message.text}
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-3 bg-[#FC8C06] rounded-xl text-white text-[0.7rem] uppercase tracking-[0.2em] font-bold hover:bg-[#d97500] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : "Save Changes"}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
