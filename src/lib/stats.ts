import { getInvoiceStatus, formatCurrency } from "./invoices";
import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

export type Period = "7d" | "30d" | "365d" | "all";

export function getPeriodOptions(locale: Locale): { value: Period; label: string }[] {
  const t = getDictionary(locale).stats.periods;

  return [
    { value: "7d", label: t["7d"] },
    { value: "30d", label: t["30d"] },
    { value: "365d", label: t["365d"] },
    { value: "all", label: t.all },
  ];
}

export type StatsInvoice = {
  client_name: string;
  client_email: string;
  amount: number;
  currency: string;
  due_date: string;
  paid_at: string | null;
  created_at: string;
};

function periodStartDate(period: Period): Date | null {
  if (period === "all") return null;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 365;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function filterByDateField(
  invoices: StatsInvoice[],
  field: "created_at" | "paid_at",
  period: Period,
): StatsInvoice[] {
  const start = periodStartDate(period);
  return invoices.filter((invoice) => {
    const raw = invoice[field];
    if (!raw) return false;
    if (!start) return true;
    return new Date(raw) >= start;
  });
}

export function sumByCurrency(invoices: StatsInvoice[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const invoice of invoices) {
    totals[invoice.currency] = (totals[invoice.currency] ?? 0) + Number(invoice.amount);
  }
  return totals;
}

export function formatMultiCurrency(
  totals: Record<string, number>,
  locale: Locale = "fr",
): string {
  const entries = Object.entries(totals);
  if (entries.length === 0) return formatCurrency(0, "EUR", locale);
  return entries
    .map(([currency, amount]) => formatCurrency(amount, currency, locale))
    .join(" · ");
}

export type RevenuePoint = { label: string; total: number };

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string, locale: Locale): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    month: "short",
    year: "2-digit",
  });
}

export function buildRevenueSeries(
  paidInvoices: StatsInvoice[],
  period: Period,
  locale: Locale = "fr",
): { series: RevenuePoint[]; currency: string } {
  const counts: Record<string, number> = {};
  for (const invoice of paidInvoices) {
    counts[invoice.currency] = (counts[invoice.currency] ?? 0) + 1;
  }
  const [currency] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? ["EUR"];
  const relevant = paidInvoices.filter(
    (invoice) => invoice.currency === currency && invoice.paid_at,
  );

  if (period === "7d" || period === "30d") {
    const days = period === "7d" ? 7 : 30;
    const buckets = new Map<string, number>();
    const keys: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      keys.push(key);
      buckets.set(key, 0);
    }

    for (const invoice of relevant) {
      const key = invoice.paid_at!.slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, buckets.get(key)! + Number(invoice.amount));
      }
    }

    return {
      currency,
      series: keys.map((key) => ({
        label: new Date(key).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
          day: "2-digit",
          month: "2-digit",
        }),
        total: buckets.get(key) ?? 0,
      })),
    };
  }

  const monthKeys: string[] = [];
  const buckets = new Map<string, number>();

  if (period === "365d") {
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - i);
      const key = monthKey(date);
      monthKeys.push(key);
      buckets.set(key, 0);
    }
  } else {
    const paidDates = relevant.map((invoice) => new Date(invoice.paid_at!));
    const cursor =
      paidDates.length > 0
        ? new Date(Math.min(...paidDates.map((d) => d.getTime())))
        : new Date();
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(1);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = monthKey(cursor);
      monthKeys.push(key);
      buckets.set(key, 0);
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  for (const invoice of relevant) {
    const key = monthKey(new Date(invoice.paid_at!));
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + Number(invoice.amount));
    }
  }

  return {
    currency,
    series: monthKeys.map((key) => ({
      label: monthLabel(key, locale),
      total: buckets.get(key) ?? 0,
    })),
  };
}

export type StatusSlice = { name: string; value: number; color: string };

export function buildStatusBreakdown(
  invoices: StatsInvoice[],
  locale: Locale = "fr",
): StatusSlice[] {
  const t = getDictionary(locale).stats.statusNames;
  let paid = 0;
  let pending = 0;
  let late = 0;

  for (const invoice of invoices) {
    const status = getInvoiceStatus(invoice);
    if (status === "paid") paid++;
    else if (status === "late") late++;
    else pending++;
  }

  return [
    { name: t.paid, value: paid, color: "var(--success)" },
    { name: t.pending, value: pending, color: "var(--warning)" },
    { name: t.late, value: late, color: "var(--danger)" },
  ];
}

export type ClientStat = {
  client_name: string;
  client_email: string;
  invoiceCount: number;
  paidCount: number;
  totalByCurrency: Record<string, number>;
  paidByCurrency: Record<string, number>;
  hasPaid: boolean;
};

export function buildClientStats(invoices: StatsInvoice[]): ClientStat[] {
  const map = new Map<string, ClientStat>();

  for (const invoice of invoices) {
    let entry = map.get(invoice.client_email);
    if (!entry) {
      entry = {
        client_name: invoice.client_name,
        client_email: invoice.client_email,
        invoiceCount: 0,
        paidCount: 0,
        totalByCurrency: {},
        paidByCurrency: {},
        hasPaid: false,
      };
      map.set(invoice.client_email, entry);
    }

    entry.invoiceCount++;
    entry.totalByCurrency[invoice.currency] =
      (entry.totalByCurrency[invoice.currency] ?? 0) + Number(invoice.amount);

    if (invoice.paid_at) {
      entry.paidCount++;
      entry.hasPaid = true;
      entry.paidByCurrency[invoice.currency] =
        (entry.paidByCurrency[invoice.currency] ?? 0) + Number(invoice.amount);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const totalA = Object.values(a.totalByCurrency).reduce((sum, v) => sum + v, 0);
    const totalB = Object.values(b.totalByCurrency).reduce((sum, v) => sum + v, 0);
    return totalB - totalA;
  });
}
