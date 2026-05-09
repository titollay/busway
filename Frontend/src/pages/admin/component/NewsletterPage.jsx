import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
});

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/admin/dashboard.php`)
      .then(r => r.json())
      .then(res => {
        // We'll reuse dashboard API to get customer count or list
        if(res.status === 'success') {
          // Fetching actual customer list would be better, but let's assume we have it or just show count
        }
      });
      
    // Fetch customers for the sidebar list
    fetch(`${config.API_BASE_URL}/admin/users.php`) // Assuming users.php exists based on sideBare.jsx
      .then(r => r.json())
      .then(res => {
        if(res.status === 'success') {
          setCustomers(Array.isArray(res.data) ? res.data.filter(u => u.role === 'customer') : []);
        }
      });
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSending(true);
    setStatus(null);

    const fd = new FormData();
    fd.append("subject", subject);
    fd.append("message", message);

    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/newsletter.php`, {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStatus({ type: 'success', msg: data.message });
        setSubject("");
        setMessage("");
      } else {
        setStatus({ type: 'error', msg: data.message });
      }
    } catch {
      setStatus({ type: 'error', msg: "Connection error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fadeUp()} className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-bold">Marketing</p>
        <h1 className="text-3xl font-light text-gray-900 dark:text-white/90 font-serif">Store Newsletter</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-7">
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold">Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Special Weekend Offer! 🎁"
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold">Message Content</label>
                <textarea 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write your email content here. HTML is supported by most mail clients."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-orange-500 transition-colors min-h-[300px]"
                  required
                />
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-xl text-xs font-medium border ${
                      status.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
                    }`}
                  >
                    {status.msg}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={sending}
                className="w-full py-4 bg-orange-500 text-white rounded-xl text-[0.7rem] uppercase tracking-[0.2em] font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {sending ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane" /> Broadcast to All Customers</>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div {...fadeUp(0.2)} className="space-y-6">
          <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
            <h4 className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold mb-4">Audience Summary</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 transition-all">Total Recipients</span>
                <span className="text-lg font-bold text-[#FC8C06]">{customers.length}</span>
              </div>
              <p className="text-[0.65rem] text-gray-400 leading-relaxed italic">Emails will be sent individually to all registered customers to ensure maximum deliverability.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
             <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                <h4 className="text-[0.65rem] uppercase tracking-widest text-gray-400 font-bold">Recent Signups</h4>
             </div>
             <div className="divide-y divide-gray-50 dark:divide-white/5 max-h-[400px] overflow-y-auto">
                {customers.slice(0, 10).map(c => (
                  <div key={c.id} className="p-4 flex items-center gap-3 text-xs">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold">
                      {c.first_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 dark:text-white/80 truncate">{c.first_name} {c.last_name}</p>
                      <p className="text-gray-400 truncate tracking-tighter">{c.email}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
