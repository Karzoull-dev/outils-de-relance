import { formatCurrency } from "./invoices";
import type { ReminderType } from "./reminders";
import type { PaymentMethod } from "./payment-methods";

type ReminderContent = {
  subject: string;
  isLate: boolean;
  dueLine: (dueDateFormatted: string) => string;
};

const REMINDER_CONTENT: Record<ReminderType, ReminderContent> = {
  "J-3": {
    subject: "Rappel : votre facture arrive à échéance dans 3 jours",
    isLate: false,
    dueLine: (d) => `arrive à échéance dans 3 jours, le <strong style="color:#111827;">${d}</strong>`,
  },
  "J0": {
    subject: "Votre facture arrive à échéance aujourd'hui",
    isLate: false,
    dueLine: (d) => `arrive à échéance aujourd'hui, <strong style="color:#111827;">${d}</strong>`,
  },
  "J+7": {
    subject: "Rappel : votre facture est en retard de paiement",
    isLate: true,
    dueLine: (d) => `est en retard de paiement depuis le <strong style="color:#111827;">${d}</strong> (7 jours)`,
  },
  "J+14": {
    subject: "Rappel : votre facture est en retard de paiement",
    isLate: true,
    dueLine: (d) => `est en retard de paiement depuis le <strong style="color:#111827;">${d}</strong> (14 jours)`,
  },
  "J+30": {
    subject: "Votre facture est toujours impayée",
    isLate: true,
    dueLine: (d) => `est en retard de paiement depuis le <strong style="color:#111827;">${d}</strong> (30 jours)`,
  },
};

