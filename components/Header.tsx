import Image from "next/image";

export default function Header({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Cautio" width={36} height={36} />
        <div>
          <h1 className="text-lg font-semibold text-textPrimary">
            Incident Analytics
          </h1>
          <p className="text-xs text-textMuted">Cautio · Issues Realtime</p>
        </div>
      </div>
      {lastUpdated && (
        <p className="text-xs text-textMuted">
          Last updated:{" "}
          {new Date(lastUpdated).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </header>
  );
}
