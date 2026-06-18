import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatInvoiceNumber } from "@/lib/invoices";
import { getPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PublicPrintBar } from "./PublicPrintBar";

export default async function PublicFacturePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const paymentMethods = getPaymentMethods(locale);

  const supabase = createAdminClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("public_token", token)
    .maybeSingle();

  if (!invoice) notFound();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, email, address, siret, tva")
    .eq("id", invoice.user_id)
    .maybeSingle();

  const isPaid = !!invoice.paid_at;
  const hasProfile = !!(profile?.display_name || profile?.email);
  const number = formatInvoiceNumber(invoice);
  const paymentLabel = invoice.payment_method
    ? paymentMethods[invoice.payment_method as PaymentMethod]?.label
    : null;

  const issueDate = new Date(invoice.created_at).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "2-digit", year: "numeric" },
  );

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style>{`
        /* ── Reset ── */
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        body { font-family: Arial, Helvetica, sans-serif; background: #f3f4f6; color: #111827; }

        /* ── Action bar ── */
        .action-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: #fff; border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .action-bar-right { display: flex; gap: 0.5rem; }
        .btn-back {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
          color: #6b7280; background: transparent; border: none; cursor: pointer;
          text-decoration: none; transition: background 0.15s;
        }
        .btn-back:hover { background: #f3f4f6; color: #111827; }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
          color: #374151; background: #f9fafb; border: 1px solid #e5e7eb; cursor: pointer;
          transition: background 0.15s;
        }
        .btn-secondary:hover { background: #f3f4f6; }
        .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-print {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
          color: #fff; background: #4f46e5; border: none; cursor: pointer;
          transition: opacity 0.15s;
        }
        .btn-print:hover { opacity: 0.88; }
        .btn-print:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        /* ── Wrapper ── */
        .outer {
          padding: 80px 20px 40px;
          display: flex; flex-direction: column; align-items: center;
        }
        .page { width: 100%; max-width: 680px; }
        .doc  { border: 0.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff; }

        /* ── Banner ── */
        .banner     { background: #4f46e5; padding: 1.25rem 1.75rem; }
        .banner-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .inv-label  { font-size: 11px; color: rgba(255,255,255,0.65); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
        .inv-num    { font-size: 20px; font-weight: 500; color: #fff; }
        .badge-paid { background: rgba(255,255,255,0.18); color: #fff; font-size: 12px; font-weight: 500; padding: 5px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.3); }
        .dates      { display: flex; gap: 2rem; margin-top: 1rem; }
        .date-lbl   { font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
        .date-val   { font-size: 13px; color: #fff; }

        /* ── Parties ── */
        .parties    { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 0.5px solid #e5e7eb; }
        .party      { padding: 1.25rem 1.75rem; }
        .party-l    { border-right: 0.5px solid #e5e7eb; }
        .sec-lbl    { font-size: 11px; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
        .party-name { font-size: 15px; font-weight: 500; margin-bottom: 4px; color: #111827; }
        .party-row  { font-size: 13px; color: #6b7280; margin-bottom: 2px; }
        .party-meta { font-size: 12px; color: #9ca3af; margin-bottom: 2px; }
        .party-contact { font-size: 12px; color: #9ca3af; margin-top: 4px; }
        .placeholder { font-size: 13px; color: #9ca3af; font-style: italic; }

        /* ── Line items ── */
        .items      { padding: 1.25rem 1.75rem; border-bottom: 0.5px solid #e5e7eb; }
        .items table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
        .th         { padding-bottom: 8px; color: #6b7280; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 0.5px solid #e5e7eb; }
        .th-l       { text-align: left; width: 45%; }
        .th-c       { text-align: center; width: 15%; }
        .th-r       { text-align: right; width: 20%; }
        .td-l       { padding: 10px 0; color: #111827; }
        .td-c       { padding: 10px 0; text-align: center; color: #6b7280; }
        .td-r       { padding: 10px 0; text-align: right; color: #6b7280; }
        .td-total   { padding: 10px 0; text-align: right; font-weight: 500; color: #111827; }

        /* ── Bottom ── */
        .bottom     { display: grid; grid-template-columns: 1fr 1fr; }
        .pay        { padding: 1.25rem 1.75rem; border-right: 0.5px solid #e5e7eb; }
        .pay-name   { font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #111827; }
        .pay-val    { font-size: 12px; color: #6b7280; word-break: break-all; font-family: monospace; }
        .totals     { padding: 1.25rem 1.75rem; }
        .total-row  { display: flex; justify-content: space-between; align-items: baseline; border-top: 0.5px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
        .total-lbl  { font-size: 13px; font-weight: 500; color: #111827; }
        .total-amt  { font-size: 20px; font-weight: 500; color: #4f46e5; }

        /* ── Footer doc ── */
        .footer     { padding: 0.875rem 1.75rem; background: #f9fafb; border-top: 0.5px solid #e5e7eb; text-align: center; }
        .footer p   { font-size: 11px; color: #9ca3af; }

        /* ── Mobile ── */
        @media screen and (max-width: 600px) {
          .outer { padding: 130px 12px 32px; }
          .action-bar { flex-wrap: wrap; row-gap: 8px; padding: 0.6rem 1rem; }
          .action-bar-right { width: 100%; justify-content: flex-end; }
          .banner, .party, .items, .pay, .totals, .footer { padding-left: 1.25rem; padding-right: 1.25rem; }
          .dates { flex-wrap: wrap; gap: 1.25rem; }
          .parties { grid-template-columns: 1fr; }
          .party-l { border-right: none; border-bottom: 0.5px solid #e5e7eb; }
          .bottom { grid-template-columns: 1fr; }
          .pay { border-right: none; border-bottom: 0.5px solid #e5e7eb; }
        }

        /* ── Print ── */
        @page { size: A4; margin: 0; }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .action-bar { display: none !important; }
          .outer { display: block !important; padding: 0 !important; }
          .page  { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
          .doc   { border-radius: 0 !important; border: none !important; }
          body   { background: #fff !important; }
        }
      `}</style>

      <PublicPrintBar backUrl={`/f/${token}`} locale={locale} invoiceNumber={number} />

      <div className="outer">
        <div className="page">
          <div className="doc">

            {/* ── Banner ── */}
            <div className="banner">
              <div className="banner-top">
                <div>
                  <p className="inv-label">Facture</p>
                  <p className="inv-num">{number}</p>
                </div>
                {isPaid && (
                  <span className="badge-paid">{t.invoiceStatus.paid} ✓</span>
                )}
              </div>
              <div className="dates">
                <div>
                  <p className="date-lbl">{t.invoiceDetail.templateDate.replace(" :", "")}</p>
                  <p className="date-val">{issueDate}</p>
                </div>
                <div>
                  <p className="date-lbl">{t.invoiceDetail.due.replace(" :", "")}</p>
                  <p className="date-val">{invoice.due_date}</p>
                </div>
              </div>
            </div>

            {/* ── Émetteur / Client ── */}
            <div className="parties">
              <div className="party party-l">
                <p className="sec-lbl">{t.invoiceDetail.templateFrom}</p>
                {hasProfile ? (
                  <>
                    {profile!.display_name && <p className="party-name">{profile!.display_name}</p>}
                    {profile!.email && <p className="party-row">{profile!.email}</p>}
                    {profile!.address && <p className="party-row">{profile!.address}</p>}
                    {profile!.siret && <p className="party-meta">SIRET : {profile!.siret}</p>}
                    {profile!.tva && <p className="party-meta">TVA : {profile!.tva}</p>}
                  </>
                ) : (
                  <p className="placeholder">{t.invoiceDetail.templateFromPlaceholder}</p>
                )}
              </div>
              <div className="party">
                <p className="sec-lbl">Client</p>
                <p className="party-name">{invoice.client_name}</p>
                <p className="party-row">{invoice.client_email}</p>
                {invoice.client_address && (
                  <p className="party-row">{invoice.client_address}</p>
                )}
                {invoice.client_siret && (
                  <p className="party-meta">SIRET : {invoice.client_siret}</p>
                )}
                {invoice.client_tva && (
                  <p className="party-meta">TVA : {invoice.client_tva}</p>
                )}
                {(invoice.client_contact_name || invoice.client_contact_role) && (
                  <p className="party-contact">
                    {[invoice.client_contact_name, invoice.client_contact_role]
                      .filter(Boolean)
                      .join(" — ")}
                  </p>
                )}
              </div>
            </div>

            {/* ── Lignes ── */}
            <div className="items">
              <table>
                <thead>
                  <tr>
                    <th className="th th-l">{t.invoiceDetail.templateDescription}</th>
                    <th className="th th-c">{t.invoiceDetail.templateQty}</th>
                    <th className="th th-r">{t.invoiceDetail.templateUnit}</th>
                    <th className="th th-r">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-l">{t.invoiceDetail.templateService}</td>
                    <td className="td-c">1</td>
                    <td className="td-r">{formatCurrency(invoice.amount, invoice.currency, locale)}</td>
                    <td className="td-total">{formatCurrency(invoice.amount, invoice.currency, locale)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Paiement / Total ── */}
            <div className="bottom">
              <div className="pay">
                {paymentLabel ? (
                  <>
                    <p className="sec-lbl">{t.invoiceDetail.paymentMethod.replace(" :", "")}</p>
                    <p className="pay-name">{paymentLabel}</p>
                    {invoice.payment_value && (
                      <p className="pay-val">{invoice.payment_value}</p>
                    )}
                  </>
                ) : (
                  <p className="placeholder">—</p>
                )}
              </div>
              <div className="totals">
                <div className="total-row">
                  <span className="total-lbl">Total</span>
                  <span className="total-amt">
                    {formatCurrency(invoice.amount, invoice.currency, locale)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Mention légale ── */}
            <div className="footer">
              <p>
                En cas de retard de paiement, des pénalités de 3× le taux légal seront appliquées,
                ainsi qu&apos;une indemnité forfaitaire de 40 € (art. L441-10 C. com.)
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
