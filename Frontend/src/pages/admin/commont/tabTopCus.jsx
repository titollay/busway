import { useState } from "react";
import { useSettings } from "../../context/SettingsContext";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100  text-green-600",
  "bg-blue-100   text-blue-600",
  "bg-red-100    text-red-600",
  "bg-yellow-100 text-yellow-600",
];

function Avatar({ name, size = "w-9 h-9" }) {
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
      className={`${size} rounded-full flex items-center justify-center text-[0.62rem] font-bold shrink-0 ${cls}`}
    >
      {initials}
    </div>
  );
}

export default function TopCustomers({ customers }) {
  const { currency } = useSettings();
  const [hovered, setHovered] = useState(null);
  if (!customers?.length) return null;

  const maxSpent = Math.max(...customers.map((c) => parseFloat(c.total_spent)));

  return (
    <div className="bg-white dark:bg-[#111] h-full rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden font-['DM_Sans'] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-end justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
        <div>
          <p className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400 mb-0.5">
            Insights
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-light text-gray-900 leading-none">
            Top Customers
          </h3>
        </div>
        <span className="text-[0.6rem] tracking-widest uppercase text-gray-400">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-white/5">
              <th className="text-left text-[0.55rem] tracking-[0.18em] uppercase text-gray-400 px-6 py-3 font-medium">
                #
              </th>
              <th className="text-left text-[0.55rem] tracking-[0.18em] uppercase text-gray-400 px-6 py-3 font-medium">
                Customer
              </th>
              <th className="text-center text-[0.55rem] tracking-[0.18em] uppercase text-gray-400 px-6 py-3 font-medium">
                Orders
              </th>
              <th className="text-left text-[0.55rem] tracking-[0.18em] uppercase text-gray-400 px-6 py-3 font-medium">
                Total Spent
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => {
              const pct = Math.round(
                (parseFloat(c.total_spent) / maxSpent) * 100
              );
              const isHovered = hovered === i;
              return (
                <tr
                  key={c.id}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="border-b border-gray-50 dark:border-white/5 last:border-0 transition-colors cursor-pointer"
                  style={{ background: isHovered ? (document.documentElement.classList.contains('dark') ? "#222" : "#fff8f2") : "transparent" }}
                >
                  {/* Rank */}
                  <td className="px-6 py-4 w-12">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center
                      text-[0.6rem] font-bold transition-colors
                      ${
                        i === 0
                          ? "bg-orange-100 text-orange-600"
                          : i === 1
                          ? "bg-gray-100 text-gray-500"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.customer} />
                      <div>
                        <p className="text-[0.8rem] font-medium text-gray-800 dark:text-white/80 leading-tight">
                          {c.customer}
                        </p>
                        <p className="text-[0.6rem] text-gray-400 mt-0.5">
                          ID #{c.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[0.65rem] font-semibold
                      tracking-wide transition-colors
                      ${
                        isHovered
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {c.total_orders}
                    </span>
                  </td>

                  {/* Spent + bar */}
                  <td className="px-6 py-4 min-w-[160px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-['Cormorant_Garamond'] text-[1.1rem] font-semibold text-gray-900 dark:text-white/90 leading-none">
                            {parseFloat(c.total_spent).toLocaleString()}
                            <span className="text-[0.58rem] font-['DM_Sans'] text-gray-400 ml-1 font-normal">
                              {currency}
                            </span>
                          </span>
                          <span className="text-[0.55rem] text-gray-400">
                            {pct}%
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: isHovered
                                ? "linear-gradient(90deg,#FC8C06,#f59e0b)"
                                : "linear-gradient(90deg,#d1d5db,#e5e7eb)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50/60 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
        <span className="text-[0.6rem] tracking-wider uppercase text-gray-400">
          Total Revenue
        </span>
        <span className="font-['Cormorant_Garamond'] text-[1.1rem] font-semibold text-gray-900 dark:text-white/90">
          {customers
            .reduce((s, c) => s + parseFloat(c.total_spent), 0)
            .toLocaleString()}
          <span className="text-[0.6rem] font-['DM_Sans'] text-gray-400 ml-1 font-normal">
            {currency}
          </span>
        </span>
      </div>
    </div>
  );
}
