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

export default function BarChart({ title = "Chart", labels = [], values = [], label = "Data", color = "#3B82F6", icon = "fa-chart-column", indexAxis = "x", maintainAspectRatio = false }) {
  if (!labels.length) return null;

  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderRadius: 8,
        barThickness: indexAxis === "y" ? 16 : undefined,
        maxBarThickness: 40,
        backgroundColor: color,
        hoverBackgroundColor: color + "CC",
      },
    ],
  };

  const options = {
    indexAxis,
    responsive: true,
    maintainAspectRatio,
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
          color: "rgba(107, 114, 128, 0.1)",
          display: indexAxis === "y",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          display: indexAxis === "x",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            weight: "500",
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 transition-colors duration-300 w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">
          {title}
        </h2>

        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[220px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
