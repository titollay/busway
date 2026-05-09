import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
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
function DeleteModal({ product, onConfirm, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl p-7 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center justify-center mb-4">
          <i className="fa-solid fa-trash-can text-red-400 dark:text-red-400/80" />
        </div>
        <p className="text-[0.55rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/30 mb-1">
          Confirm
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 mb-2">
          Delete Product?
        </h3>
        <p className="text-[0.78rem] text-gray-500 dark:text-white/50 leading-relaxed mb-6">
          Remove <strong className="text-gray-800 dark:text-white/70">{product?.name}</strong>?
          This cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-white/40
              text-[0.7rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(product)}
            className="flex-1 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-500 dark:text-red-400
              text-[0.7rem] tracking-widest uppercase hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Product Form Modal (Add / Edit)
// ─────────────────────────────────────────────
function ProductModal({ product, categories, onSave, onClose }) {
  const isEdit = !!product?.id_products;
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: product?.name || "",
    id_cat: product?.id_cat || "",
    description: product?.description || "",
    status: product?.status || "active",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    product?.image
      ? `${config.ASSETS_BASE_URL}/${product.image}`
      : null
  );
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target.result);
    r.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.id_cat || !form.description.trim()) return;
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (isEdit) fd.append("id_products", product.id_products);
    if (image) fd.append("image", image);
    await onSave(fd, isEdit);
    setSaving(false);
  };

  const inputCls =
    "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[0.82rem] text-gray-800 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-gray-300";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white dark:bg-[#111] z-10">
          <div>
            <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
              {isEdit ? "Edit" : "New"}
            </p>
            <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
              {isEdit ? form.name : "Add Product"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.03]
              border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Name <span className="text-orange-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Product name"
              className={inputCls}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Category <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.id_cat}
                onChange={(e) => set("id_cat", e.target.value)}
                className={`${inputCls} appearance-none pr-9`}
              >
                <option value="" disabled className="dark:bg-[#111]">
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.id_cat} value={c.id_cat} className="dark:bg-[#111]">
                    {c.name}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.6rem] text-gray-300 dark:text-white/20 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Description <span className="text-orange-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {["active", "inactive"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className={`flex-1 py-2 rounded-lg text-[0.65rem] tracking-widest uppercase border transition-all
                    ${
                      form.status === s
                        ? s === "active"
                          ? "bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30 text-green-600 dark:text-green-400"
                          : "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400"
                        : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                >
                  <i
                    className={`fa-solid fa-${
                      s === "active" ? "circle-check" : "circle-xmark"
                    } mr-1.5 text-[0.6rem]`}
                  />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleImage(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl cursor-pointer transition-all
                ${
                  preview
                    ? "border-orange-200 dark:border-orange-500/50 bg-orange-50/20 dark:bg-orange-500/5"
                    : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] hover:border-orange-300 dark:hover:border-orange-500/40"
                }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files[0])}
              />
              {preview ? (
                <div className="relative p-3">
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-32 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/20 rounded-full
                      flex items-center justify-center text-red-400 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <i className="fa-solid fa-xmark text-[0.6rem]" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 gap-2">
                  <i className="fa-solid fa-cloud-arrow-up text-gray-300 dark:text-white/10 text-2xl" />
                  <p className="text-[0.72rem] text-gray-400 dark:text-white/20">
                    Drop or <span className="text-orange-500 dark:text-orange-400">browse</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/30
                text-[0.7rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#FC8C06] rounded-xl text-white text-[0.7rem] tracking-widest
                uppercase hover:bg-[#d97500] transition-colors disabled:opacity-50
                flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk text-[0.6rem]" />
                  {isEdit ? "Save Changes" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────
function ProductCard({ product, catName, onEdit, onDelete, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden group
        hover:shadow-md dark:hover:shadow-white/[0.02] hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-50 dark:bg-white/[0.02] overflow-hidden">
        {product.image ? (
          <img
            src={`${config.ASSETS_BASE_URL}/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fa-solid fa-image text-gray-200 dark:text-white/5 text-4xl" />
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 text-[0.55rem] tracking-widest uppercase
          px-2.5 py-1 rounded-full border font-semibold
          ${
            product.status === "active"
              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400"
          }`}
        >
          {product.status}
        </span>
        {/* Action buttons — hover */}
        <div className="absolute top-3 right-3 flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#111] border border-orange-200 dark:border-orange-500/30
              rounded-lg text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 shadow-sm transition-colors"
          >
            <i className="fa-solid fa-pen text-[0.6rem]" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/30
              rounded-lg text-red-400 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10 shadow-sm transition-colors"
          >
            <i className="fa-solid fa-trash-can text-[0.6rem]" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-[0.85rem] font-semibold text-gray-800 dark:text-white/80 leading-tight line-clamp-2">
            {product.name}
          </h4>
          <span className="text-[0.58rem] text-gray-400 dark:text-white/20 shrink-0">
            #{product.id_products}
          </span>
        </div>
        <p className="text-[0.72rem] text-gray-400 dark:text-white/40 line-clamp-2 mb-3 leading-relaxed">
          {product.description || "—"}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 text-[0.62rem] text-orange-600 dark:text-orange-400
            bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-2 py-1 rounded-full"
          >
            <i className="fa-solid fa-tag text-[0.5rem]" />
            {catName || "—"}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(product)}
              className="text-[0.62rem] px-2.5 py-1 bg-orange-50 border border-orange-100
                text-orange-500 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="text-[0.62rem] px-2.5 py-1 bg-red-50 border border-red-100
                text-red-400 rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [view, setView] = useState("grid"); // grid | table
  const [page, setPage] = useState(0);
  const [editProd, setEditProd] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteProd, setDeleteProd] = useState(null);
  const [toast, setToast] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paged.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paged.map((p) => p.id_products));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch(`${config.API_BASE_URL}/admin/get-products.php`).then((r) =>
        r.json()
      ),
      fetch(`${config.API_BASE_URL}/admin/get-category.php`).then((r) =>
        r.json()
      ),
    ])
      .then(([p, c]) => {
        if (p.status === "success") setProducts(p.data || []);
        if (c.status === "success") setCategories(c.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Filter
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const mQ = !q || `${p.name} ${p.description}`.toLowerCase().includes(q);
    const mC = catFilter === "all" || String(p.id_cat) === String(catFilter);
    const mS = statusF === "all" || p.status === statusF;
    return mQ && mC && mS;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const getCatName = (id) =>
    categories.find((c) => String(c.id_cat) === String(id))?.name || "—";

  // Save (add or edit)
  const handleSave = async (fd, isEdit) => {
    const url = isEdit
      ? `${config.API_BASE_URL}/admin/update-product.php`
      : `${config.API_BASE_URL}/admin/add-products.php`;
    try {
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json();
      showToast(data.message || (isEdit ? "Product updated" : "Product added"));
      setEditProd(null);
      setShowAdd(false);
      fetchAll();
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  // Delete
  const handleDelete = async (prod) => {
    try {
      await fetch(
        `${config.API_BASE_URL}/admin/delete-product.php?id=${prod.id_products}`,
        { method: "DELETE" }
      );
      showToast(`"${prod.name}" deleted`);
      setDeleteProd(null);
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // Bulk Action
  const handleBulkAction = async (action, value = null) => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selectedIds.length} products?`)) return;

    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/bulk-ops.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "products", action, ids: selectedIds, value }),
      });
      
      if (!res.ok) {
        showToast(`Server error: ${res.status}`, "error");
        return;
      }

      const text = (await res.text()).trim();
      try {
        const data = JSON.parse(text);
        showToast(data.message, data.status === "success" ? "success" : "error");
        if (data.status === "success") {
          setSelectedIds([]);
          fetchAll();
        }
      } catch (e) {
        showToast("Invalid server response", "error");
        console.error("Non-JSON response:", text);
      }
    } catch (err) {
      showToast("Network error", "error");
      console.error(err);
    }
  };

  // Export CSV
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = filtered.map((p) => [
      p.id_products,
      p.name,
      getCatName(p.id_cat),
      p.price,
      p.stock,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${config.BRAND_NAME.toLowerCase()}_products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const td = "px-4 py-3.5 text-[0.78rem] text-gray-600 dark:text-white/60 border-b border-gray-50 dark:border-white/5";

  return (
    <>
      <Toast toast={toast} />
      <AnimatePresence>
        {deleteProd && (
          <DeleteModal
            product={deleteProd}
            onConfirm={handleDelete}
            onClose={() => setDeleteProd(null)}
          />
        )}
        {(showAdd || editProd) && (
          <ProductModal
            product={editProd || null}
            categories={categories}
            onSave={handleSave}
            onClose={() => {
              setShowAdd(false);
              setEditProd(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-full  px-8 py-8 font-['DM_Sans']">
        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
            Management
          </p>
          <div className="flex items-end justify-between flex-wrap gap-3">
            <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light text-[#1a1a1a] dark:text-white/90 leading-none">
              Products
            </h1>
            <div className="flex items-center text-sm text-gray-500 dark:text-white/40 gap-2">
              <Link to={"/"}>
                <p className="hover:text-orange-500 dark:hover:text-orange-400">Home</p>
              </Link>
              <span>/</span>

              <span className="text-gray-700 dark:text-white/60 font-medium">Product</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[0.62rem] text-black/30 dark:text-white/20 tracking-wide hidden sm:block">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden sm:block" />
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-white/50
                text-[0.68rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <i className="fa-solid fa-file-csv text-[0.8rem]" />
                Export
              </button>
              {/* View toggle */}
              <div className="flex bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                {[
                  ["grid", "fa-grip"],
                  ["table", "fa-list"],
                ].map(([v, ic]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`w-9 h-9 flex items-center justify-center transition-colors
                       ${
                        view === v
                          ? "bg-orange-500 text-white"
                          : "text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60"
                      }`}
                  >
                    <i className={`fa-solid ${ic} text-[0.7rem]`} />
                  </button>
                ))}
              </div>
              <Link to={"/index/products/AddProducts"}>
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FC8C06] rounded-lg text-white
                  text-[0.68rem] tracking-widest uppercase hover:bg-[#d97500] transition-colors"
                >
                  <i className="fa-solid fa-plus text-[0.6rem]" />
                  Add Product
                </button>
              </Link>
            </div>
          </div>
           <div className="h-px bg-black/[0.07] dark:bg-white/5 mt-4" />
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          {...fadeUp(0.08)}
          className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 mb-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
             <div
              className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
              rounded-lg px-3.5 py-2.5 flex-1 min-w-[200px] max-w-xs"
            >
              <i className="fa-solid fa-magnifying-glass text-[0.65rem] text-gray-300 dark:text-white/20" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                 placeholder="Search products..."
                className="bg-transparent border-none outline-none text-[0.78rem] text-gray-700 dark:text-white/70 w-full placeholder-gray-300 dark:placeholder-white/10"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(0);
                  }}
                   className="text-gray-300 dark:text-white/10 hover:text-gray-500 dark:hover:text-white/30"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            {/* Category filter */}
             <div className="relative">
              <i className="fa-solid fa-layer-group absolute left-3 top-1/2 -translate-y-1/2 text-[0.6rem] text-gray-300 dark:text-white/20 pointer-events-none" />
               <select
                value={catFilter}
                onChange={(e) => {
                  setCatFilter(e.target.value);
                  setPage(0);
                }}
                className="pl-8 pr-8 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg
                  text-[0.75rem] text-gray-600 dark:text-white/50 outline-none appearance-none
                  focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all"
              >
                 <option value="all" className="dark:bg-[#1a1a1a]">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id_cat} value={c.id_cat}>
                    {c.name}
                  </option>
                ))}
              </select>
               <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[0.58rem] text-gray-300 dark:text-white/20 pointer-events-none" />
            </div>

            {/* Status filter */}
            <div className="flex gap-1.5">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["inactive", "Inactive"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => {
                    setStatusF(v);
                    setPage(0);
                  }}
                   className={`px-3.5 py-2 rounded-lg text-[0.62rem] tracking-wide border transition-all
                    ${
                      statusF === v
                        ? "bg-orange-500/10 dark:bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400"
                        : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20"
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>

             <span className="text-[0.62rem] tracking-widest uppercase text-gray-400 dark:text-white/20 ml-auto">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/20">
              Loading
            </p>
          </div>
        ) : filtered.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-box-open text-gray-300 dark:text-white/10 text-2xl" />
            </div>
            <p className="text-[0.82rem] text-gray-400 dark:text-white/30">No products found</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-5 py-2.5 bg-[#FC8C06] rounded-lg text-white text-[0.7rem]
                tracking-widest uppercase hover:bg-[#d97500] transition-colors"
            >
              Add First Product
            </button>
          </div>
        ) : view === "grid" ? (
          /* ── GRID ── */
          <motion.div
            {...fadeUp(0.12)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {paged.map((p, i) => (
              <ProductCard
                key={p.id_products}
                product={p}
                catName={getCatName(p.id_cat)}
                onEdit={setEditProd}
                onDelete={setDeleteProd}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          /* ── TABLE ── */
           <motion.div
            {...fadeUp(0.12)}
            className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
               <table className="w-full border-collapse" style={{ minWidth: "820px" }}>
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paged.length && paged.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-orange-500 focus:ring-orange-500/20 bg-transparent"
                      />
                    </th>
                    {[
                      "#",
                      "Image",
                      "Name",
                      "Category",
                      "Description",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[0.55rem] tracking-[0.18em] uppercase
                        text-gray-400 dark:text-white/30 px-4 py-3 font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paged.map((p, i) => (
                      <motion.tr
                        key={p.id_products}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="hover:bg-gray-50/60 dark:hover:bg-white/[0.01] transition-colors group border-b border-gray-50 dark:border-white/5 last:border-0"
                      >
                        <td className={td}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(p.id_products)}
                            onChange={() => toggleSelectOne(p.id_products)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-orange-500 focus:ring-orange-500/20 bg-transparent"
                          />
                        </td>
                        <td className={td}>
                          <span className="text-gray-400">
                            #{p.id_products}
                          </span>
                        </td>
                        <td className={td}>
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                            {p.image ? (
                              <img
                                src={`${config.ASSETS_BASE_URL}/${p.image}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <i className="fa-solid fa-image text-gray-300 text-sm" />
                            )}
                          </div>
                        </td>
                        <td className={td}>
                          <p className="font-medium text-gray-800 text-[0.8rem]">
                            {p.name}
                          </p>
                        </td>
                        <td className={td}>
                          <span
                            className="text-[0.62rem] text-orange-600 bg-orange-50 border border-orange-100
                            px-2.5 py-1 rounded-full"
                          >
                            {getCatName(p.id_cat)}
                          </span>
                        </td>
                        <td className={`${td} max-w-[200px]`}>
                          <p className="truncate text-gray-400 text-[0.72rem]">
                            {p.description || "—"}
                          </p>
                        </td>
                        <td className={td}>
                          <span
                            className={`text-[0.6rem] tracking-widest uppercase px-2.5 py-1 rounded-full border font-semibold
                            ${
                              p.status === "active"
                                ? "bg-green-50 border-green-200 text-green-600"
                                : "bg-red-50 border-red-200 text-red-500"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className={td}>
                          <div className="flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditProd(p)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg
                                bg-orange-50 border border-orange-100 text-orange-500 hover:bg-orange-100 transition-colors"
                            >
                              <i className="fa-solid fa-pen text-[0.6rem]" />
                            </button>
                            <button
                              onClick={() => setDeleteProd(p)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg
                                bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 transition-colors"
                            >
                              <i className="fa-solid fa-trash-can text-[0.6rem]" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-5">
            <span className="text-[0.62rem] tracking-widest uppercase text-gray-400">
              {page * PER_PAGE + 1}–
              {Math.min((page + 1) * PER_PAGE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-400
                  text-[0.62rem] tracking-widest uppercase disabled:opacity-30
                  hover:border-gray-300 transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-[0.72rem] transition-colors
                    ${
                      page === i
                        ? "bg-orange-500 text-white border border-orange-500"
                        : "bg-white border border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-400
                  text-[0.62rem] tracking-widest uppercase disabled:opacity-30
                  hover:border-gray-300 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bulk Actions Bar ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-6 px-6 py-4
              bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/20"
          >
            <div className="flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </div>
              <p className="text-[0.7rem] uppercase tracking-widest text-gray-500 dark:text-white/40 font-bold">
                Selected
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("status", "active")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 dark:hover:bg-green-500/10 text-green-600 dark:text-green-400
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-check-double" />
                Activate
              </button>
              <button
                onClick={() => handleBulkAction("status", "inactive")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/40
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-eye-slash" />
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400
                  rounded-xl text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
              >
                <i className="fa-solid fa-trash-can" />
                Delete
              </button>
            </div>

            <div className="w-px h-6 bg-gray-100 dark:bg-white/10 mx-2" />

            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-gray-400 dark:text-white/20 hover:text-gray-600 dark:hover:text-white/40
                text-[0.65rem] uppercase tracking-widest font-bold transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

