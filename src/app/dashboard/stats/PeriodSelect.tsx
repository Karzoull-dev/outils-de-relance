"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getPeriodOptions } from "@/lib/stats";
import type { Locale } from "@/lib/i18n/config";

export function PeriodSelect({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("period") ?? "7d";
  const periodOptions = getPeriodOptions(locale);

  return (
    <select
      value={current}
      onChange={(e) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value === "7d") {
          params.delete("period");
        } else {
          params.set("period", value);
        }

        const query = params.toString();
        router.push(`/dashboard/stats${query ? `?${query}` : ""}`);
      }}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {periodOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
