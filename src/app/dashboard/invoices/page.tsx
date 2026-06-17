import Link from "next/link";
import { ArrowRight, Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceStatus, getStatusLabels, formatCurrency } from "@/lib/invoices";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { markInvoiceAsPaid } from "./actions";
import { InvoiceSortSelect } from "./InvoiceSortSelect";
import { NewInvoiceModal } from "./NewInvoiceModal";
import { InvoiceActionsMenu } from "./InvoiceActionsMenu";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; error?: string }>;
}) {
  const { sort, error } = await searchParams;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const statusLabels = getStatusLabels(locale);

  const query = supabase.from("invoices").select("*");

  if (sort === "created_at") {
    query.order("created_at", { ascending: false });
  } else {
    query.order("due_date", { ascending: true });
  }

  const { data } = await query;

  const invoices =
    sort === "paid" || sort === "pending" || sort === "late"
      ? (data ?? []).filter((invoice) => getInvoiceStatus(invoice) === sort)
      : data ?? [];

  return (
    <div>
      <div className="flex items-center justify-end gap-3">
        <InvoiceSortSelect locale={locale} />
        <NewInvoiceModal key={error ?? "new"} error={error} locale={locale} />
      </div>

      {!invoices?.length ? (
        <p className="mt-6 text-muted">{t.invoices.none}</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-4 py-3 font-medium">{t.invoices.columnClient}</th>
                <th className="px-4 py-3 font-medium">{t.invoices.columnAmount}</th>
                <th className="px-4 py-3 font-medium">{t.invoices.columnDue}</th>
                <th className="px-4 py-3 font-medium">{t.invoices.columnStatus}</th>
                <th className="px-4 py-3 font-medium">{t.invoices.columnActions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => {
                const status = getInvoiceStatus(invoice);
                const { label, className } = statusLabels[status];

                return (
                  <tr
                    key={invoice.id}
                    className={`transition-colors hover:bg-surface-hover ${
                      index < invoices.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <p className="flex items-center gap-1.5 text-base font-medium">
                          {invoice.pinned && (
                            <Pin className="h-3.5 w-3.5 shrink-0 text-accent" />
                          )}
                          {invoice.client_name}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          <div className="text-xs text-muted">{invoice.client_email}</div>
                          {invoice.client_siret && (
                            <div className="text-xs text-muted">
                              {t.invoiceDetail.siret} {invoice.client_siret}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                        >
                          {t.invoices.viewInfo}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(invoice.amount, invoice.currency, locale)}
                    </td>
                    <td className="px-4 py-3">{invoice.due_date}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        {status === "paid" ? (
                          <button
                            type="button"
                            disabled
                            className="diagonal-strike relative cursor-not-allowed rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-faint"
                          >
                            {t.invoices.markPaid}
                          </button>
                        ) : (
                          <form action={markInvoiceAsPaid}>
                            <input type="hidden" name="id" value={invoice.id} />
                            <button
                              type="submit"
                              className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium transition-colors hover:bg-surface-hover"
                            >
                              {t.invoices.markPaid}
                            </button>
                          </form>
                        )}
                        <InvoiceActionsMenu invoice={invoice} locale={locale} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
