"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { formatCurrency } from "@/lib/invoices";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type InvoiceOption = {
  id: string;
  client_name: string;
  amount: number;
  currency: string;
};

export function NewConversationButton({
  invoices,
  locale,
}: {
  invoices: InvoiceOption[];
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getDictionary(locale);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = invoices.filter((invoice) =>
    invoice.client_name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        <Plus className="h-4 w-4" />
        {t.messages.newMessage}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-border bg-surface p-2 shadow-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.messages.searchClient}
              className="w-full rounded-lg border border-border bg-surface py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="mt-2 flex max-h-60 flex-col gap-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-2 text-sm text-muted">{t.messages.noInvoiceFound}</p>
            ) : (
              filtered.map((invoice) => (
                <button
                  key={invoice.id}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(`/dashboard/messages/${invoice.id}`);
                  }}
                  className="flex flex-col rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-hover"
                >
                  <span className="font-medium">{invoice.client_name}</span>
                  <span className="text-xs text-muted">
                    {formatCurrency(invoice.amount, invoice.currency, locale)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
