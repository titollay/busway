import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

const STATUS_CFG = {
  paid: {
    dot: "bg-green-400",
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    label: "Paid",
  },
  pending: {
    dot: "bg-orange-400",
    text: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "Pending",
  },
  cancelled: {
    dot: "bg-red-400",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    label: "Cancelled",
  },
  shipped: {
    dot: "bg-blue-400",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    label: "Shipped",
  },
  default: {
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    label: "Other",
  },
};

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100  text-green-600",
  "bg-blue-100   text-blue-600",
  "bg-red-100    text-red-600",
  "bg-yellow-100 text-yellow-600",
];

function Avatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w?.[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  const cls = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0 ${cls}`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem]
      tracking-widest uppercase font-semibold border ${cfg.text} ${cfg.bg} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function LatestOrders({ orders, onView }) {
  const { currency } = useSettings();
  if (!orders?.length) return null;

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const fmtTime = (d) =>
    new Date(d).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
      {/* ── Header ── */}
      <div className="flex items-end justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
        <div>
          <p className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400 mb-0.5">
            Overview
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 leading-none">
            Latest Orders
          </h3>
        </div>
        <Link
          to="/index/orders"
          className="flex items-center gap-1.5 text-[0.65rem] tracking-widest uppercase
            text-orange-500 hover:text-orange-600 transition-colors"
        >
          View all
          <i className="fa-solid fa-arrow-right text-[0.55rem]"></i>
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: "600px" }}>
          <thead>
            <tr className="border-b border-gray-50 dark:border-white/5">
              {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[0.55rem] tracking-[0.18em] uppercase
                  text-gray-400 px-6 py-3 font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
              <th
                className="text-right text-[0.55rem] tracking-[0.18em] uppercase
                text-gray-400 px-6 py-3 font-medium"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id_order}
                className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors group"
              >
                {/* Order ID */}
                <td className="px-6 py-4">
                  <span className="text-[0.78rem] font-semibold text-gray-800 dark:text-white/80">
                    #{String(order.id_order).padStart(4, "0")}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={order.customer} />
                    <span className="text-[0.78rem] text-gray-700 dark:text-white/70 font-medium">
                      {order.customer}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <span className="font-['Cormorant_Garamond'] text-[1.15rem] font-semibold text-gray-900 dark:text-white/90">
                    {parseFloat(order.total_price).toLocaleString()}
                    <span className="text-[0.62rem] font-['DM_Sans'] text-gray-400 ml-1 font-normal">
                      {currency}
                    </span>
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-[0.72rem] text-gray-600">
                      {fmtDate(order.created_at)}
                    </p>
                    <p className="text-[0.62rem] text-gray-400 mt-0.5">
                      {fmtTime(order.created_at)}
                    </p>
                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onView && onView(order)}
                    className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity
                    w-7 h-7 flex items-center justify-center rounded-lg ml-auto
                    bg-orange-50 border border-orange-200 text-orange-500 hover:bg-orange-100"
                  >
                    <i className="fa-solid fa-eye text-[0.55rem]"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50/60 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
        <span className="text-[0.6rem] tracking-wider uppercase text-gray-400">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[0.6rem] text-gray-400">
            Total:{" "}
            <span className="font-['Cormorant_Garamond'] text-[1rem] font-semibold text-gray-800 dark:text-white/80">
              {orders
                .reduce((s, o) => s + parseFloat(o.total_price), 0)
                .toLocaleString()}
              <span className="text-[0.6rem] font-['DM_Sans'] text-gray-400 ml-0.5 font-normal">
                {currency}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
