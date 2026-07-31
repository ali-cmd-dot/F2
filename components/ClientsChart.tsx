"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type ClientCount = { name: string; count: number };

export default function ClientsChart({ data }: { data: ClientCount[] }) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Total Issues",
        data: data.map((d) => d.count),
        backgroundColor: "#94EC8E",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#9E9E9E" },
        grid: { color: "#171717" },
        beginAtZero: true,
      },
      y: { ticks: { color: "#D8D8D8" }, grid: { display: false } },
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}
