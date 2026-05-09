import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import config from "../../config";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

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
          />
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AddProducts() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/admin/get-category.php`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setCategories(d.data || []);
      });
  }, []);

  const handleImage = (file) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !category || !description.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("category", category);
    fd.append("description", description.trim());
    if (image) fd.append("image", image);

    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/add-products.php`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      showToast(data.message || "Product added successfully");
      setName("");
      setCategory("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch {
      showToast("Error submitting product", "error");
    }
    setSubmitting(false);
  };

  const selectedCat = categories.find(
    (c) => String(c.id_cat) === String(category)
  );

  return (
    <>
      <Toast toast={toast} />

      <div className="min-h-full  px-8 py-8 font-['DM_Sans']">
        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} className="mb-7">
          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 dark:text-white/20 mb-1">
            Management
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-4xl font-light text-black/70 dark:text-white/80">
                Add Products
              </h1>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-white/40 gap-2">
              <Link to={"/"}>
                <p className="hover:text-orange-500 dark:hover:text-orange-400">Home</p>
              </Link>
              <span>/</span>
              <Link to={"/index/products"}>
                <span className="text-gray-700 dark:text-white/60 hover:text-orange-500 dark:hover:text-orange-400 font-medium">
                  Product
                </span>
              </Link>

              <span>/</span>
              <span className="text-gray-700 dark:text-white/70 font-medium">AddProduct</span>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[0.62rem] text-gray-400 dark:text-white/20 tracking-wide hidden sm:block">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div className="w-px h-4 bg-gray-200 dark:bg-white/10 hidden sm:block" />
            </div>
          </div>
          <div className="h-px bg-black/[0.07] dark:bg-white/5 mt-4" />
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── LEFT col — main fields ── */}
            <motion.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-5">
               {/* Product Info card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
                  <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                    Details
                  </p>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                    Product Information
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  {/* Name */}
                   <div>
                    <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                      Product Name <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <i
                        className="fa-solid fa-box absolute left-3.5 top-1/2 -translate-y-1/2
                        text-[0.65rem] text-gray-300 dark:text-white/20 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Gaming PC Ultra"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                          rounded-lg text-[0.82rem] text-gray-800 dark:text-white/80 outline-none
                          focus:border-orange-400 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10
                          transition-all placeholder-gray-300 dark:placeholder-white/10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                   <div>
                    <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                      Category <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <i
                        className="fa-solid fa-layer-group absolute left-3.5 top-1/2 -translate-y-1/2
                        text-[0.65rem] text-gray-300 dark:text-white/20 pointer-events-none"
                      />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                          rounded-lg text-[0.82rem] text-gray-800 dark:text-white/80 outline-none appearance-none
                          focus:border-orange-400 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10
                          transition-all"
                      >
                        <option value="" disabled className="dark:bg-[#111]">
                          Select a category
                        </option>
                        {categories.map((c) => (
                          <option key={c.id_cat} value={c.id_cat} className="dark:bg-[#111]">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <i
                        className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2
                        text-[0.6rem] text-gray-300 dark:text-white/20 pointer-events-none"
                      />
                    </div>
                    {/* Selected badge */}
                    <AnimatePresence>
                      {selectedCat && (
                         <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 flex items-center gap-1.5"
                        >
                          <div className="w-4 h-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded flex items-center justify-center">
                            <i className="fa-solid fa-tag text-orange-400 dark:text-orange-400/80 text-[0.45rem]" />
                          </div>
                          <span className="text-[0.68rem] text-orange-600 dark:text-orange-400 font-medium">
                            {selectedCat.name}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Description */}
                   <div>
                    <label className="block text-[0.58rem] tracking-[0.18em] uppercase text-gray-400 dark:text-white/30 mb-1.5">
                      Description <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the product..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10
                        rounded-lg text-[0.82rem] text-gray-700 dark:text-white/70 outline-none resize-none
                        focus:border-orange-400 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-orange-500/10
                        transition-all placeholder-gray-300 dark:placeholder-white/10"
                    />
                    <p className="text-[0.6rem] text-gray-400 dark:text-white/20 text-right mt-1">
                      {description.length} chars
                    </p>
                  </div>
                </div>
              </div>

               {/* Image upload card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
                  <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                    Media
                  </p>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                    Product Image
                  </h3>
                </div>

                <div className="p-6">
                  {/* Drop zone */}
                     <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl cursor-pointer
                      transition-all group
                      ${
                        preview
                          ? "border-orange-200 dark:border-orange-500/50 bg-orange-50/30 dark:bg-orange-500/5"
                          : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] hover:border-orange-300 dark:hover:border-orange-500/40 hover:bg-orange-50/20 dark:hover:bg-orange-500/[0.04]"
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
                      <div className="relative p-4">
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-48 object-contain rounded-lg"
                        />
                         <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                            setPreview(null);
                          }}
                          className="absolute top-6 right-6 w-7 h-7 bg-white dark:bg-[#111] border border-red-200 dark:border-red-500/20
                            rounded-full flex items-center justify-center text-red-400 dark:text-red-400/80
                            hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shadow-sm"
                        >
                          <i className="fa-solid fa-xmark text-[0.65rem]" />
                        </button>
                         <p className="text-center text-[0.68rem] text-gray-400 dark:text-white/30 mt-2">
                          <i className="fa-solid fa-check text-green-500 dark:text-green-400 mr-1" />
                          {image?.name}
                        </p>
                      </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div
                          className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl
                          flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                          <i className="fa-solid fa-cloud-arrow-up text-orange-400 dark:text-orange-400/80 text-lg" />
                        </div>
                        <div className="text-center">
                          <p className="text-[0.78rem] text-gray-600 dark:text-white/80 font-medium">
                            Drop image here or{" "}
                            <span className="text-orange-500 dark:text-orange-400">browse</span>
                          </p>
                          <p className="text-[0.62rem] text-gray-400 dark:text-white/20 mt-0.5">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT col — summary + submit ── */}
            <motion.div {...fadeUp(0.15)} className="lg:col-span-1 space-y-5">
               {/* Submit card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden sticky top-6">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
                  <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-0.5">
                    Publish
                  </p>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 dark:text-white/90 leading-none">
                    Save Product
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Summary checklist */}
                  {[
                    { label: "Product name", done: name.trim().length > 0 },
                    { label: "Category", done: category !== "" },
                    {
                      label: "Description",
                      done: description.trim().length > 0,
                    },
                    { label: "Image", done: image !== null, optional: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                         ${
                          item.done
                            ? "bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30"
                            : item.optional
                            ? "bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10"
                            : "bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20"
                        }`}
                      >
                        <i
                          className={`text-[0.5rem] fa-solid
                           ${
                            item.done
                              ? "fa-check text-green-500 dark:text-green-400"
                              : item.optional
                              ? "fa-minus text-gray-400 dark:text-white/20"
                              : "fa-circle text-orange-400 dark:text-orange-500"
                          }`}
                        />
                      </div>
                       <span
                        className={`text-[0.75rem] ${
                          item.done ? "text-gray-700 dark:text-white/70" : "text-gray-400 dark:text-white/20"
                        }`}
                      >
                        {item.label}
                         {item.optional && (
                          <span className="text-gray-300 dark:text-white/10 ml-1">(optional)</span>
                        )}
                      </span>
                    </div>
                  ))}

                   <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#FC8C06] rounded-xl text-white
                      text-[0.72rem] tracking-widest uppercase font-medium
                      hover:bg-[#d97500] active:scale-[0.98] transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk text-[0.65rem]" />
                        Add Product
                      </>
                    )}
                  </button>

                   <button
                    type="button"
                    onClick={() => {
                      setName("");
                      setCategory("");
                      setDescription("");
                      setImage(null);
                      setPreview(null);
                    }}
                    className="w-full py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl
                      text-gray-400 dark:text-white/30 text-[0.68rem] tracking-widest uppercase
                      hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-500 dark:hover:text-white/50 transition-all"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* Category info card */}
              <AnimatePresence>
                {selectedCat && (
                   <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5"
                  >
                    <p className="text-[0.55rem] tracking-[0.22em] uppercase text-gray-400 dark:text-white/30 mb-2">
                      Selected Category
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl
                        flex items-center justify-center"
                      >
                        <i className="fa-solid fa-layer-group text-orange-400 dark:text-orange-400/80 text-sm" />
                      </div>
                      <div>
                        <p className="text-[0.82rem] font-medium text-gray-800 dark:text-white/80">
                          {selectedCat.name}
                        </p>
                        <p className="text-[0.6rem] text-gray-400 dark:text-white/20">
                          ID #{selectedCat.id_cat}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </form>
      </div>
    </>
  );
}
