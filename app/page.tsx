"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import KpiCard from "@/components/KpiCard";
import TrendChart from "@/components/TrendChart";
import ClientsChart from "@/components/ClientsChart";

type DashboardData = {
  kpis: {
    videoRequests: number;
    criticalIncidents: number;
  };
  monthlyTrend: { label: string; videoRequests: number; critical: number }[];
  topClients: { name: string; count: number }[];
  ticker: { client: string; headline: string }[];
  lastUpdated: string;
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to load data");
        return;
      }
      setError(null);
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load data");
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main className="min-h-screen text-textPrimary">
      <Header lastUpdated={data?.lastUpdated} />

      {error && (
        <div className="m-6 rounded-2xl border border-critical bg-card/80 p-4 text-sm text-critical backdrop-blur-sm">
          {error}
        </div>
      )}

      {data && <Ticker items={data.ticker} />}

      <div className="grid gap-6 p-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <KpiCard
            label="Customer Video Requests"
            value={data?.kpis.videoRequests ?? "—"}
          />
          <KpiCard
            label="Critical Incidents"
            value={data?.kpis.criticalIncidents ?? "—"}
            accent="#FF4D4D"
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-lg shadow-black/40 backdrop-blur-sm">
            <h2 className="mb-4 text-sm font-semibold text-textSecondary">
              Monthly Trend — Video Requests vs Critical Incidents
            </h2>
            {data && <TrendChart data={data.monthlyTrend} />}
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-lg shadow-black/40 backdrop-blur-sm">
            <h2 className="mb-4 text-sm font-semibold text-textSecondary">
              Top 5 Clients — Video Requests
            </h2>
            {data && <ClientsChart data={data.topClients} />}
          </div>
        </section>
      </div>
    </main>
  );
}
