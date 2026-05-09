import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Toast ──
function Toast({ toast }) {
  const ok = toast?.type !== "error";
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-7 right-7 z-50 flex items-center gap-3 px-5 py-3
            rounded-xl border text-sm font-['DM_Sans'] shadow-2xl shadow-black/10
            ${
              ok
                ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
            }`}
        >
          <i
            className={`fa-solid fa-${ok ? "circle-check" : "circle-xmark"}`}
          ></i>
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Delete Confirm Modal ──
function DeleteModal({ cat, onConfirm, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl p-7 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-10 h-10 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl
          flex items-center justify-center mb-4"
        >
          <i className="fa-solid fa-trash-can text-red-400 dark:text-red-400/80"></i>
        </div>
        <p className="text-[0.55rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/30 mb-1">
          Confirm
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 mb-2">
          Delete Category?
        </h3>
        <p className="text-[0.78rem] text-gray-500 dark:text-white/50 leading-relaxed mb-6">
          Remove <strong className="text-gray-800 dark:text-white/70">{cat?.name}</strong>? This
          cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg
              text-gray-500 dark:text-white/40 text-[0.7rem] tracking-widest uppercase
              hover:border-gray-300 dark:hover:border-white/20 transition-colors font-['DM_Sans']"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(cat)}
            className="flex-1 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg
              text-red-500 dark:text-red-400 text-[0.7rem] tracking-widest uppercase
              hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-['DM_Sans']"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editCat, setEditCat] = useState(null); // { id, name }
  const [deleteCat, setDeleteCat] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${config.API_BASE_URL}/admin/get-category.php`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") {
          // normalize: حوّل id_cat إلى id
          const normalized = (d.data || []).map((c) => ({
            ...c,
            id: c.id_cat,
          }));
          setCategories(normalized);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Add ──
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/add-category.php`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      showToast(data.message || "Category added");
      setName("");
      fetchCategories();
    } catch {
      showToast("Something went wrong", "error");
    }
    setSubmitting(false);
  };

  // ── Edit save ──
  const handleEditSave = async () => {
    if (!editCat?.name?.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/admin/update-category.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editCat.id, name: editCat.name }),
        }
      );
      const data = await res.json();
      showToast(data.message || "Category updated");
      setEditCat(null);
      fetchCategories();
    } catch {
      showToast("Update failed", "error");
    }
  };

  // ── Delete ──
  const handleDelete = async (cat) => {
    try {
      await fetch(
        `${config.API_BASE_URL}/admin/delete-category.php?id=${cat.id_cat}`,
        { method: "DELETE" }
      );
      showToast(`"${cat.name}" deleted`);
      setDeleteCat(null);
      fetchCategories();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = (categories || [])
    .filter((c) => c != null && typeof c === "object" && c.name != null)
    .filter((c) => String(c.name).toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Toast toast={toast} />
      <AnimatePresence>
        {deleteCat && (
          <DeleteModal
            cat={deleteCat}
            onConfirm={handleDelete}
            onClose={() => setDeleteCat(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-full  px-8 py-8 font-['DM_Sans']">
        {/* ── Page Header ── */}
        <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
            Management
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-light text-black/70 dark:text-white/80">
                Categories
              </h1>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-white/40 gap-2">
              <Link to="/index" className="hover:text-orange-700 dark:hover:text-orange-500">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-white/60 font-medium">Categories</span>
            </div>
            <span className="text-[0.62rem] text-gray-400 dark:text-white/20 tracking-wide hidden sm:block">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="h-px bg-black/[0.07] dark:bg-white/5 mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT — Add Form ── */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-1">
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden sticky top-6">
              {/* Form header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
                <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                  New
                </p>
                <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  Add Category
                </h3>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-4">
                {/* Name input */}
                <div>
                  <label
                    className="block text-[0.58rem] tracking-[0.18em] uppercase
                    text-gray-400 dark:text-white/30 mb-1.5"
                  >
                    Category Name
                  </label>
                  <div className="relative">
                    <i
                      className="fa-solid fa-tag absolute left-3.5 top-1/2 -translate-y-1/2
                      text-[0.65rem] text-gray-300 pointer-events-none"
                    ></i>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Electronics"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5
                        rounded-lg text-[0.82rem] text-gray-800 dark:text-white/80 outline-none
                        focus:border-orange-400 dark:focus:border-orange-500/50 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10
                        transition-all placeholder-gray-300 dark:placeholder-white/10"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#FC8C06] rounded-lg text-white
                    text-[0.72rem] tracking-widest uppercase font-medium
                    hover:bg-[#d97500] active:scale-[0.98] transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus text-[0.6rem]"></i>
                      Add Category
                    </>
                  )}
                </button>
              </form>

              {/* Stats */}
              <div className="px-6 pb-6">
                <div className="bg-gray-50 dark:bg-white/[0.02] rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-white/5">
                  <div>
                    <p className="text-[0.58rem] tracking-widest uppercase text-gray-400 dark:text-white/20 mb-0.5">
                      Total
                    </p>
                    <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-light text-gray-900 dark:text-white/90 leading-none">
                      {categories.length}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl
                    flex items-center justify-center"
                  >
                    <i className="fa-solid fa-layer-group text-orange-400 dark:text-orange-400/80"></i>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Table ── */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 gap-3">
                <div>
                  <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                    All
                  </p>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                    Categories
                  </h3>
                </div>
                {/* Search */}
                <div
                  className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                  rounded-lg px-3 py-2 max-w-[220px] w-full"
                >
                  <i className="fa-solid fa-magnifying-glass text-[0.65rem] text-gray-300 dark:text-white/20"></i>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-[0.78rem]
                      text-gray-700 dark:text-white/70 w-full placeholder-gray-300 dark:placeholder-white/10"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      <i className="fa-solid fa-xmark text-xs"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Table body */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                   <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/20">
                    Loading
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/[0.03] rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-layer-group text-gray-300 dark:text-white/20 text-lg"></i>
                  </div>
                  <p className="text-[0.75rem] text-gray-400 dark:text-white/30">
                    {search
                      ? "No categories match your search"
                      : "No categories yet"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 dark:border-white/5">
                        <th
                          className="text-left text-[0.55rem] tracking-[0.18em] uppercase
                          text-gray-400 dark:text-white/30 px-6 py-3 font-medium"
                        >
                          #
                        </th>
                        <th
                          className="text-left text-[0.55rem] tracking-[0.18em] uppercase
                          text-gray-400 dark:text-white/30 px-6 py-3 font-medium"
                        >
                          Name
                        </th>
                        <th
                          className="text-right text-[0.55rem] tracking-[0.18em] uppercase
                          text-gray-400 dark:text-white/30 px-6 py-3 font-medium"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filtered.map((cat, i) => (
                          <motion.tr
                            key={cat.id_cat}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                             transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.01]
                              transition-colors group"
                          >
                            {/* # */}
                            <td className="px-6 py-3.5 w-14">
                              <span
                                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-white/30
                                flex items-center justify-center text-[0.6rem] font-bold"
                              >
                                {i + 1}
                              </span>
                            </td>

                            {/* Name — inline edit */}
                            <td className="px-6 py-3.5">
                              {editCat?.id === cat.id_cat ? (
                                <input
                                  autoFocus
                                  value={editCat.name}
                                  onChange={(e) =>
                                    setEditCat({
                                      ...editCat,
                                      name: e.target.value,
                                    })
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleEditSave();
                                    if (e.key === "Escape") setEditCat(null);
                                  }}
                                  className="w-full px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30
                                    rounded-lg text-[0.82rem] text-gray-800 dark:text-white/80 outline-none
                                    focus:ring-2 focus:ring-orange-500/15 transition-all"
                                />
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-7 h-7 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20
                                    rounded-lg flex items-center justify-center shrink-0"
                                  >
                                    <i className="fa-solid fa-tag text-orange-400 dark:text-orange-400/80 text-[0.55rem]"></i>
                                  </div>
                                  <span className="text-[0.8rem] font-medium text-gray-700 dark:text-white/70">
                                    {cat.name ?? "—"}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-1.5 justify-end">
                                {editCat?.id === cat.id_cat ? (
                                  <>
                                     <button
                                      onClick={handleEditSave}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-500/10
                                        border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-lg
                                        text-[0.65rem] tracking-wide hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                                    >
                                      <i className="fa-solid fa-check text-[0.55rem]"></i>
                                      Save
                                    </button>
                                     <button
                                      onClick={() => setEditCat(null)}
                                      className="px-3 py-1.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                                        text-gray-500 dark:text-white/40 rounded-lg text-[0.65rem] tracking-wide
                                        hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        setEditCat({
                                          id: cat.id_cat,
                                          name: cat.name ?? "",
                                        })
                                      }
                                      className="w-8 h-8 flex items-center justify-center rounded-lg
                                        bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-500
                                        lg:opacity-0 lg:group-hover:opacity-100 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-all"
                                    >
                                      <i className="fa-solid fa-pen text-[0.6rem]"></i>
                                    </button>
                                    <button
                                      onClick={() => setDeleteCat(cat)}
                                      className="w-8 h-8 flex items-center justify-center rounded-lg
                                        bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-400
                                        lg:opacity-0 lg:group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                                    >
                                      <i className="fa-solid fa-trash-can text-[0.6rem]"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer */}
              {!loading && filtered.length > 0 && (
                <div
                  className="px-6 py-3 bg-gray-50/60 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5
                  flex items-center justify-between"
                >
                  <span className="text-[0.6rem] tracking-wider uppercase text-gray-400 dark:text-white/20">
                    {filtered.length} categor
                    {filtered.length !== 1 ? "ies" : "y"}
                    {search && ` matching "${search}"`}
                  </span>
                  <span className="text-[0.6rem] text-gray-400 dark:text-white/20">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded text-[0.58rem]">
                      Enter
                    </kbd>{" "}
                    to save edit
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
