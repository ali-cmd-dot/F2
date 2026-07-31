"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

type ClientCount = { name: string; count: number };

export default function ClientsChart({ data }: { data: ClientCount[] }) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Video Requests",
        data: data.map((d) => d.count),
        backgroundColor: "#94EC8E",
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#000000",
        anchor: "end" as const,
        align: "end" as const,
        font: { weight: "bold" as const },
      },
    },
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