const PAYMENT_EMOJI: Record<PaymentMethod, string> = {
  iban: "🏦",
  lydia: "📱",
  paypal: "🅿️",
  other: "🔗",
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  iban: "Virement bancaire (IBAN)",
  lydia: "Lydia",
  paypal: "PayPal",
  other: "Lien de paiement",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function invoiceNum(id: string, createdAt: string): string {
  const d = new Date(createdAt);
  return `FA-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${id.slice(0, 4).toUpperCase()}`;
}

function formatDateFR(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getReminderEmail({
  invoice,
  ownerName,
  reminderType,
  publicUrl,
}: {
  invoice: {
    id: string;
    created_at: string;
    client_name: string;
    amount: number;
    currency: string;
    due_date: string;
    payment_method: string | null;
    payment_value: string | null;
  };
  ownerName: string;
  reminderType: ReminderType;
  publicUrl: string;
}) {
  const { subject, isLate, dueLine } = REMINDER_CONTENT[reminderType];

  const number = invoiceNum(invoice.id, invoice.created_at);
  const amountFormatted = formatCurrency(invoice.amount, invoice.currency, "fr");
  const dueFormatted = formatDateFR(invoice.due_date);
  const safeOwnerName = escapeHtml(ownerName);
  const safeClientName = escapeHtml(invoice.client_name);
  const initials = getInitials(ownerName);

  const paymentMethod = invoice.payment_method as PaymentMethod | null;
  const hasPayment = !!(paymentMethod && invoice.payment_value);

  const paymentBlock = hasPayment
    ? `
      <div style="background:#f0fdf4; border:0.5px solid #bbf7d0; border-radius:10px; padding:1.25rem; margin-bottom:6px;">
        <p style="font-size:12px; font-weight:500; color:#166534; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.05em;">Moyen de paiement</p>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <span style="font-size:15px;">${PAYMENT_EMOJI[paymentMethod!]}</span>
          <span style="font-size:13px; font-weight:500; color:#166534;">${PAYMENT_LABEL[paymentMethod!]}</span>
        </div>
        <p style="font-size:13px; color:#15803d; margin:0; font-family:monospace; letter-spacing:0.03em; word-break:break-all;">${escapeHtml(invoice.payment_value!)}</p>
      </div>

      <div style="display:flex; align-items:center; gap:7px; margin-bottom:1.75rem; padding:10px 14px; background:#eff6ff; border-radius:8px; border:0.5px solid #bfdbfe;">
        <span style="font-size:14px; flex-shrink:0;">ℹ️</span>
        <p style="font-size:12px; color:#1d4ed8; margin:0; line-height:1.5;">Ce moyen de paiement ne vous convient pas ? <a href="${publicUrl}" style="color:#1d4ed8; font-weight:500; text-decoration:underline;">Envoyez-nous un message</a> et nous trouverons une solution ensemble.</p>
      </div>
    `
    : `
      <div style="display:flex; align-items:center; gap:7px; margin-bottom:1.75rem; padding:10px 14px; background:#eff6ff; border-radius:8px; border:0.5px solid #bfdbfe;">
        <span style="font-size:14px; flex-shrink:0;">ℹ️</span>
        <p style="font-size:12px; color:#1d4ed8; margin:0; line-height:1.5;">Une question sur cette facture ? <a href="${publicUrl}" style="color:#1d4ed8; font-weight:500; text-decoration:underline;">Envoyez-nous un message</a>.</p>
      </div>
    `;

  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const html = `
<div style="background:#f4f4f5; padding:2rem 1rem; font-family:${fontFamily};">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:0.5px solid #e4e4e7;">

    <div style="background:#4f46e5; padding:1.75rem 2rem;">
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:30px; height:30px; background:rgba(255,255,255,0.2); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px;">⚡</div>
          <span style="font-size:13px; color:rgba(255,255,255,0.7);">via Outils de relance</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:14px;">
        <div style="width:48px; height:48px; background:rgba(255,255,255,0.15); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:500; color:#fff; flex-shrink:0;">${initials}</div>
        <div>
          <p style="font-size:19px; font-weight:500; color:#fff; margin:0 0 3px;">${safeOwnerName}</p>
          <p style="font-size:13px; color:rgba(255,255,255,0.7); margin:0;">vous a envoyé une facture · ${number}</p>
        </div>
      </div>
    </div>

    <div style="padding:2rem;">

      <p style="font-size:15px; color:#374151; margin:0 0 1.5rem; line-height:1.6;">Bonjour ${safeClientName},</p>
      <p style="font-size:15px; color:#374151; margin:0 0 1.5rem; line-height:1.6;">
        <strong style="color:#111827;">${safeOwnerName}</strong> vous rappelle que la facture <strong style="color:#111827;">${number}</strong> d'un montant de <strong style="color:#111827;">${amountFormatted}</strong> ${dueLine(dueFormatted)}.
      </p>

      <div style="background:#f9fafb; border:0.5px solid #e5e7eb; border-radius:10px; padding:1.25rem; margin-bottom:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom:0.5px solid #e5e7eb;">
          <span style="font-size:13px; color:#6b7280;">Numéro de facture</span>
          <span style="font-size:13px; font-weight:500; color:#111827;">${number}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom:0.5px solid #e5e7eb;">
          <span style="font-size:13px; color:#6b7280;">Échéance</span>
          <span style="font-size:13px; font-weight:500; color:${isLate ? "#ef4444" : "#111827"};">${dueFormatted}${isLate ? " — En retard" : ""}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; color:#6b7280;">Montant dû</span>
          <span style="font-size:18px; font-weight:500; color:#4f46e5;">${amountFormatted}</span>
        </div>
      </div>

      ${paymentBlock}

      <div style="${hasPayment ? "" : "display:grid; grid-template-columns:1fr 1fr; gap:10px;"} margin-bottom:1.75rem;">
        <a href="${publicUrl}" style="display:flex; align-items:center; justify-content:center; gap:8px; background:#4f46e5; color:#fff; padding:13px 16px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; ${hasPayment ? "margin:0 24px;" : ""}">
          Voir la facture
        </a>
        ${hasPayment ? "" : `<a href="${publicUrl}" style="display:flex; align-items:center; justify-content:center; gap:8px; background:#ffffff; color:#374151; padding:13px 16px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:500; border:0.5px solid #d1d5db;">
          Envoyer un message
        </a>`}
      </div>

      <div style="border-top:0.5px solid #e5e7eb; padding-top:1.25rem;">
        <p style="font-size:13px; color:#6b7280; line-height:1.6; margin:0 0 8px;">Si vous avez déjà effectué ce règlement, veuillez ignorer ce message ou nous en informer via le bouton ci-dessus.</p>
        <p style="font-size:13px; color:#6b7280; line-height:1.6; margin:0;">Cordialement,<br><strong style="color:#374151;">${safeOwnerName}</strong></p>
      </div>

    </div>

    <div style="background:#f9fafb; border-top:0.5px solid #e5e7eb; padding:1rem 2rem; text-align:center;">
      <p style="font-size:11px; color:#9ca3af; margin:0;">Cet email a été envoyé automatiquement par <strong style="color:#6b7280;">Outils de relance</strong> · Ne pas répondre à cet email</p>
    </div>

  </div>
</div>
  `;

  const text = [
    `Bonjour ${invoice.client_name},`,
    "",
    `${ownerName} vous rappelle que la facture ${number} d'un montant de ${amountFormatted} ${isLate ? `est en retard de paiement depuis le ${dueFormatted}` : `arrive à échéance le ${dueFormatted}`}.`,
    "",
    `Numéro de facture : ${number}`,
    `Échéance : ${dueFormatted}${isLate ? " (en retard)" : ""}`,
    `Montant dû : ${amountFormatted}`,
    ...(hasPayment ? ["", `Moyen de paiement : ${PAYMENT_LABEL[paymentMethod!]} — ${invoice.payment_value}`] : []),
    "",
    `Voir la facture et envoyer un message : ${publicUrl}`,
    "",
    `Cordialement,`,
    ownerName,
  ].join("\n");

  return { subject, html, text };
}
