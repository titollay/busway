import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ title = "Chart", labels = [], values = [], colorsMap = {}, icon = "fa-chart-pie" }) {
  if (!labels.length) return null;

  const defaultColors = ["#3b82f6", "#22C55E", "#F97316", "#ef4444", "#8b5cf6", "#ec4899"];
  const backgroundColors = labels.map((label, i) => colorsMap[label] || defaultColors[i % defaultColors.length]);

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          padding: 15,
          font: { size: 13 },
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
    <div className="bg-white dark:bg-gray-900/50 dark:backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 w-full transition-colors duration-300 h-full flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/80">{title}</h2>
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <i className={`fa-solid ${icon}`}></i>
        </div>
      </div>
      {/* chart */}
      <div className="flex-1 flex items-center justify-center min-h-[220px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
