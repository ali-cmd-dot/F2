import { NextResponse } from "next/server";
import Papa from "papaparse";
import { COL } from "@/lib/columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SHEET_ID =
  process.env.SHEET_ID || "1DzW-6Q7hTNn2hSJbEHOkSrbalOmbDIftdjw4I_PhEdA";
const SHEET_TAB = process.env.SHEET_TAB || "Issues- Realtime";

const TARGET_SUB_REQUEST = "customer request for video";
const CRITICAL_LABEL = "critical";

const MONTH_ORDER: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

type TrendBucket = {
  label: string;
  year: number;
  monthNum: number;
  videoRequests: number;
  critical: number;
};

function cleanText(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/\r?\n/g, " ")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Noise phrases jo headline me nahi chahiye — jaha bhi milein, hata do
function stripNoise(text: string): string {
  return text
    .replace(/device\s*(is)?\s*showing\s*offline/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/^[,\-\s]+|[,\-\s]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function truncate(text: string, max = 110): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trim() + "…";
}

export async function GET() {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
      SHEET_TAB
    )}`;

    const res = await fetch(csvUrl, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            'Sheet fetch fail hua. Google Sheet ko "Anyone with the link - Viewer" access do (File > Share) taaki live app data padh sake.',
        },
        { status: 502 }
      );
    }

    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText.trim(), {
      skipEmptyLines: true,
    });
    const rows = parsed.data.slice(1); // drop header row

    const validRows = rows.filter(
      (r) => r[COL.ISSUE_ID] && r[COL.ISSUE_ID].toString().trim() !== ""
    );

    let videoRequestCount = 0;
    let criticalCount = 0;

    const videoRequestClientCounts = new Map<string, number>();
    const trendMap = new Map<string, TrendBucket>();
    const ticker: { client: string; headline: string }[] = [];

    for (const r of validRows) {
      const subRequest = cleanText(r[COL.SUB_REQUEST]).toLowerCase();
      const incidentType = cleanText(r[COL.INCIDENT_TYPE]).toLowerCase();
      const client = cleanText(r[COL.CLIENT]) || "Unknown";
      const year = cleanText(r[COL.YEAR]);
      const month = cleanText(r[COL.MONTH]);

      const isVideoRequest = subRequest === TARGET_SUB_REQUEST;
      const isCritical = incidentType === CRITICAL_LABEL;

      if (isVideoRequest) {
        videoRequestCount++;
        videoRequestClientCounts.set(
          client,
          (videoRequestClientCounts.get(client) || 0) + 1
        );
      }
      if (isCritical) criticalCount++;

      // --- trend bucket: sirf valid Year(4-digit)+Month wale rows se ---
      const yearNum = Number(year);
      const monthNum = MONTH_ORDER[month.toLowerCase()] || 0;
      const isValidYear =
        year !== "" && Number.isInteger(yearNum) && yearNum >= 2015 && yearNum <= 2035;
      const isValidMonth = monthNum >= 1 && monthNum <= 12;

      if (isValidYear && isValidMonth) {
        const key = `${yearNum}-${String(monthNum).padStart(2, "0")}`;
        if (!trendMap.has(key)) {
          trendMap.set(key, {
            label: `${month.slice(0, 3)} ${yearNum}`,
            year: yearNum,
            monthNum,
            videoRequests: 0,
            critical: 0,
          });
        }
        const bucket = trendMap.get(key)!;
        if (isVideoRequest) bucket.videoRequests++;
        if (isCritical) bucket.critical++;
      }

      // --- ticker: sirf Critical + actual footage/video request wale rows ---
      if (isCritical && isVideoRequest) {
        const remark = stripNoise(cleanText(r[COL.REMARKS]));
        const details = stripNoise(cleanText(r[COL.ISSUE_DETAILS]));
        const raw = remark || details;
        if (raw) {
          ticker.push({ client, headline: truncate(raw) });
        }
      }
    }

    const monthlyTrend = Array.from(trendMap.values()).sort(
      (a, b) => a.year * 100 + a.monthNum - (b.year * 100 + b.monthNum)
    );

    const topClients = Array.from(videoRequestClientCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      kpis: {
        videoRequests: videoRequestCount,
        criticalIncidents: criticalCount,
      },
      monthlyTrend,
      topClients,
      ticker: ticker.slice(-25).reverse(),
      lastUpdated: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error while fetching dashboard data" },
      { status: 500 }
    );
  }
}
