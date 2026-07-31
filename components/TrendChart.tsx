"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type TrendPoint = { label: string; videoRequests: number; critical: number };

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Video Requests",
        data: data.map((d) => d.videoRequests),
        borderColor: "#94EC8E",
        backgroundColor: "#94EC8E33",
        tension: 0.35,
        pointRadius: 2,
      },
      {
        label: "Critical Incidents",
        data: data.map((d) => d.critical),
        borderColor: "#FF4D4D",
        backgroundColor: "#FF4D4D33",
        tension: 0.35,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#D8D8D8" } },
    },
    scales: {
      x: { ticks: { color: "#9E9E9E" }, grid: { color: "#171717" } },
      y: {
        ticks: { color: "#9E9E9E" },
        grid: { color: "#171717" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-72">
      <Line data={chartData} options={options} />
    </div>
  );
}
