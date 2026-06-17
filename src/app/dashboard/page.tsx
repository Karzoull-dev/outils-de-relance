import Link from "next/link";
import { ArrowRight, Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceStatus, getStatusLabels, formatCurrency } from "@/lib/invoices";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getUserProfile } from "@/app/dashboard/settings/profileActions";

type RecentMessage = {
  id: string;
  message: string;
  sender: "client" | "owner" | "system";
  created_at: string;
  invoice_id: string;
  invoices: { client_name: string } | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const statusLabels = getStatusLabels(locale);

  const [{ data: invoices }, profile] = await Promise.all([
    supabase.from("invoices").select("*"),
    getUserProfile(),
  ]);

  const profileIncomplete = !profile?.display_name || !profile?.address || !profile?.siret;

  let pending = 0;
  let late = 0;
  let paid = 0;

  for (const invoice of invoices ?? []) {
    const status = getInvoiceStatus(invoice);
    if (status === "pending") pending++;
    if (status === "late") late++;
    if (status === "paid") paid++;
  }

  const stats = [
    { label: t.dashboard.statTotalInvoices, value: invoices?.length ?? 0, className: "" },
    { label: t.dashboard.statPending, value: pending, className: "text-warning" },
    { label: t.dashboard.statLate, value: late, className: "text-danger" },
    { label: t.dashboard.statPaid, value: paid, className: "text-success" },
  ];

  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const in7DaysStr = in7Days.toISOString().slice(0, 10);

  const { data: actionableInvoices } = await supabase
    .from("invoices")
    .select("*")
    .is("paid_at", null)
    .lte("due_date", in7DaysStr)
    .order("due_date", { ascending: true });

  const { data: pinnedInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("pinned", true)
    .order("due_date", { ascending: true });

  const { data: recentMessages } = await supabase
    .from("invoice_messages")
    .select("id, message, sender, created_at, invoice_id, invoices(client_name)")
    .eq("sender", "client")
    .order("created_at", { ascending: false })
    .limit(2)
    .returns<RecentMessage[]>();

  return (
    <div>
      {profileIncomplete && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300">
          <span>
            ⚠️ Votre profil de facturation est incomplet — vos factures afficheront des informations manquantes.
          </span>
          <Link href="/dashboard?openSettings=1" className="shrink-0 font-medium underline underline-offset-2 hover:opacity-75">
            Compléter mon profil →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-surface p-4 shadow-sm"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.className}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          {!!pinnedInvoices?.length && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Pin className="h-4 w-4 text-accent" />
                {t.dashboard.importantTitle}
              </h2>

              <div className="mt-2 flex flex-col gap-2">
                {pinnedInvoices.map((invoice) => {
                  const status = getInvoiceStatus(invoice);
                  const { label, className } = statusLabels[status];

                  return (
                    <Link
                      key={invoice.id}
                      href={`/dashboard/invoices/${invoice.id}`}
                      className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 p-3 shadow-sm transition-colors hover:bg-accent/10"
                    >
                      <div>
                        <p className="font-semibold">{invoice.client_name}</p>
                        <p className="text-xs text-muted">
                          {formatCurrency(invoice.amount, invoice.currency, locale)} ·{" "}
                          {t.dashboard.due} {invoice.due_date}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold">{t.dashboard.toHandle}</h2>

          {!actionableInvoices?.length ? (
            <p className="mt-2 text-sm text-muted">{t.dashboard.nothingToHandle}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {actionableInvoices.map((invoice) => {
                const status = getInvoiceStatus(invoice);
                const { label, className } = statusLabels[status];

                return (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 shadow-sm transition-colors hover:bg-surface-hover"
                  >
                    <div>
                      <p className="font-semibold">{invoice.client_name}</p>
                      <p className="text-xs text-muted">
                        {formatCurrency(invoice.amount, invoice.currency, locale)} ·{" "}
                        {t.dashboard.due} {invoice.due_date}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">{t.dashboard.recentMessages}</h2>

          {!recentMessages?.length ? (
            <p className="mt-2 text-sm text-muted">{t.dashboard.noNewMessages}</p>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {recentMessages.map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/messages/${m.invoice_id}`}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 shadow-sm transition-colors hover:bg-surface-hover"
                >
                  <span className="font-semibold">
                    {m.invoices?.client_name}
                  </span>
                  <p className="truncate text-sm text-muted">
                    {m.message}
                  </p>
                </Link>
              ))}
              <Link
                href="/dashboard/messages"
                className="mt-1 flex items-center gap-1 self-end text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                {t.dashboard.seeMore}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
