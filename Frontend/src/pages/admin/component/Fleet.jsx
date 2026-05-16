import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bus,
  Check,
  CircleGauge,
  Pencil,
  Plus,
  RefreshCw,
  Route,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { ActionButton, Breadcrumb, MetricCard, Pagination, getPagination } from "../common/adminUi";
import Loader from "../../../components/Loader";

const PAGE_SIZE = 6;
const BUS_ENDPOINT = "/api/bus/update_bus.php.php";

function BusModal({ bus, lines, drivers, onSave, onClose }) {
  const isNew = !bus?.id_bus;
  const [form, setForm] = useState(
    bus
      ? { ...bus }
      : { immatriculation: "", modele: "", capacite: "", en_service: 1, id_ligne: "", matricule: "" }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.immatriculation || !form.modele || !form.capacite) {
      setErr("Immatriculation, modele et capacite sont requis.");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const payload = {
        ...form,
        capacite: Number(form.capacite),
        en_service: Number(form.en_service),
        id_ligne: form.id_ligne || null,
        matricule: form.matricule || null,
      };

      if (isNew) {
        await axios.post(BUS_ENDPOINT, payload, { headers });
      } else {
        await axios.put(`${BUS_ENDPOINT}?id_bus=${bus.id_bus}`, payload, { headers });
      }

      onSave();
    } catch (error) {
      setErr(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg rounded-[24px] border border-black/5 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-white/2"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.22em] text-gray-400 dark:text-white/30">
              {isNew ? "Nouveau bus" : "Modifier bus"}
            </p>
              <h3 className="text-xl font-black flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-route-interstate"></i>
                </div>
                Réseau des Lignes
              </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {err && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={14} /> {err}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Immatriculation
            </label>
            <input
              value={form.immatriculation || ""}
              onChange={(event) => set("immatriculation", event.target.value)}
              placeholder="ex: B-2026-WAY"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Modele
            </label>
            <input
              value={form.modele || ""}
              onChange={(event) => set("modele", event.target.value)}
              placeholder="ex: Mercedes Citaro"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Capacite
            </label>
            <input
              type="number"
              value={form.capacite || ""}
              onChange={(event) => set("capacite", event.target.value)}
              placeholder="60"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Statut
            </label>
            <select
              value={form.en_service}
              onChange={(event) => set("en_service", Number(event.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value={1}>En service</option>
              <option value={0}>Hors service</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Ligne
            </label>
            <select
              value={form.id_ligne || ""}
              onChange={(event) => set("id_ligne", event.target.value || null)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="">Non assigne</option>
              {lines.map((line) => (
                <option key={line.id_ligne} value={line.id_ligne}>
                  {line.nom_ligne}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Conducteur
            </label>
            <select
              value={form.matricule || ""}
              onChange={(event) => set("matricule", event.target.value || null)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="">Non assigne</option>
              {drivers.map((driver) => (
                <option key={driver.matricule} value={driver.matricule}>
                  #{driver.matricule} - {driver.nom} {driver.prenom || ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isNew ? "Creer" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteModal({ bus, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    setErr("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      await axios.delete(`${BUS_ENDPOINT}?id_bus=${bus.id_bus}`, { headers });
      onConfirm();
    } catch (error) {
      setErr(error.response?.data?.message || "Suppression impossible.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-[20px] border border-gray-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-gray-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-red-500 dark:bg-white/5">
          <Trash2 size={20} />
        </div>
        <p className="mb-1 text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">Confirmer</p>
        <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">Supprimer ce bus ?</h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-white/45">
          Le bus <strong className="text-gray-800 dark:text-white">{bus.immatriculation}</strong> sera supprime.
        </p>
        {err && <p className="mb-4 text-xs text-red-500">{err}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold uppercase tracking-widest text-red-500 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10"
          >
            {deleting && <RefreshCw size={12} className="animate-spin" />}
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FleetManagement() {
  const [buses, setBuses] = useState([]);
  const [lines, setLines] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editBus, setEditBus] = useState(null);
  const [newBus, setNewBus] = useState(false);
  const [delBus, setDelBus] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const [busRes, lineRes] = await Promise.all([
        axios.get("/api/bus/get_all_positions.php", { headers }),
        axios.get("/api/lines/get_lignes.php", { headers }),
      ]);

      setBuses(busRes.data.positions || []);
      setLines(lineRes.data.lignes || []);

      try {
        const driverRes = await axios.get("/api/admin/drivers_list.php", { headers });
        setDrivers(driverRes.data.status === "success" ? driverRes.data.data || [] : []);
      } catch {
        setDrivers([]);
      }
    } catch (error) {
      console.error(error);
      showToast("Impossible de charger la flotte.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setPage(1);
  }, [search, buses.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return buses;

    return buses.filter((bus) =>
      [bus.id_bus, bus.immatriculation, bus.modele, bus.nom_ligne, bus.matricule]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  }, [buses, search]);

  const pagination = getPagination(filtered, page, PAGE_SIZE);

  useEffect(() => {
    if (page !== pagination.safePage) setPage(pagination.safePage);
  }, [page, pagination.safePage]);

  const activeBuses = buses.filter((bus) => Number(bus.en_service) === 1).length;
  const assignedBuses = buses.filter((bus) => bus.id_ligne).length;
  const withDriver = buses.filter((bus) => bus.matricule).length;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="px-4 md:px-8 w-full relative pb-12 min-h-screen bg-[#f4f6fa] dark:bg-[#0a0a0a] font-['DM_Sans',sans-serif]">
      {loading && buses.length === 0 && <Loader />}
      <div className="w-full space-y-8">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-7 right-7 z-200 rounded-xl border px-5 py-3 text-sm shadow-2xl ${
              toast.type === "success"
                ? "border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-gray-900 dark:text-white/70"
                : "border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(newBus || editBus) && (
          <BusModal
            bus={editBus}
            lines={lines}
            drivers={drivers}
            onSave={() => {
              fetchAll();
              setEditBus(null);
              setNewBus(false);
              showToast(editBus ? "Bus modifie avec succes." : "Bus cree avec succes.");
            }}
            onClose={() => {
              setEditBus(null);
              setNewBus(false);
            }}
          />
        )}
        {delBus && (
          <DeleteModal
            bus={delBus}
            onConfirm={() => {
              fetchAll();
              setDelBus(null);
              showToast("Bus supprime.");
            }}
            onClose={() => setDelBus(null)}
          />
        )}
      </AnimatePresence>

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
                            <i className="fa-solid fa-bus text-blue-600 text-xl" />
                        </div>
                        <span style={{ letterSpacing: "-0.02em" }}>Gestion de la Flotte</span>
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
                          onClick={() => setNewBus(true)}
                          className="text-xs font-black px-5 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                          <i className="fa-solid fa-plus mr-2" />
                          Ajouter un bus
                        </button>
                    </div>
                </div>

      <motion.div {...fadeUp(0.06)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total vehicules" value={loading ? "-" : buses.length} helper="Bus visibles" icon={Bus} color="blue" />
        <MetricCard label="En service" value={loading ? "-" : activeBuses} helper="Disponibles maintenant" icon={CircleGauge} color="emerald" />
        <MetricCard label="Assignes" value={loading ? "-" : assignedBuses} helper="Avec ligne" icon={Route} color="purple" />
        <MetricCard label="Conducteurs" value={loading ? "-" : withDriver} helper="Bus avec conducteur" icon={UserRound} color="amber" />
      </motion.div>

      <motion.div {...fadeUp(0.12)} className="busway-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white/70 px-4 py-4 dark:border-white/5 dark:bg-white/2 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Flotte de vehicules</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5 sm:w-72">
              <Search size={14} className="shrink-0 text-gray-400 dark:text-white/30" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-white/25"
              />
            </div>
            <button
              type="button"
              onClick={fetchAll}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60 sm:w-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="busway-table min-w-[980px]">
            <thead>
              <tr>
                <th className="w-[5%]">ID</th>
                <th className="w-[15%]">Immatriculation</th>
                <th className="w-[15%]">Modele</th>
                <th className="w-[10%]">Capacite</th>
                <th className="w-[30%]">Ligne</th>
                <th className="w-[10%]">Conducteur</th>
                <th className="w-[10%]">Statut</th>
                <th className="w-[5%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-gray-400" />
                    <span className="text-xs uppercase tracking-widest text-gray-400">Chargement...</span>
                  </td>
                </tr>
              ) : pagination.rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-gray-400">
                    {search ? "Aucun resultat." : "Aucun bus enregistre."}
                  </td>
                </tr>
              ) : (
                pagination.rows.map((bus, index) => (
                  <motion.tr
                    key={bus.id_bus}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td className="text-xs font-bold text-gray-400">#{bus.id_bus}</td>
                    <td className="text-sm font-bold text-gray-800 dark:text-white">{bus.immatriculation || "-"}</td>
                    <td className="text-sm text-gray-500 dark:text-gray-400">{bus.modele || "-"}</td>
                    <td>
                      <span className="busway-pill">{bus.capacite ? `${bus.capacite} pl.` : "-"}</span>
                    </td>
                    <td>
                      <span className="busway-pill">{bus.nom_ligne || "Non assigne"}</span>
                    </td>
                    <td>
                      <span className="busway-pill">{bus.matricule ? `#${bus.matricule}` : "-"}</span>
                    </td>
                    <td>
                      <span
                        className={
                          Number(bus.en_service) === 1
                            ? "busway-pill border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                            : "busway-pill"
                        }
                      >
                        <span
                          className={
                            Number(bus.en_service) === 1
                              ? "h-1.5 w-1.5 rounded-full bg-green-500"
                              : "h-1.5 w-1.5 rounded-full bg-gray-400"
                          }
                        />
                        {Number(bus.en_service) === 1 ? "En service" : "Hors service"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <ActionButton label="Modifier" icon={Pencil} onClick={() => setEditBus(bus)} />
                        <ActionButton label="Supprimer" icon={Trash2} tone="danger" onClick={() => setDelBus(bus)} />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <Pagination
            page={pagination.safePage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            startItem={pagination.startItem}
            endItem={pagination.endItem}
            onPageChange={setPage}
            itemLabel="vehicules"
          />
        )}
      </motion.div>
      </div>
    </div>
  );
}
