import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineSalesMonth({ month }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
  };

  const data = {
    labels: month.map((m) => m.month_name),

    datasets: [
      {
        label: "Sales",
        data: month.map((m) => Number(m.total_sales)),
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.3)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full rounded rounded-2xl bg-white dark:bg-[#111] p-6 border border-transparent dark:border-white/5 transition-colors duration-300">
      <Line options={options} data={data} />
    </div>
  );
}
