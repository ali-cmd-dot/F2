"use client";

type TickerItem = { client: string; headline: string };

export default function Ticker({ items }: { items: TickerItem[] }) {
  if (!items || items.length === 0) return null;

  const loopItems = [...items, ...items]; // seamless infinite loop

  return (
    <div className="relative flex items-center overflow-hidden border-y border-border bg-card">
      <div className="z-10 flex flex-shrink-0 items-center gap-2 bg-critical px-4 py-2 text-sm font-bold text-black">
        <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
        MOST DANGEROUS
      </div>
      <div className="ticker-track flex whitespace-nowrap py-2">
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
