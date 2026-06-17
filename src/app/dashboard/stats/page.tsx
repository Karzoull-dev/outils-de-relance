import { createClient } from "@/lib/supabase/server";
import {
  filterByDateField,
  sumByCurrency,
  formatMultiCurrency,
  buildRevenueSeries,
  buildStatusBreakdown,
  buildClientStats,
  type Period,
  type StatsInvoice,
} from "@/lib/stats";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PeriodSelect } from "./PeriodSelect";
import { RevenueChart, StatusPieChart } from "./StatsCharts";

const VALID_PERIODS: Period[] = ["7d", "30d", "365d", "all"];

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period: Period = (VALID_PERIODS as string[]).includes(periodParam ?? "")
    ? (periodParam as Period)
    : "7d";

  const locale = await getLocale();
  const t = getDictionary(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("client_name, client_email, amount, currency, due_date, paid_at, created_at")
    .returns<StatsInvoice[]>();

  const invoices = data ?? [];

  const periodInvoices = filterByDateField(invoices, "created_at", period);
  const paidInvoices = filterByDateField(invoices, "paid_at", period);

  const totalFacture = sumByCurrency(periodInvoices);
  const totalEncaisse = sumByCurrency(paidInvoices);

  const paidCount = periodInvoices.filter((invoice) => invoice.paid_at).length;
  const paymentRate =
    periodInvoices.length > 0
      ? Math.round((paidCount / periodInvoices.length) * 100)
      : 0;

  const { series, currency } = buildRevenueSeries(paidInvoices, period, locale);
  const statusBreakdown = buildStatusBreakdown(periodInvoices, locale);
  const clients = buildClientStats(periodInvoices);

  const kpis: { label: string; value: string; helper?: string; className?: string }[] = [
    {
      label: t.stats.kpiInvoices,
      value: String(periodInvoices.length),
      helper: t.stats.kpiInvoicesHelper(paidCount),
    },
    {
      label: t.stats.kpiTotalBilled,
      value: formatMultiCurrency(totalFacture, locale),
    },
    {
      label: t.stats.kpiTotalCollected,
      value: formatMultiCurrency(totalEncaisse, locale),
      className: "text-success",
    },
    {
      label: t.stats.kpiPaymentRate,
      value: `${paymentRate}%`,
      helper: t.stats.kpiPaymentRateHelper(paidCount, periodInvoices.length),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <PeriodSelect locale={locale} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-surface p-4 shadow-sm"
          >
            <p className="text-sm text-muted">{kpi.label}</p>
            <p className={`mt-1 text-2xl font-bold ${kpi.className ?? ""}`}>
              {kpi.value}
            </p>
            {kpi.helper && <p className="mt-1 text-xs text-muted">{kpi.helper}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm lg:col-span-2">
          <h2 className="font-semibold">{t.stats.revenueTitle}</h2>
          <p className="text-sm text-muted">{t.stats.revenueSubtitle(currency)}</p>
          <div className="mt-2">
            <RevenueChart data={series} currency={currency} locale={locale} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <h2 className="font-semibold">{t.stats.statusBreakdownTitle}</h2>
          <div className="mt-2">
            <StatusPieChart data={statusBreakdown} locale={locale} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-4 py-3 font-medium">{t.stats.tableClient}</th>
              <th className="px-4 py-3 font-medium">{t.stats.tableInvoices}</th>
              <th className="px-4 py-3 font-medium">{t.stats.tableTotalBilled}</th>
              <th className="px-4 py-3 font-medium">{t.stats.tableTotalCollected}</th>
              <th className="px-4 py-3 font-medium">{t.stats.tableStatus}</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  {t.stats.noInvoicesForPeriod}
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <tr
                  key={client.client_email}
                  className={`transition-colors hover:bg-surface-hover ${
                    index < clients.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{client.client_name}</p>
                    <p className="text-xs text-muted">{client.client_email}</p>
                  </td>
                  <td className="px-4 py-3">{client.invoiceCount}</td>
                  <td className="px-4 py-3">
                    {formatMultiCurrency(client.totalByCurrency, locale)}
                  </td>
                  <td className="px-4 py-3">
                    {formatMultiCurrency(client.paidByCurrency, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        client.hasPaid
                          ? "bg-success-surface text-success"
                          : "bg-warning-surface text-warning"
                      }`}
                    >
                      {client.hasPaid ? t.stats.alreadyPaid : t.stats.neverPaid}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
