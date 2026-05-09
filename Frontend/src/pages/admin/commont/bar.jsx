import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TopProducts({ products }) {
  if (!products) return null;

  const labels = products.map((p) => p.name);
  const values = products.map((p) => Number(p.total_sold));

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values,
        borderRadius: 8,
        barThickness: 16,
        backgroundColor: "#3B82F6",
        hoverBackgroundColor: "#E6EFFE",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#f1f5f9",
        },
        ticks: {
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#374151",
          font: {
            weight: "500",
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">
          Top Selling Products
        </h2>

        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <i className="fa-solid fa-chart-column"></i>
        </div>
      </div>

      {/* Chart */}
      <div className="h-60 w-full">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export function OrdersByCountryChart({ countries }) {
  if (!countries) return null;

  const labels = countries.map((c) => c.country);
  const values = countries.map((c) => Number(c.total_orders));

  const data = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: values,
        borderRadius: 6,
        backgroundColor: "rgba(79, 70, 229, 0.7)",
        hoverBackgroundColor: "rgba(79, 70, 229, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full transition-colors duration-300">
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">
          Orders by Country
        </h2>

        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <i className="fa-solid fa-globe"></i>
        </div>
      </div>

      {/* chart */}
      <div className="h-60 w-full ">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
