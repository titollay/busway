import { useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
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
function DeleteModal({ item, onConfirm, onClose }) {
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
          Delete Variant?
        </h3>
        <p className="text-[0.78rem] text-gray-500 dark:text-white/50 leading-relaxed mb-6">
          Remove <strong className="text-gray-800 dark:text-white/70">{item?.name}</strong>? This
          cannot be undone.
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
            onClick={() => onConfirm(item)}
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
// Edit Variant Modal
// ─────────────────────────────────────────────
function EditModal({ variant, onSave, onClose }) {
  const { currency } = useSettings();
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: variant.name || "",
    description: variant.description || "",
    price: variant.price || "",
    stock: variant.stock || "",
    status: variant.status || "active",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    variant.image
      ? `${config.ASSETS_BASE_URL}/${variant.image}`
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
    if (!form.name.trim() || !form.price || !form.stock) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("id_product", variant.id_product);
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("status", form.status);
    if (image) fd.append("image", image);
    await onSave(fd);
    setSaving(false);
  };

  const inputCls =
    "w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-[0.82rem] text-gray-800 dark:text-white/80 outline-none focus:border-orange-400 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-gray-300 dark:placeholder-white/10";

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
        className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white dark:bg-[#111] z-10">
          <div>
            <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
              Edit
            </p>
            <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
              {variant.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Variant Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Size M / 256GB"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Description
            </label>
            <input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short description"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                Price ({currency}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
          </div>
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
                    className="w-full h-28 object-contain rounded-lg"
                  />
                   <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/20 rounded-full flex items-center justify-center text-red-400 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <i className="fa-solid fa-xmark text-[0.6rem]" />
                  </button>
                </div>
              ) : (
                 <div className="flex flex-col items-center py-6 gap-2">
                  <i className="fa-solid fa-cloud-arrow-up text-gray-300 dark:text-white/10 text-xl" />
                  <p className="text-[0.7rem] text-gray-400 dark:text-white/20">
                    Drop or <span className="text-orange-500 dark:text-orange-400">browse</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/30 text-[0.7rem] tracking-widest uppercase hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#FC8C06] rounded-xl text-white text-[0.7rem] tracking-widest uppercase hover:bg-[#d97500] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk text-[0.6rem]" />
                  Save Changes
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
// Add Variant Panel
// ─────────────────────────────────────────────
export function AddVariant({ products, onAdded }) {
  const { currency } = useSettings();
  const fileRef = useRef();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const showMsg = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target.result);
    r.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedProduct ||
      !form.name.trim() ||
      !form.price ||
      form.stock === ""
    ) {
      showMsg("Please fill all required fields", "error");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("id_products", selectedProduct);
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("status", form.status);
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/add-product.php`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.status === "success") {
        showMsg(data.message || "Variant added");
        setForm({
          name: "",
          description: "",
          price: "",
          stock: "",
          status: "active",
        });
        setImage(null);
        setPreview(null);
        onAdded();
      } else {
        showMsg(data.message || "Something went wrong", "error");
      }
    } catch {
      showMsg("Error adding variant", "error");
    }
    setSaving(false);
  };

   const inputCls =
    "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg text-[0.8rem] text-gray-800 dark:text-white/80 outline-none focus:border-orange-400 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10 transition-all placeholder-gray-300 dark:placeholder-white/10";
  const selectedProd = products.find(
    (p) => String(p.id_products) === String(selectedProduct)
  );

  return (
     <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden sticky top-6">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
        <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
          New
        </p>
        <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
          Add Variant
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
         <div>
          <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
            Parent Product <span className="text-orange-500">*</span>
          </label>
           <div className="relative">
            <i className="fa-solid fa-box absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.6rem] text-gray-300 dark:text-white/20 pointer-events-none" />
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`${inputCls} appearance-none pl-9 pr-8`}
            >
               <option value="" disabled className="dark:bg-[#111]">
                Select product
              </option>
              {products.map((p) => (
                <option key={p.id_products} value={p.id_products} className="dark:bg-[#111]">
                  {p.name}
                </option>
              ))}
            </select>
             <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[0.58rem] text-gray-300 dark:text-white/20 pointer-events-none" />
          </div>
          <AnimatePresence>
            {selectedProd && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1.5 flex items-center gap-1.5"
              >
                 <i className="fa-solid fa-arrow-turn-down-right text-orange-400 dark:text-orange-400/80 text-[0.6rem]" />
                <span className="text-[0.65rem] text-orange-600 dark:text-orange-400">
                  Adding variant to: <strong className="dark:text-white/80">{selectedProd.name}</strong>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

         <div>
          <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
            Variant Name <span className="text-orange-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Size M / 256GB / Black"
            className={inputCls}
          />
        </div>

         <div>
          <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
            Description
          </label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short note..."
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
            <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Price <span className="text-orange-500">*</span>
            </label>
             <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.7rem] text-gray-400 dark:text-white/20 font-medium">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>
           <div>
            <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Stock <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="0"
              className={inputCls}
            />
          </div>
        </div>

         <div>
          <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            {["active", "inactive"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className={`flex-1 py-1.5 rounded-lg text-[0.6rem] tracking-widest uppercase border transition-all
                   ${
                    form.status === s
                      ? s === "active"
                        ? "bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30 text-green-600 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-500 dark:text-red-400"
                      : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

         <div>
          <label className="block text-[0.57rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
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
                  className="w-full h-24 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setPreview(null);
                  }}
                   className="absolute top-3.5 right-3.5 w-5 h-5 bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/20 rounded-full flex items-center justify-center text-red-400 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10 text-[0.55rem] transition-colors"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ) : (
               <div className="flex items-center justify-center gap-2 py-5">
                <i className="fa-solid fa-cloud-arrow-up text-gray-300 dark:text-white/10 text-lg" />
                 <p className="text-[0.7rem] text-gray-400 dark:text-white/20">
                  Drop or <span className="text-orange-500 dark:text-orange-400">browse</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {msg && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
               className={`text-[0.72rem] px-3 py-2 rounded-lg border ${
                msg.type === "success"
                  ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400"
              }`}
            >
              <i
                className={`fa-solid fa-${
                  msg.type === "success" ? "circle-check" : "circle-xmark"
                } mr-1.5`}
              />
              {msg.text}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-[#FC8C06] rounded-xl text-white text-[0.7rem] tracking-widest uppercase
            hover:bg-[#d97500] transition-colors disabled:opacity-50 flex items-center justify-center gap-2
            shadow-lg shadow-orange-500/20"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <i className="fa-solid fa-plus text-[0.6rem]" />
              Add Variant
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Variants Table
// ─────────────────────────────────────────────
const GROUP_PAGE_SIZE = 5;

const TH = ({ children, right = false }) => (
  <th
    className={`text-[0.52rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 px-4 py-3 font-medium whitespace-nowrap
    ${right ? "text-right" : "text-left"}`}
  >
    {children}
  </th>
);

const TD = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-[0.78rem] text-gray-600 dark:text-white/60 ${className}`}>{children}</td>
);

function VariantsTable({ variants, products, onEdit, onDelete, loading }) {
  const { currency } = useSettings();
  const [openGroups, setOpenGroups] = useState({});
  const [groupPages, setGroupPages] = useState({});
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");

  const filtered = variants.filter((v) => {
    const q = search.toLowerCase();
    const mQ =
      !q || `${v.name} ${v.description || ""}`.toLowerCase().includes(q);
    const mS = statusF === "all" || v.status === statusF;
    return mQ && mS;
  });

  const grouped = filtered.reduce((acc, v) => {
    const pid = v.id_products;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(v);
    return acc;
  }, {});

  const getParentName = (id) =>
    products.find((p) => String(p.id_products) === String(id))?.name ||
    `Product #${id}`;

  const toggleGroup = (id) => setOpenGroups((s) => ({ ...s, [id]: !s[id] }));
  const getPage = (pid) => groupPages[pid] || 0;
  const setPage = (pid, p) => setGroupPages((s) => ({ ...s, [pid]: p }));

  // open all groups on first data load
  useEffect(() => {
    const init = {};
    variants.forEach((v) => {
      init[v.id_products] = true;
    });
    setOpenGroups(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.length]);

  // reset pages on filter change
  useEffect(() => {
    setGroupPages({});
  }, [search, statusF]);

  const stockBadge = (n) => {
    const num = parseInt(n || 0);
    if (num <= 0) return "text-red-500   bg-red-50   dark:bg-red-500/10   border-red-200   dark:border-red-500/20";
    if (num <= 5) return "text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20";
    return "text-green-600 bg-green-50  dark:bg-green-500/10  border-green-200  dark:border-green-500/20";
  };

  if (loading)
    return (
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gray-400 dark:text-white/20">
          Loading
        </p>
      </div>
    );

   return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
       <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-white/10 flex-wrap gap-3">
        <div>
          <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
            All
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
            Variants
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
           <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 w-44">
            <i className="fa-solid fa-magnifying-glass text-[0.6rem] text-gray-300 dark:text-white/10 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-[0.78rem] text-gray-700 dark:text-white/70 w-full placeholder-gray-300 dark:placeholder-white/10"
            />
            {search && (
               <button
                onClick={() => setSearch("")}
                className="text-gray-300 dark:text-white/10 hover:text-gray-500 dark:hover:text-white/30 shrink-0"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div className="flex gap-1">
            {[
              ["all", "All"],
              ["active", "Active"],
              ["inactive", "Inactive"],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusF(val)}
                className={`px-3 py-1.5 rounded-lg text-[0.8rem] tracking-wide border transition-all
                   ${
                    statusF === val
                      ? "bg-[#FC8C06]/10 border-[#FC8C06] text-[#FC8C06]"
                      : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Empty ── */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 bg-gray-50 dark:bg-white/[0.02] rounded-full flex items-center justify-center">
            <i className="fa-solid fa-layer-group text-gray-300 dark:text-white/10 text-lg" />
          </div>
          <p className="text-[0.75rem] text-gray-400 dark:text-white/20">
            {search ? "No variants match your search" : "No variants yet"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {Object.entries(grouped).map(([pid, pvariants]) => {
            const isOpen = openGroups[pid] !== false;
            const page = getPage(pid);
            const totalPages = Math.ceil(pvariants.length / GROUP_PAGE_SIZE);
            const paged = pvariants.slice(
              page * GROUP_PAGE_SIZE,
              (page + 1) * GROUP_PAGE_SIZE
            );
            const totalStock = pvariants.reduce(
              (s, v) => s + parseInt(v.stock || 0),
              0
            );

            return (
              <div key={pid}>
                {/* ── Group header ── */}
                 <button
                  onClick={() => toggleGroup(pid)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-box text-orange-400 dark:text-orange-400/80 text-[0.6rem]" />
                    </div>
                     <div className="text-left">
                      <p className="text-[0.83rem] font-semibold text-gray-800 dark:text-white/80 leading-tight">
                        {getParentName(pid)}
                      </p>
                      <p className="text-[0.62rem] text-gray-400 dark:text-white/30 mt-0.5">
                        {pvariants.length} variant
                        {pvariants.length !== 1 ? "s" : ""}
                        <span className="mx-1.5 text-gray-300 dark:text-white/10">·</span>
                        stock:{" "}
                        <span className="text-gray-600 dark:text-white/50 font-medium">
                          {totalStock}
                        </span>
                      </p>
                    </div>
                  </div>
                   <motion.i
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="fa-solid fa-chevron-down text-[0.65rem] text-gray-400 dark:text-white/20"
                  />
                </button>

                {/* ── Variants table ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                       className="overflow-hidden border-t border-gray-50 dark:border-white/5"
                    >
                      <div className="overflow-x-auto">
                        <table
                          className="w-full border-collapse"
                          style={{ tableLayout: "fixed", minWidth: "700px" }}
                        >
                          <colgroup>
                            <col style={{ width: "32%" }} />
                            <col style={{ width: "28%" }} />
                            <col style={{ width: "13%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "7%" }} />
                          </colgroup>

                          <thead>
                             <tr className="bg-gray-50/70 dark:bg-white/[0.01]">
                              <TH>Variant</TH>
                              <TH>Description</TH>
                              <TH>Price</TH>
                              <TH>Stock</TH>
                              <TH>Status</TH>
                              <TH right>Actions</TH>
                            </tr>
                          </thead>

                          <tbody>
                            {paged.map((v, i) => (
                              <motion.tr
                                key={v.id_product}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.18, delay: i * 0.03 }}
                                 className="border-t border-gray-50 dark:border-white/5 hover:bg-orange-50/20 dark:hover:bg-orange-500/[0.02] transition-colors group"
                              >
                                {/* Variant name + image */}
                                <TD>
                                   <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.05] overflow-hidden shrink-0 flex items-center justify-center">
                                      {v.image ? (
                                        <img
                                          src={`${config.ASSETS_BASE_URL}/${v.image}`}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                         <i className="fa-solid fa-image text-gray-300 dark:text-white/10 text-[0.7rem]" />
                                      )}
                                    </div>
                                     <div className="min-w-0">
                                      <p className="text-[0.78rem] font-medium text-gray-800 dark:text-white/80 truncate">
                                        {v.name}
                                      </p>
                                      <p className="text-[0.58rem] text-gray-400 dark:text-white/20">
                                        #{v.id_product}
                                      </p>
                                    </div>
                                  </div>
                                </TD>

                                {/* Description */}
                                 <TD className="text-gray-400 dark:text-white/20">
                                  <p className="truncate text-[0.72rem]">
                                    {v.description || "—"}
                                  </p>
                                </TD>

                                {/* Price */}
                                <TD>
                                   <span className="font-['Cormorant_Garamond'] text-[1.05rem] font-semibold text-gray-800 dark:text-white/80">
                                    {parseFloat(v.price || 0).toFixed(2)}
                                  </span>
                                  <span className="text-[0.56rem] text-gray-400 dark:text-white/20 ml-0.5">
                                    {currency}
                                  </span>
                                </TD>

                                {/* Stock */}
                                <TD>
                                  <span
                                    className={`inline-block text-[0.62rem] font-bold px-2 py-0.5 rounded-full border ${stockBadge(
                                      v.stock
                                    )}`}
                                  >
                                    {v.stock}
                                  </span>
                                </TD>

                                {/* Status */}
                                <TD>
                                  <span
                                    className={`inline-block text-[0.55rem] tracking-widest uppercase px-2 py-0.5 rounded-full border font-semibold
                                     ${
                                      v.status === "active"
                                        ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400"
                                        : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400"
                                    }`}
                                  >
                                    {v.status}
                                  </span>
                                </TD>

                                {/* Actions */}
                                <TD className="text-right">
                                  <div className="flex gap-1.5 justify-end lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                     <button
                                      onClick={() => onEdit(v)}
                                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                                    >
                                      <i className="fa-solid fa-pen text-[0.55rem]" />
                                    </button>
                                    <button
                                      onClick={() => onDelete(v)}
                                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-400 dark:text-red-400/80 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                    >
                                      <i className="fa-solid fa-trash-can text-[0.55rem]" />
                                    </button>
                                  </div>
                                </TD>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* ── Pagination ── */}
                       {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5">
                           <span className="text-[0.58rem] text-gray-400 dark:text-white/20">
                            {page * GROUP_PAGE_SIZE + 1}–
                            {Math.min(
                              (page + 1) * GROUP_PAGE_SIZE,
                              pvariants.length
                            )}
                            <span className="text-gray-300 dark:text-white/10 mx-1">of</span>
                            {pvariants.length}
                          </span>
                          <div className="flex items-center gap-1">
                             <button
                              onClick={() => setPage(pid, page - 1)}
                              disabled={page === 0}
                              className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-400 dark:text-white/20
                                hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <i className="fa-solid fa-chevron-left text-[0.55rem]" />
                            </button>

                            {Array.from({ length: totalPages }).map(
                              (_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setPage(pid, idx)}
                                  className={`w-6 h-6 flex items-center justify-center rounded border text-[0.6rem] font-medium transition-colors
                                   ${
                                    page === idx
                                      ? "bg-[#FC8C06] border-[#FC8C06] text-white"
                                      : "bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/20 hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400"
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              )
                            )}

                             <button
                              onClick={() => setPage(pid, page + 1)}
                              disabled={page === totalPages - 1}
                              className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] text-gray-400 dark:text-white/20
                                hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <i className="fa-solid fa-chevron-right text-[0.55rem]" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer ── */}
       {Object.keys(grouped).length > 0 && (
        <div className="px-6 py-3 bg-gray-50/60 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
           <span className="text-[0.6rem] tracking-wider uppercase text-gray-400 dark:text-white/30">
            {filtered.length} variant{filtered.length !== 1 ? "s" : ""}
            <span className="mx-1.5 text-gray-300 dark:text-white/10">·</span>
            {Object.keys(grouped).length} product
            {Object.keys(grouped).length !== 1 ? "s" : ""}
          </span>
          <span className="text-[0.6rem] text-gray-400 dark:text-white/20">
            Total stock:{" "}
            <strong className="text-gray-700 dark:text-white/60">
              {filtered.reduce((s, v) => s + parseInt(v.stock || 0), 0)}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ProductsPage() {
  const { currency } = useSettings();
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editVar, setEditVar] = useState(null);
  const [deleteVar, setDeleteVar] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch(`${config.API_BASE_URL}/admin/get-variants.php`).then((r) =>
        r.json()
      ),
      fetch(`${config.API_BASE_URL}/admin/get-products.php`).then((r) =>
        r.json()
      ),
    ])
      .then(([v, p]) => {
        if (v.status === "success") setVariants(v.data || []);
        if (p.status === "success") setProducts(p.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEditSave = async (fd) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/update-variant.php`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      showToast(data.message || "Variant updated");
      setEditVar(null);
      fetchAll();
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (item) => {
    try {
      await fetch(
        `${config.API_BASE_URL}/admin/delete-variant.php?id=${item.id_product}`,
        { method: "DELETE" }
      );
      showToast(`"${item.name}" deleted`);
      setDeleteVar(null);
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <Toast toast={toast} />
      <AnimatePresence>
        {deleteVar && (
          <DeleteModal
            item={deleteVar}
            onConfirm={handleDelete}
            onClose={() => setDeleteVar(null)}
          />
        )}
        {editVar && (
          <EditModal
            variant={editVar}
            onSave={handleEditSave}
            onClose={() => setEditVar(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-full px-4 sm:px-8 py-6 sm:py-8 font-['DM_Sans']">
        {/* Header */}
         <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
            Management
          </p>

          <div className="flex items-end justify-between flex-wrap gap-3">
             <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light text-[#1a1a1a] dark:text-white/90 leading-none">
              Product
            </h1>

            {/* Breadcrumb */}
             <div className="flex items-center text-sm text-gray-500 dark:text-white/30 gap-2">
              <Link to={"/"}>
                <p className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Home</p>
              </Link>
              <span>/</span>
              <span className="text-gray-700 dark:text-white/60 font-medium">Product</span>
            </div>

             <div className="flex items-center gap-2.5">
              <span className="text-[0.62rem] text-black/30 dark:text-white/20 tracking-wide hidden sm:block">
                {today}
              </span>
              <div className="w-px h-4 bg-black/10 dark:bg-white/10 hidden sm:block" />
              <Link to={"/index/product/AddProduct"}>
                <button
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

        {/* Stats row */}
        <motion.div {...fadeUp(0.08)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            {
              label: "Total Variants",
              value: variants.length,
              icon: "fa-layer-group",
              color: "orange",
            },
            {
              label: "Active",
              value: variants.filter((v) => v.status === "active").length,
              icon: "fa-circle-check",
              color: "green",
            },
            {
              label: "Out of Stock",
              value: variants.filter((v) => parseInt(v.stock || 0) === 0)
                .length,
              icon: "fa-circle-xmark",
              color: "red",
            },
          ].map((s, i) => (
             <div
              key={i}
              className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm px-5 py-4 flex items-center gap-3.5"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                 ${
                  s.color === "orange"
                    ? "bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20"
                    : s.color === "green"
                    ? "bg-green-50 dark:bg-green-500/10  border border-green-100 dark:border-green-500/20"
                    : "bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20"
                }`}
              >
                <i
                  className={`fa-solid ${s.icon} text-sm
                  ${
                    s.color === "orange"
                      ? "text-orange-400"
                      : s.color === "green"
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                />
              </div>
               <div>
                <p className="text-[0.55rem] tracking-widest uppercase text-gray-400 dark:text-white/20">
                  {s.label}
                </p>
                <p className="font-['Cormorant_Garamond'] text-[1.8rem] font-light text-gray-900 dark:text-white/90 leading-none">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table — col-span-2 كما اخترت */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2">
            <VariantsTable
              variants={variants}
              products={products}
              onEdit={setEditVar}
              onDelete={setDeleteVar}
              loading={loading}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
