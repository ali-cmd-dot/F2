export default function KpiCard({
  label,
  value,
  accent = "#94EC8E",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-lg shadow-black/40 backdrop-blur-sm">
      <p className="text-sm text-textMuted">{label}</p>
      <p className="mt-2 text-3xl font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
