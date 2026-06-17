"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function MessagesFilters({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const t = getDictionary(locale);

  const STATUS_OPTIONS = [
    { value: "all", label: t.messages.filters.all },
    { value: "unread", label: t.messages.filters.unread },
    { value: "late", label: t.messages.filters.late },
    { value: "paid", label: t.messages.filters.paid },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      const query = params.toString();
      router.push(`/dashboard/messages${query ? `?${query}` : ""}`);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function updateStatus(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    const query = params.toString();
    router.push(`/dashboard/messages${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.messages.searchClient}
          className="w-56 rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <select
        value={status}
        onChange={(e) => updateStatus(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
