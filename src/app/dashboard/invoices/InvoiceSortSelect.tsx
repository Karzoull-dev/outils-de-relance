"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function InvoiceSortSelect({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "due_date";
  const t = getDictionary(locale);

  const options = [
    { value: "due_date", label: t.invoices.sort.due },
    { value: "created_at", label: t.invoices.sort.recent },
    { value: "paid", label: t.invoices.sort.paid },
    { value: "pending", label: t.invoices.sort.pending },
    { value: "late", label: t.invoices.sort.late },
  ];

  return (
    <select
      value={current}
      onChange={(e) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());

        if (value === "due_date") {
          params.delete("sort");
        } else {
          params.set("sort", value);
        }

        const query = params.toString();
        router.push(`/dashboard/invoices${query ? `?${query}` : ""}`);
      }}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
