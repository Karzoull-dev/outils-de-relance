import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceNote } from "./InvoiceNote";
import { InvoiceTemplate } from "./InvoiceTemplate";
import { InvoiceDetailEditModal } from "./InvoiceDetailEditModal";
import {
  FilePlus,
  Pencil,
  CheckCircle2,
  Pin,
  PinOff,
  MessageSquare,
  MessageCircle,
  Building2,
  Mail,
  MapPin,
  Hash,
  Receipt,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceStatus, getStatusLabels, formatCurrency } from "@/lib/invoices";
import { getPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getUserProfile } from "@/app/dashboard/settings/profileActions";

function formatTimestamp(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type TimelineEntry = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  iconEl: React.ReactNode;
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const statusLabels = getStatusLabels(locale);
  const paymentMethods = getPaymentMethods(locale);

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!invoice) notFound();

  const [{ data: events }, { data: messages }, profile] = await Promise.all([
    supabase
      .from("invoice_events")
      .select("id, event_type, description, created_at")
      .eq("invoice_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("invoice_messages")
      .select("id, message, sender, created_at")
      .eq("invoice_id", id)
      .neq("sender", "system")
      .order("created_at", { ascending: true }),
    getUserProfile(),
  ]);

  const status = getInvoiceStatus(invoice);
  const { label, className } = statusLabels[status];

  // Build unified timeline
  const iconClass = "h-3.5 w-3.5";

  const eventIconMap: Record<string, React.ReactNode> = {
    updated: <Pencil className={`${iconClass} text-accent`} />,
    paid: <CheckCircle2 className={`${iconClass} text-success`} />,
    pinned: <Pin className={`${iconClass} text-accent`} />,
    unpinned: <PinOff className={`${iconClass} text-muted`} />,
  };

  const createdEntry: TimelineEntry = {
    id: `created-${invoice.id}`,
    title: t.invoiceDetail.timelineCreated,
    description: `${invoice.client_name} — ${formatCurrency(invoice.amount, invoice.currency, locale)}`,
    created_at: invoice.created_at,
    iconEl: <FilePlus className={`${iconClass} text-success`} />,
  };

  const eventEntries: TimelineEntry[] = (events ?? []).map((e) => ({
    id: e.id,
    title:
      e.event_type === "updated"
        ? t.invoiceDetail.timelineUpdated
        : e.event_type === "paid"
          ? t.invoiceDetail.timelinePaid
          : e.event_type === "pinned"
            ? t.invoiceDetail.timelinePinned
            : t.invoiceDetail.timelineUnpinned,
    description: e.description ?? "",
    created_at: e.created_at,
    iconEl: eventIconMap[e.event_type] ?? <FilePlus className={`${iconClass} text-muted`} />,
  }));

  const messageEntries: TimelineEntry[] = (messages ?? []).map((m) => ({
    id: m.id,
    title:
      m.sender === "owner"
        ? t.invoiceDetail.timelineMessageOwner
        : t.invoiceDetail.timelineMessageClient,
    description: m.message,
    created_at: m.created_at,
    iconEl:
      m.sender === "owner" ? (
        <MessageSquare className={`${iconClass} text-accent`} />
      ) : (
        <MessageCircle className={`${iconClass} text-info`} />
      ),
  }));

  const timeline = [createdEntry, ...eventEntries, ...messageEntries].sort(
    (a, b) => a.created_at.localeCompare(b.created_at),
  );

  return (
    <div className="max-w-6xl">
      <Link href="/dashboard/invoices" className="text-sm text-muted underline">
        {t.invoiceDetail.back}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_560px]">
        {/* ── LEFT: invoice info ── */}
        <div className="flex flex-col gap-4">

          {/* Client card */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.invoiceDetail.clientInfoTitle}
            </h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <Building2 className="h-4 w-4 shrink-0 text-muted" />
                <span className="text-lg font-bold">{invoice.client_name}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted" />
                <span className="text-sm text-muted">{invoice.client_email}</span>
              </div>

              {invoice.client_address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                  <span className="text-sm text-muted">{invoice.client_address}</span>
                </div>
              )}

              {(invoice.client_siret || invoice.client_tva) && (
                <div className="mt-1 flex flex-col gap-1 border-t border-border pt-2">
                  {invoice.client_siret && (
                    <div className="flex items-center gap-2.5">
                      <Hash className="h-4 w-4 shrink-0 text-muted" />
                      <span className="text-xs text-muted">
                        {t.invoiceDetail.siret} {invoice.client_siret}
                      </span>
                    </div>
                  )}
                  {invoice.client_tva && (
                    <div className="flex items-center gap-2.5">
                      <Receipt className="h-4 w-4 shrink-0 text-muted" />
                      <span className="text-xs text-muted">
                        {t.invoiceDetail.tva} {invoice.client_tva}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {(invoice.client_contact_name || invoice.client_contact_role) && (
                <div className="mt-1 flex items-center gap-2.5 border-t border-border pt-2">
                  <User className="h-4 w-4 shrink-0 text-muted" />
                  <span className="text-sm text-muted">
                    {[invoice.client_contact_name, invoice.client_contact_role]
                      .filter(Boolean)
                      .join(" — ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Invoice details card */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.invoiceDetail.invoiceInfoTitle}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">{t.invoiceDetail.amount}</span>
                <span className="font-semibold">
                  {formatCurrency(invoice.amount, invoice.currency, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted">{t.invoiceDetail.due}</span>
                <span>{invoice.due_date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted">{t.invoiceDetail.status}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
                  {label}
                </span>
              </div>

              {invoice.payment_method && invoice.payment_value && (
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-muted">{t.invoiceDetail.paymentMethod}</span>
                  <span className="text-right">
                    {paymentMethods[invoice.payment_method as PaymentMethod]?.label}
                    {" — "}
                    {invoice.payment_value}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Conversation link */}
          <div className="flex items-center justify-end">
            <Link
              href={`/dashboard/messages/${invoice.id}`}
              className="text-sm font-medium text-accent hover:underline"
            >
              {t.invoiceDetail.viewConversation}
            </Link>
          </div>

          {/* Notes */}
          <InvoiceNote
            invoiceId={invoice.id}
            defaultNote={invoice.notes ?? null}
            locale={locale}
          />

          {/* Timeline — bas de la colonne gauche */}
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.invoiceDetail.timelineTitle}
            </h2>

            {timeline.length === 0 ? (
              <p className="text-sm text-muted">{t.invoiceDetail.timelineEmpty}</p>
            ) : (
              <div className="relative">
                <div className="absolute left-2.75 top-3 bottom-3 w-px bg-border" />
                <div className="flex flex-col">
                  {timeline.map((entry, i) => (
                    <div
                      key={entry.id}
                      className={`relative flex gap-3 ${i < timeline.length - 1 ? "pb-5" : ""}`}
                    >
                      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
                        {entry.iconEl}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-sm font-medium">{entry.title}</span>
                          <span className="text-xs text-muted">
                            {formatTimestamp(entry.created_at, locale)}
                          </span>
                        </div>
                        {entry.description && (
                          <p className="mt-0.5 text-xs text-muted">{entry.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: template pleine hauteur ── */}
        <div className="lg:self-start">
          <InvoiceTemplate invoice={invoice} locale={locale} profile={profile} />
          <InvoiceDetailEditModal invoice={invoice} locale={locale} />
        </div>
      </div>
    </div>
  );
}
