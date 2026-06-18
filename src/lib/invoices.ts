import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";

export type InvoiceStatus = "pending" | "late" | "paid";

export function getInvoiceStatus(invoice: {
  due_date: string;
  paid_at: string | null;
}): InvoiceStatus {
  if (invoice.paid_at) return "paid";

  const today = new Date().toISOString().slice(0, 10);
  return invoice.due_date < today ? "late" : "pending";
}

const statusClassNames: Record<InvoiceStatus, string> = {
  pending: "bg-warning-surface text-warning",
  late: "bg-danger-surface text-danger",
  paid: "bg-success-surface text-success",
};

export function getStatusLabels(
  locale: Locale,
): Record<InvoiceStatus, { label: string; className: string }> {
  const t = getDictionary(locale);

  return {
    pending: { label: t.invoiceStatus.pending, className: statusClassNames.pending },
    late: { label: t.invoiceStatus.late, className: statusClassNames.late },
    paid: { label: t.invoiceStatus.paid, className: statusClassNames.paid },
  };
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale: Locale = "fr",
): string {
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Numéro de facture légal : séquentiel et sans trou par utilisateur
 * (colonne `number`, attribuée par un trigger Postgres à l'insertion).
 */
export function formatInvoiceNumber(invoice: {
  number: number;
  created_at: string;
}): string {
  const year = new Date(invoice.created_at).getFullYear();
  return `FA-${year}-${String(invoice.number).padStart(4, "0")}`;
}
