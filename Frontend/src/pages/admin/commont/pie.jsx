import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrdersStatusChart({ orders }) {
  if (!orders) return null;

  const labels = orders.map((o) => o.status);
  const values = orders.map((o) => Number(o.total));

  const colors = {
    paid: "#22C55E",
    pending: "#F97316",
    cancelled: "#ef4444",
    shipped: "#3b82f6",
  };

  const backgroundColors = labels.map((status) => colors[status] || "#6366f1");

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    cutout: "65%",
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          padding: 15,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full transition-colors duration-300">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">Orders Status</h2>

        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <i className="fa-solid fa-chart-pie"></i>
        </div>
      </div>

      {/* chart */}
      <div className="h-60  flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
