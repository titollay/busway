import { useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../config";
import { useState, useEffect } from "react";
export default function InvoiceModal({ orderId, onClose }) {
  const invoiceRef = useRef();
  const { currency } = useSettings();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    fetch(`${config.API_BASE_URL}/admin/get-order-details.php?id=${orderId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { order, items } = data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar (Hidden on Print) */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <i className="fa-solid fa-file-invoice text-orange-500 text-sm" />
            </div>
            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-gray-400">Invoice Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[0.65rem] uppercase tracking-widest font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
            >
              <i className="fa-solid fa-print text-[0.7rem]" />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-10 font-['DM_Sans'] text-gray-900 print:p-0" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="font-['Cormorant_Garamond'] text-[2.4rem] font-light leading-none mb-1 text-gray-900">{config.BRAND_NAME}</h1>
              <p className="text-[0.6rem] text-gray-400 uppercase tracking-[0.3em]">Premium Boutique</p>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3">
                Invoice
              </div>
              <p className="text-xl font-['Cormorant_Garamond'] font-light text-gray-900">Order #{order.id_order}</p>
              <p className="text-[0.65rem] text-gray-400 uppercase tracking-wider mt-1">
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full mb-10" />

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-10 mb-12">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-gray-400 font-bold mb-4">Customer Details</p>
              <h3 className="text-base font-bold text-gray-900 mb-1">{order.shipping_name || `${order.first_name} ${order.last_name}`}</h3>
              <p className="text-[0.8rem] text-gray-600 mb-0.5">{order.email}</p>
              <p className="text-[0.8rem] text-gray-600 font-medium">{order.shipping_phone}</p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-gray-400 font-bold mb-4">Shipping Destination</p>
              <p className="text-[0.82rem] text-gray-600 leading-relaxed font-light">
                {order.address_line}<br />
                {order.city} {order.postal_code}<br />
                <span className="font-bold text-gray-900 uppercase tracking-wider text-[0.75rem]">{order.country}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-900/10">
                  <th className="text-left py-4 text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400">Item</th>
                  <th className="text-right py-4 text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400">Price</th>
                  <th className="text-right py-4 text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400">Qty</th>
                  <th className="text-right py-4 text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 print:hidden">
                           <img 
                            src={item.image ? `${config.ASSETS_BASE_URL}/${item.image}` : `https://via.placeholder.com/100`} 
                            alt="" 
                            className="w-full h-full object-cover" 
                           />
                         </div>
                         <div>
                           <p className="font-bold text-[0.85rem] text-gray-900">{item.product_name}</p>
                           <p className="text-[0.62rem] text-gray-400 tracking-wider">REF: {item.id_product}</p>
                         </div>
                      </div>
                    </td>
                    <td className="text-right text-[0.82rem] text-gray-600 font-light">{parseFloat(item.price).toFixed(2)} {currency}</td>
                    <td className="text-right text-[0.82rem] text-gray-600 font-light">{item.quantity}</td>
                    <td className="text-right font-bold text-[0.85rem] text-gray-900">{ (item.price * item.quantity).toFixed(2)} {currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <div className="w-full max-w-[280px] space-y-2.5">
              <div className="flex justify-between items-center text-[0.82rem]">
                <span className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold">Subtotal</span>
                <span className="text-gray-900 font-light">{parseFloat(order.total_price).toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between items-center text-[0.82rem]">
                <span className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold">Tax (0%)</span>
                <span className="text-gray-900 font-light">0.00 {currency}</span>
              </div>
              <div className="flex justify-between items-center text-[0.82rem] pb-4">
                <span className="text-gray-400 uppercase tracking-widest text-[0.6rem] font-bold">Shipping</span>
                <span className="text-green-500 font-bold uppercase text-[0.6rem] tracking-widest">Complimentary</span>
              </div>
              <div className="pt-4 border-t border-gray-900 flex justify-between items-end">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] font-bold text-gray-400 leading-none mb-1">Total Payable</p>
                  <p className="font-['Cormorant_Garamond'] text-2xl font-light text-gray-900 leading-none">Net Amount</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500 leading-none">{parseFloat(order.total_price).toFixed(2)} <span className="text-sm font-light text-gray-400">{currency}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 pt-10 border-t border-gray-50 text-center">
            <p className="text-[0.65rem] text-gray-400 uppercase tracking-[0.25em] mb-2 font-medium">Thank you for your patronage</p>
            <p className="text-[0.75rem] font-['Cormorant_Garamond'] italic text-gray-400 leading-relaxed max-w-sm mx-auto">
              "Excellence is not an act, but a habit. We look forward to serving you again."
            </p>
            <div className="mt-6 flex justify-center gap-4 grayscale opacity-30 print:hidden">
              <i className="fa-brands fa-cc-visa text-xl" />
              <i className="fa-brands fa-cc-mastercard text-xl" />
              <i className="fa-brands fa-cc-apple-pay text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* 1. Eliminate all browser headers/footers/margins */
          @page {
            size: auto;
            margin: 0;
          }

          /* 2. Hide absolutely everything on the screen */
          html, body {
            visibility: hidden;
            background: white !important;
            height: 100%;
            overflow: hidden;
          }

          /* 3. Force the invoice to be the only visible thing and pin it to the top */
          #printable-invoice {
            visibility: visible !important;
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            padding: 1.5cm !important;
            margin: 0 !important;
            background: white !important;
            z-index: 999999 !important;
          }

          /* 4. Ensure all text inside is visible and black */
          #printable-invoice * {
            visibility: visible !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 5. Hide internal UI buttons that might have been marked visibility: visible */
          .print\\:hidden, button, .sticky {
            display: none !important;
          }

          /* Keep images crisp */
          img {
            max-height: 80px;
          }
        }
      `}} />
    </motion.div>
  );
}
