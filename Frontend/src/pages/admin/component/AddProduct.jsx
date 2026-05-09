import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AddVariant } from "./ProductPage";
import { Link } from "react-router-dom";
import config from "../../config";
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function AddProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/admin/get-products.php`);

      const data = await res.json();

      if (data.status === "success") {
        setProducts(data.data || []);
      } else {
        console.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // After variant added
  const handleVariantAdded = () => {
    alert("Variant added successfully!");
  };

  return (
    <div className="min-h-full px-8 py-8 font-['DM_Sans']">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-7">
        <p className="text-[0.55rem] tracking-[0.28em] uppercase text-black/30 mb-1">
          Management
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-light text-black/70">
              Add Product
            </h1>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Link to={"/"}>
              <p className="hover:text-orange-500">Home</p>
            </Link>
            <span>/</span>
            <Link to={"/index/product"}>
              <span className="text-gray-700 hover:text-orange-500 font-medium">
                Product
              </span>
            </Link>

            <span>/</span>
            <span className="text-gray-700 font-medium">AddProduct</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[0.62rem] text-gray-400 tracking-wide hidden sm:block">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          </div>
        </div>
        <div className="h-px bg-black/[0.07] mt-4" />
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div {...fadeUp(0.1)} className="max-w-xl">
          <AddVariant products={products} onAdded={handleVariantAdded} />
        </motion.div>
      )}
    </div>
  );
}
