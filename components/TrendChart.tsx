"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type TrendPoint = { label: string; videoRequests: number; critical: number };

function makeGradient(colorHex: string) {
  return (context: any) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return `${colorHex}00`;
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );
    gradient.addColorStop(0, `${colorHex}66`);
    gradient.addColorStop(1, `${colorHex}00`);
    return gradient;
  };
}

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Video Requests",
        data: data.map((d) => d.videoRequests),
        borderColor: "#94EC8E",
        backgroundColor: makeGradient("#94EC8E"),
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#94EC8E",
        pointBorderColor: "#000000",
        yAxisID: "y",
      },
      {
        label: "Critical Incidents",
        data: data.map((d) => d.critical),
        borderColor: "#FF4D4D",
        backgroundColor: makeGradient("#FF4D4D"),
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#FF4D4D",
        pointBorderColor: "#000000",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        labels: { color: "#D8D8D8", usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        backgroundColor: "#1E1E1E",
        borderColor: "#171717",
        borderWidth: 1,
        titleColor: "#FFFFFF",
        bodyColor: "#D8D8D8",
      },
    },
    scales: {
      x: {
        type: "category" as const, // <- auto date-parsing band, "Dec 1899" bug fix
        ticks: { color: "#9E9E9E" },
        grid: { color: "#171717" },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        ticks: { color: "#94EC8E" },
        grid: { color: "#171717" },
        beginAtZero: true,
        title: { display: true, text: "Video Requests", color: "#94EC8E" },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        ticks: { color: "#FF4D4D" },
        grid: { drawOnChartArea: false },
        beginAtZero: true,
        title: { display: true, text: "Critical", color: "#FF4D4D" },
      },
    },
  };

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  );
}
