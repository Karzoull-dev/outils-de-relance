import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, getInvoiceStatus } from "@/lib/invoices";
import { getLocale } from "@/lib/i18n/getLocale";
import { MessageSection } from "./MessageSection";

function invoiceNum(id: string, createdAt: string): string {
  const d = new Date(createdAt);
  return `FA-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${id.slice(0, 4).toUpperCase()}`;
}

export default async function PublicInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { token } = await params;
  const { sent } = await searchParams;
  const locale = await getLocale();

  const supabase = createAdminClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("public_token", token)
    .maybeSingle();

  if (!invoice) notFound();

  const [profileRes, clientMsgRes] = await Promise.all([
    supabase.from("user_profiles").select("display_name").eq("id", invoice.user_id).maybeSingle(),
    supabase.from("invoice_messages").select("id").eq("invoice_id", invoice.id).eq("sender", "client").limit(1),
  ]);

  const profile = profileRes.data;
  const clientSentMessage = (clientMsgRes.data?.length ?? 0) > 0;
  const status = getInvoiceStatus(invoice);
  const isPaid = status === "paid";
  const isLate = status === "late";

  const amount = formatCurrency(invoice.amount, invoice.currency, locale);
  const dueFormatted = new Date(invoice.due_date + "T00:00:00").toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" },
  );
  const paidFormatted = invoice.paid_at
    ? new Date(invoice.paid_at).toLocaleString(
        locale === "fr" ? "fr-FR" : "en-GB",
        { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" },
      )
    : null;

  const ownerName = profile?.display_name ?? (locale === "fr" ? "Votre prestataire" : "Your service provider");
  const number = invoiceNum(invoice.id, invoice.created_at);

  const badge = isPaid
    ? { label: locale === "fr" ? "Réglée ✓" : "Paid ✓", bg: "#dcfce7", color: "#15803d" }
    : isLate
    ? { label: locale === "fr" ? "En retard" : "Overdue", bg: "#fee2e2", color: "#dc2626" }
    : { label: locale === "fr" ? "En attente de paiement" : "Awaiting payment", bg: "#fef9c3", color: "#a16207" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#111827", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{ position: "fixed", inset: "0 0 auto 0", height: 56, background: "#fff", borderBottom: "1px solid #eaecf0", display: "flex", alignItems: "center", padding: "0 24px", zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#4f46e5", letterSpacing: "-0.01em" }}>
          Outils de relance
        </span>
      </header>

      {/* ── Main ── */}
      <main style={{ paddingTop: 80, paddingBottom: 64, paddingLeft: 16, paddingRight: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Bloc récapitulatif ── */}
          <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 20, padding: "clamp(28px, 8vw, 40px) clamp(20px, 6vw, 32px)", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 6, marginTop: 0 }}>
              {locale === "fr" ? "Facture envoyée par" : "Invoice sent by"}
            </p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 36, marginTop: 0 }}>
              {ownerName}
            </p>

            <p style={{ fontSize: "clamp(36px, 13vw, 52px)", fontWeight: 800, color: "#111827", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 16, marginTop: 0, wordBreak: "break-word" }}>
              {amount}
            </p>

            {isPaid ? (
              <p style={{ fontSize: 14, color: "#15803d", marginBottom: 20, marginTop: 0 }}>
                {locale === "fr" ? `Réglée le ${paidFormatted}` : `Paid on ${paidFormatted}`}
              </p>
            ) : (
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20, marginTop: 0 }}>
                {locale === "fr"
                  ? `À régler avant le ${dueFormatted}`
                  : `Due by ${dueFormatted}`}
              </p>
            )}

            <span style={{
              display: "inline-block",
              padding: "7px 20px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              background: badge.bg,
              color: badge.color,
            }}>
              {badge.label}
            </span>

            <p style={{ fontSize: 12, color: "#c9cdd6", marginTop: 28, marginBottom: 0 }}>
              {locale === "fr" ? "N° facture" : "Invoice no."} · {number}
            </p>
          </div>

          {/* ── Moyen de paiement (si non réglée et renseigné) ── */}
          {!isPaid && invoice.payment_method && invoice.payment_value && (
            <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 16, padding: "20px 24px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", marginBottom: 14, marginTop: 0 }}>
                {locale === "fr" ? "Moyen de paiement" : "Payment method"}
              </p>
              {invoice.payment_method === "iban" && (
                <p style={{ fontSize: 14, color: "#111827", margin: 0 }}>
                  <span style={{ color: "#6b7280" }}>IBAN : </span>
                  <span style={{ fontFamily: "monospace", fontWeight: 500, wordBreak: "break-all" }}>
                    {invoice.payment_value}
                  </span>
                </p>
              )}
              {invoice.payment_method === "lydia" && (
                <p style={{ fontSize: 14, color: "#111827", margin: 0 }}>
                  <span style={{ color: "#6b7280" }}>Lydia : </span>
                  <span style={{ fontFamily: "monospace" }}>{invoice.payment_value}</span>
                </p>
              )}
              {(invoice.payment_method === "paypal" || invoice.payment_method === "other") && (
                <a
                  href={invoice.payment_value}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "10px 24px", background: "#4f46e5", color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}
                >
                  {invoice.payment_method === "paypal"
                    ? (locale === "fr" ? "Payer via PayPal" : "Pay via PayPal")
                    : (locale === "fr" ? "Lien de paiement" : "Payment link")}
                </a>
              )}
            </div>
          )}

          {/* ── Bouton d'action principal ── */}
          <a
            href={`/f/${token}/facture`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#4f46e5", color: "#fff",
              borderRadius: 12, padding: "14px 20px",
              fontWeight: 700, fontSize: 15,
              textDecoration: "none",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            {locale === "fr" ? "Télécharger la facture" : "Download invoice"}
          </a>

          {/* ── Zone de message (composant client avec toggle) ── */}
          <MessageSection
            token={token}
            locale={locale}
            clientSentMessage={clientSentMessage}
            sent={sent === "1"}
          />

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ textAlign: "center", padding: "20px 16px", borderTop: "1px solid #eaecf0" }}>
        <p style={{ fontSize: 12, color: "#c9cdd6", margin: 0 }}>
          Propulsé par Outils de relance
        </p>
      </footer>

    </div>
  );
}
