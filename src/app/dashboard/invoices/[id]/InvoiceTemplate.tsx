import Link from "next/link";
import { Printer } from "lucide-react";
import { formatCurrency, formatInvoiceNumber } from "@/lib/invoices";
import { getPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { UserProfile } from "@/app/dashboard/settings/profileActions";

type Invoice = {
  id: string;
  number: number;
  client_name: string;
  client_email: string;
  client_address: string | null;
  client_siret: string | null;
  client_tva: string | null;
  client_contact_name: string | null;
  client_contact_role: string | null;
  amount: number;
  currency: string;
  due_date: string;
  created_at: string;
  payment_method: string | null;
  payment_value: string | null;
  paid_at: string | null;
};

const secLabel = "mb-2 text-[11px] uppercase tracking-wider text-[#6b7280]";

export function InvoiceTemplate({
  invoice,
  locale,
  profile,
}: {
  invoice: Invoice;
  locale: Locale;
  profile: UserProfile | null;
}) {
  const t = getDictionary(locale);
  const paymentMethods = getPaymentMethods(locale);
  const isPaid = !!invoice.paid_at;
  const number = formatInvoiceNumber(invoice);
  const hasProfile = !!(profile?.display_name || profile?.email);

  const issueDate = new Date(invoice.created_at).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );

  const paymentLabel = invoice.payment_method
    ? paymentMethods[invoice.payment_method as PaymentMethod]?.label
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t.invoiceDetail.templateTitle}
        </h2>
        <Link
          href={`/print/${invoice.id}`}
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <Printer className="h-3.5 w-3.5" />
          {t.invoiceDetail.templatePrint}
        </Link>
      </div>

      {/* ── Document ── */}
      <div className="overflow-hidden rounded-xl bg-white text-[13px] text-[#111827] shadow-[0_0_0_1.5px_#d1d5db,0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_0_0_1.5px_#3a3a3a,0_8px_40px_rgba(0,0,0,0.60)]">

        {/* ── Banner ── */}
        <div className="bg-[#4f46e5] px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="mb-0.75 text-[11px] uppercase tracking-widest text-white/65">
                Facture
              </p>
              <p className="text-xl font-medium text-white">{number}</p>
            </div>
            {isPaid && (
              <span className="rounded-[20px] border border-white/30 bg-white/18 px-3.5 py-1.5 text-xs font-medium text-white">
                {t.invoiceStatus.paid} ✓
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-6 sm:gap-8">
            <div>
              <p className="mb-0.5 text-[11px] uppercase tracking-wider text-white/60">
                {t.invoiceDetail.templateDate.replace(" :", "")}
              </p>
              <p className="text-[13px] text-white">{issueDate}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[11px] uppercase tracking-wider text-white/60">
                {t.invoiceDetail.due.replace(" :", "")}
              </p>
              <p className="text-[13px] text-white">{invoice.due_date}</p>
            </div>
          </div>
        </div>

        {/* ── Émetteur / Client ── */}
        <div className="grid grid-cols-1 border-b border-[#e5e7eb] sm:grid-cols-2">
          {/* Émetteur */}
          <div className="border-b border-[#e5e7eb] px-5 py-5 sm:border-r sm:border-b-0 sm:px-7">
            <p className={secLabel}>{t.invoiceDetail.templateFrom}</p>
            {hasProfile ? (
              <>
                {profile.display_name && (
                  <p className="mb-1 text-[15px] font-medium">{profile.display_name}</p>
                )}
                {profile.email && (
                  <p className="mb-0.5 text-[13px] text-[#6b7280]">{profile.email}</p>
                )}
                {profile.address && (
                  <p className="mb-0.5 text-[13px] text-[#6b7280]">{profile.address}</p>
                )}
                {profile.siret && (
                  <p className="mb-0.5 text-[12px] text-[#9ca3af]">SIRET : {profile.siret}</p>
                )}
                {profile.tva && (
                  <p className="text-[12px] text-[#9ca3af]">TVA : {profile.tva}</p>
                )}
              </>
            ) : (
              <p className="text-[13px] italic text-[#9ca3af]">
                {t.invoiceDetail.templateFromPlaceholder}
              </p>
            )}
          </div>

          {/* Client */}
          <div className="px-5 py-5 sm:px-7">
            <p className={secLabel}>Client</p>
            <p className="mb-1 text-[15px] font-medium">{invoice.client_name}</p>
            <p className="mb-0.5 text-[13px] text-[#6b7280]">{invoice.client_email}</p>
            {invoice.client_address && (
              <p className="mb-0.5 text-[13px] text-[#6b7280]">{invoice.client_address}</p>
            )}
            {invoice.client_siret && (
              <p className="mb-0.5 text-[12px] text-[#9ca3af]">SIRET : {invoice.client_siret}</p>
            )}
            {invoice.client_tva && (
              <p className="mb-0.5 text-[12px] text-[#9ca3af]">TVA : {invoice.client_tva}</p>
            )}
            {(invoice.client_contact_name || invoice.client_contact_role) && (
              <p className="mt-1 text-[12px] text-[#9ca3af]">
                {[invoice.client_contact_name, invoice.client_contact_role]
                  .filter(Boolean)
                  .join(" — ")}
              </p>
            )}
          </div>
        </div>

        {/* ── Line items ── */}
        <div className="border-b border-[#e5e7eb] px-5 py-5 sm:px-7">
          <table className="w-full table-fixed border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="w-[45%] pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                  {t.invoiceDetail.templateDescription}
                </th>
                <th className="w-[15%] pb-2 text-center text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                  {t.invoiceDetail.templateQty}
                </th>
                <th className="w-[20%] pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                  {t.invoiceDetail.templateUnit}
                </th>
                <th className="w-[20%] pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2.5">{t.invoiceDetail.templateService}</td>
                <td className="py-2.5 text-center text-[#6b7280]">1</td>
                <td className="py-2.5 text-right text-[#6b7280]">
                  {formatCurrency(invoice.amount, invoice.currency, locale)}
                </td>
                <td className="py-2.5 text-right font-medium">
                  {formatCurrency(invoice.amount, invoice.currency, locale)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Payment / Total ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="border-b border-[#e5e7eb] px-5 py-5 sm:border-r sm:border-b-0 sm:px-7">
            {paymentLabel ? (
              <>
                <p className={secLabel}>{t.invoiceDetail.paymentMethod.replace(" :", "")}</p>
                <p className="mb-1 text-[13px] font-medium">{paymentLabel}</p>
                {invoice.payment_value && (
                  <p className="break-all font-mono text-[12px] text-[#6b7280]">
                    {invoice.payment_value}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[12px] italic text-[#9ca3af]">—</p>
            )}
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="mt-2 flex items-baseline justify-between border-t border-[#e5e7eb] pt-2">
              <span className="text-[13px] font-medium">Total</span>
              <span className="text-xl font-medium text-[#4f46e5]">
                {formatCurrency(invoice.amount, invoice.currency, locale)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Legal footer ── */}
        <div className="border-t border-[#e5e7eb] bg-[#f9fafb] px-5 py-3.5 text-center sm:px-7">
          <p className="text-[11px] text-[#9ca3af]">
            En cas de retard de paiement, des pénalités de 3× le taux légal seront appliquées,
            ainsi qu&apos;une indemnité forfaitaire de 40 € (art. L441-10 C. com.)
          </p>
        </div>
      </div>
    </div>
  );
}

