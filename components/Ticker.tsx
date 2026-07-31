"use client";

type TickerItem = { client: string; headline: string };

export default function Ticker({ items }: { items: TickerItem[] }) {
  if (!items || items.length === 0) return null;

  const loopItems = [...items, ...items];
  const duration = Math.max(60, items.length * 10); // slow, readable speed

  return (
    <div className="relative flex items-center gap-3 overflow-hidden border-y border-border bg-card/60 px-3 py-2 backdrop-blur-sm">
      <div className="z-10 flex flex-shrink-0 items-center gap-2 rounded-full border border-critical/40 bg-critical/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-critical">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-critical" />
        Footage Alerts
      </div>
      <div
        className="ticker-track flex whitespace-nowrap"
        style={{ animationDuration: `${duration}s` }}
      >
        {loopItems.map((item, i) => (
          <span key={i} className="mx-8 text-sm text-textSecondary">
            <span className="font-semibold text-critical">{item.client}</span>
            {"  —  "}
            {item.headline}
          </span>
        ))}
      </div>
    </div>
  );
}
