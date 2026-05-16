import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bus,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Route,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { ActionButton, Breadcrumb, MetricCard, Pagination, getPagination } from "../common/adminUi";

const PAGE_SIZE = 6;

function LineModal({ line, onSave, onClose }) {
  const isNew = !line?.id_ligne;
  const [form, setForm] = useState(line ? { ...line } : { nom_ligne: "", point_depart: "", point_arrivee: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!form.nom_ligne || !form.point_depart || !form.point_arrivee) {
      setErr("Tous les champs sont requis.");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (isNew) {
        await axios.post("/api/lines/manage_ligne.php", form, { headers });
      } else {
        await axios.put(`/api/lines/manage_ligne.php?id_ligne=${line.id_ligne}`, form, { headers });
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
        className="w-full max-w-md rounded-[20px] border border-gray-100 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-gray-900 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.22em] text-gray-400 dark:text-white/30">
              {isNew ? "Nouvelle ligne" : "Modifier ligne"}
            </p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {isNew ? "Creer une ligne" : form.nom_ligne}
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

        <div className="space-y-4">
          {[
            ["nom_ligne", "Nom de la ligne", "ex: Ligne 01 - Centre"],
            ["point_depart", "Point de depart", "ex: Bab Sidi Abdelwahab"],
            ["point_arrivee", "Point d'arrivee", "ex: Universite Mohammed Premier"],
          ].map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
                {label}
              </label>
              <input
                value={form[key] || ""}
                onChange={(event) => set(key, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          ))}
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

function StopModal({ stop, onSave, onClose }) {
  const isNew = !stop?.id_arret;
  const [form, setForm] = useState(stop ? { ...stop } : { nom_arret: "", latitude: "", longitude: "" });
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [err, setErr] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const getLocation = () => {
    setLocating(true);
    setErr("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        set("latitude", position.coords.latitude.toFixed(6));
        set("longitude", position.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setLocating(false);
        setErr("Impossible d'obtenir la position.");
      }
    );
  };

  const handleSave = async () => {
    if (!form.nom_arret || !form.latitude || !form.longitude) {
      setErr("Nom, latitude et longitude sont requis.");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (isNew) {
        await axios.post("/api/stops/manage_arret.php", form, { headers });
      } else {
        await axios.put(`/api/stops/manage_arret.php?id_arret=${stop.id_arret}`, form, { headers });
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
        className="w-full max-w-md rounded-[20px] border border-gray-100 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-gray-900 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.22em] text-gray-400 dark:text-white/30">
              {isNew ? "Nouvel arret" : "Modifier arret"}
            </p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {isNew ? "Creer un arret" : form.nom_arret}
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

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
              Nom de l'arret
            </label>
            <input
              value={form.nom_arret || ""}
              onChange={(event) => set("nom_arret", event.target.value)}
              placeholder="ex: Place 16 Aout"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude || ""}
                onChange={(event) => set("latitude", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.6rem] uppercase tracking-widest text-gray-400 dark:text-white/30">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude || ""}
                onChange={(event) => set("longitude", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={getLocation}
            disabled={locating}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/45"
          >
            <MapPin size={13} />
            {locating ? "Localisation..." : "Utiliser ma position GPS"}
          </button>
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

function DeleteModal({ item, type, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    setErr("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (type === "ligne") {
        await axios.delete(`/api/lines/manage_ligne.php?id_ligne=${item.id_ligne}`, { headers });
      } else {
        await axios.delete(`/api/stops/manage_arret.php?id_arret=${item.id_arret}`, { headers });
      }
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
        <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">
          Supprimer {type === "ligne" ? "cette ligne" : "cet arret"} ?
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-white/45">
          <strong className="text-gray-800 dark:text-white">{item.nom_ligne || item.nom_arret}</strong> sera supprime.
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

function LineRow({ line, index, onEditLine, onDeleteLine, onEditStop, onDeleteStop }) {
  const [expanded, setExpanded] = useState(false);
  const [stops, setStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);

  const loadStops = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    if (stops.length > 0) return;

    setLoadingStops(true);
    try {
      const res = await axios.get(`/api/lines/get_lignes.php?id_ligne=${line.id_ligne}`);
      setStops(res.data.arrets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStops(false);
    }
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        className="cursor-pointer"
        onClick={loadStops}
      >
        <td className="text-xs font-bold text-gray-400">#{line.id_ligne}</td>
        <td>
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronUp size={14} className="shrink-0 text-gray-500" />
            ) : (
              <ChevronDown size={14} className="shrink-0 text-gray-400" />
            )}
            <span className="text-sm font-bold text-gray-800 dark:text-white">{line.nom_ligne}</span>
          </div>
        </td>
        <td>
          <span className="busway-pill">{line.point_depart || "-"}</span>
        </td>
        <td>
          <span className="busway-pill">{line.point_arrivee || "-"}</span>
        </td>
        <td>
          <span className="busway-pill">{line.nb_arrets || 0} arrets</span>
        </td>
        <td>
          <span className="busway-pill">{line.nb_bus || 0} bus</span>
        </td>
        <td onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-2">
            <ActionButton
              label="Modifier"
              icon={Pencil}
              onClick={(event) => {
                event.stopPropagation();
                onEditLine(line);
              }}
            />
            <ActionButton
              label="Supprimer"
              icon={Trash2}
              tone="danger"
              onClick={(event) => {
                event.stopPropagation();
                onDeleteLine(line);
              }}
            />
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={7} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-l-4 border-gray-200 bg-gray-50/80 px-5 py-4 dark:border-white/10 dark:bg-black/20">
                  <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">
                    Arrets de la ligne
                  </p>
                  {loadingStops ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                      <RefreshCw size={12} className="animate-spin" /> Chargement des arrets...
                    </div>
                  ) : stops.length === 0 ? (
                    <p className="py-2 text-xs italic text-gray-400 dark:text-white/30">Aucun arret sur cette ligne.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {stops.map((stop, stopIndex) => (
                        <div key={stop.id_arret} className="flex items-center gap-2">
                          {stopIndex > 0 && <ChevronRight size={12} className="text-gray-300 dark:text-white/20" />}
                          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[0.6rem] font-black text-gray-500 dark:bg-white/10 dark:text-white/60">
                              {stopIndex + 1}
                            </span>
                            <span className="whitespace-nowrap text-xs font-medium text-gray-700 dark:text-white/70">
                              {stop.nom_arret}
                            </span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                onEditStop(stop);
                              }}
                              className="text-gray-400"
                              aria-label="Modifier arret"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                onDeleteStop(stop);
                              }}
                              className="text-red-400"
                              aria-label="Supprimer arret"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function LinesManagement() {
  const [lines, setLines] = useState([]);
  const [allStops, setAllStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("lines");
  const [linePage, setLinePage] = useState(1);
  const [stopPage, setStopPage] = useState(1);
  const [editLine, setEditLine] = useState(null);
  const [newLine, setNewLine] = useState(false);
  const [delLine, setDelLine] = useState(null);
  const [editStop, setEditStop] = useState(null);
  const [newStop, setNewStop] = useState(false);
  const [delStop, setDelStop] = useState(null);
  const [page, setPage] = useState(1);
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lineRes, stopRes] = await Promise.all([
        axios.get("/api/lines/get_lignes.php"),
        axios.get("/api/stops/get_arrests.php"),
      ]);

      setLines(lineRes.data.lignes || []);
      setAllStops(stopRes.data.arrets || []);
    } catch (error) {
      console.error(error);
      showToast("Impossible de charger les lignes.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setLinePage(1);
    setStopPage(1);
  }, [search, activeTab, lines.length, allStops.length]);

  const filteredLines = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lines;

    return lines.filter((line) =>
      [line.nom_ligne, line.point_depart, line.point_arrivee, line.id_ligne]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  }, [lines, search]);

  const filteredStops = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allStops;

    return allStops.filter((stop) =>
      [stop.nom_arret, stop.latitude, stop.longitude, stop.id_arret]
        .some((value) => String(value || "").toLowerCase().includes(q))
    );
  }, [allStops, search]);

  const linePagination = getPagination(filteredLines, linePage, PAGE_SIZE);
  const stopPagination = getPagination(filteredStops, stopPage, PAGE_SIZE);

  useEffect(() => {
    if (linePage !== linePagination.safePage) setLinePage(linePagination.safePage);
  }, [linePage, linePagination.safePage]);

  useEffect(() => {
    if (stopPage !== stopPagination.safePage) setStopPage(stopPagination.safePage);
  }, [stopPage, stopPagination.safePage]);

  const totalStops = allStops.length;
  const totalBuses = lines.reduce((sum, line) => sum + (Number(line.nb_bus) || 0), 0);
  const averageStops = lines.length ? Math.round(totalStops / lines.length) : 0;

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="px-4 md:px-8 w-full relative pb-12 min-h-screen bg-[#f4f6fa] dark:bg-[#0a0a0a] font-['DM_Sans',sans-serif]">
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
        {(newLine || editLine) && (
          <LineModal
            line={editLine}
            onSave={() => {
              fetchData();
              setEditLine(null);
              setNewLine(false);
              showToast(editLine ? "Ligne modifiee." : "Ligne creee.");
            }}
            onClose={() => {
              setEditLine(null);
              setNewLine(false);
            }}
          />
        )}
        {delLine && (
          <DeleteModal
            item={delLine}
            type="ligne"
            onConfirm={() => {
              fetchData();
              setDelLine(null);
              showToast("Ligne supprimee.");
            }}
            onClose={() => setDelLine(null)}
          />
        )}
        {(newStop || editStop) && (
          <StopModal
            stop={editStop}
            onSave={() => {
              fetchData();
              setEditStop(null);
              setNewStop(false);
              showToast(editStop ? "Arret modifie." : "Arret cree.");
            }}
            onClose={() => {
              setEditStop(null);
              setNewStop(false);
            }}
          />
        )}
        {delStop && (
          <DeleteModal
            item={delStop}
            type="arret"
            onConfirm={() => {
              fetchData();
              setDelStop(null);
              showToast("Arret supprime.");
            }}
            onClose={() => setDelStop(null)}
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
                            <i className="fa-solid fa-route text-blue-600 text-xl" />
                        </div>
                        <span style={{ letterSpacing: "-0.02em" }}>Lignes & Arrêts</span>
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
                        <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, textTransform: "uppercase" }}>Réseau</span>
                    </div>

                    <div className="max-lg:w-full max-lg:justify-center flex items-center gap-4 flex-1 justify-end">
                        <button
                          onClick={() => (activeTab === "lines" ? setNewLine(true) : setNewStop(true))}
                          className="text-xs font-black px-5 py-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 uppercase tracking-wider whitespace-nowrap"
                        >
                          <i className="fa-solid fa-plus mr-2" />
                          {activeTab === "lines" ? "Ajouter une ligne" : "Ajouter un arrêt"}
                        </button>
                    </div>
                </div>

      <motion.div {...fadeUp(0.06)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total lignes" value={loading ? "-" : lines.length} helper="Lignes disponibles" icon={Route} color="purple" />
        <MetricCard label="Total arrets" value={loading ? "-" : totalStops} helper="Points de montee" icon={MapPin} color="pink" />
        <MetricCard label="Bus actifs" value={loading ? "-" : totalBuses} helper="Sur les lignes" icon={Bus} color="emerald" />
        <MetricCard label="Moy. arrets" value={loading ? "-" : averageStops} helper="Par ligne" icon={ChevronRight} color="blue" />
      </motion.div>

      <motion.div {...fadeUp(0.1)} className="flex w-full overflow-x-auto">
        <div className="flex min-w-max items-center gap-1 rounded-2xl border border-gray-200 bg-gray-100 p-1.5 dark:border-white/10 dark:bg-white/5">
          {[
            { key: "lines", label: "Lignes", icon: Route },
            { key: "stops", label: "Arrets", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearch("");
                }}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wide ${
                  active
                    ? "bg-white text-gray-900 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-gray-500 dark:text-white/40"
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.14)} className="busway-panel overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white/70 px-4 py-4 dark:border-white/5 dark:bg-white/2 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {activeTab === "lines" ? "Lignes de transport" : "Arrets de bus"}
          </h3>
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
              onClick={fetchData}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60 sm:w-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "lines" ? (
            <table className="busway-table min-w-[960px]">
              <thead>
                <tr>
                  <th className="w-[5%]">ID</th>
                  <th className="w-[25%]">Ligne</th>
                  <th className="w-[20%]">Depart</th>
                  <th className="w-[20%]">Arrivee</th>
                  <th className="w-[10%]">Arrets</th>
                  <th className="w-[10%]">Bus</th>
                  <th className="w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-gray-400" />
                      <span className="text-xs uppercase tracking-widest text-gray-400">Chargement...</span>
                    </td>
                  </tr>
                ) : linePagination.rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-gray-400">
                      {search ? "Aucun resultat." : "Aucune ligne enregistree."}
                    </td>
                  </tr>
                ) : (
                  linePagination.rows.map((line, index) => (
                    <LineRow
                      key={line.id_ligne}
                      line={line}
                      index={index}
                      onEditLine={setEditLine}
                      onDeleteLine={setDelLine}
                      onEditStop={setEditStop}
                      onDeleteStop={setDelStop}
                    />
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="busway-table min-w-[760px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom de l'arret</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th className="w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-gray-400" />
                      <span className="text-xs uppercase tracking-widest text-gray-400">Chargement...</span>
                    </td>
                  </tr>
                ) : stopPagination.rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-gray-400">
                      {search ? "Aucun resultat." : "Aucun arret enregistre."}
                    </td>
                  </tr>
                ) : (
                  stopPagination.rows.map((stop, index) => (
                    <motion.tr
                      key={stop.id_arret}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <td className="text-xs font-bold text-gray-400">#{stop.id_arret}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                            <MapPin size={12} />
                          </span>
                          <span className="text-sm font-bold text-gray-800 dark:text-white">{stop.nom_arret}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {stop.latitude ? Number(stop.latitude).toFixed(6) : "-"}
                      </td>
                      <td className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {stop.longitude ? Number(stop.longitude).toFixed(6) : "-"}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <ActionButton label="Modifier" icon={Pencil} onClick={() => setEditStop(stop)} />
                          <ActionButton label="Supprimer" icon={Trash2} tone="danger" onClick={() => setDelStop(stop)} />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && activeTab === "lines" && (
          <Pagination
            page={linePagination.safePage}
            totalPages={linePagination.totalPages}
            totalItems={linePagination.totalItems}
            startItem={linePagination.startItem}
            endItem={linePagination.endItem}
            onPageChange={setLinePage}
            itemLabel="lignes"
          />
        )}

        {!loading && activeTab === "stops" && (
          <Pagination
            page={stopPagination.safePage}
            totalPages={stopPagination.totalPages}
            totalItems={stopPagination.totalItems}
            startItem={stopPagination.startItem}
            endItem={stopPagination.endItem}
            onPageChange={setStopPage}
            itemLabel="arrets"
          />
        )}
      </motion.div>
      </div>
    </div>
  );
}
