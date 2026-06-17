"use client";

import { useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { updateInvoice } from "./actions";
import { PaymentFields } from "./PaymentFields";
import type { PaymentMethod } from "@/lib/payment-methods";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Invoice = {
  id: string;
  client_name: string;
  client_email: string;
  client_siret: string | null;
  client_address: string | null;
  client_tva: string | null;
  client_contact_name: string | null;
  client_contact_role: string | null;
  amount: number;
  currency: string;
  due_date: string;
  payment_method: string | null;
  payment_value: string | null;
};

export function EditInvoiceModal({
  invoice,
  locale,
  open,
  onClose,
}: {
  invoice: Invoice;
  locale: Locale;
  open: boolean;
  onClose: () => void;
}) {
  const t = getDictionary(locale);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-120 overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-sm animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Pencil className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold">{t.editInvoiceModal.title}</h1>
            <p className="text-sm text-muted">{t.editInvoiceModal.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.newInvoiceModal.close}
            className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          action={updateInvoice}
          onSubmit={onClose}
          className="mt-5 flex flex-col gap-5"
        >
          <input type="hidden" name="id" value={invoice.id} />

          <div className="flex gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_name" className={labelClass}>
                {t.newInvoiceModal.clientName}
              </label>
              <input
                id="edit_client_name"
                name="client_name"
                type="text"
                required
                defaultValue={invoice.client_name}
                placeholder={t.newInvoiceModal.clientNamePlaceholder}
                className={inputClass}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_email" className={labelClass}>
                {t.newInvoiceModal.clientEmail}
              </label>
              <input
                id="edit_client_email"
                name="client_email"
                type="email"
                required
                defaultValue={invoice.client_email}
                placeholder={t.newInvoiceModal.clientEmailPlaceholder}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_siret" className={labelClass}>
                {t.newInvoiceModal.clientSiret}
              </label>
              <input
                id="edit_client_siret"
                name="client_siret"
                type="text"
                defaultValue={invoice.client_siret ?? ""}
                placeholder={t.newInvoiceModal.clientSiretPlaceholder}
                className={inputClass}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_tva" className={labelClass}>
                {t.newInvoiceModal.clientTva}
              </label>
              <input
                id="edit_client_tva"
                name="client_tva"
                type="text"
                defaultValue={invoice.client_tva ?? ""}
                placeholder={t.newInvoiceModal.clientTvaPlaceholder}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit_client_address" className={labelClass}>
              {t.newInvoiceModal.clientAddress}
            </label>
            <input
              id="edit_client_address"
              name="client_address"
              type="text"
              defaultValue={invoice.client_address ?? ""}
              placeholder={t.newInvoiceModal.clientAddressPlaceholder}
              className={inputClass}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_contact_name" className={labelClass}>
                {t.newInvoiceModal.contactName}
              </label>
              <input
                id="edit_client_contact_name"
                name="client_contact_name"
                type="text"
                defaultValue={invoice.client_contact_name ?? ""}
                placeholder={t.newInvoiceModal.contactNamePlaceholder}
                className={inputClass}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_client_contact_role" className={labelClass}>
                {t.newInvoiceModal.contactRole}
              </label>
              <input
                id="edit_client_contact_role"
                name="client_contact_role"
                type="text"
                defaultValue={invoice.client_contact_role ?? ""}
                placeholder={t.newInvoiceModal.contactRolePlaceholder}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex min-w-0 flex-2 flex-col gap-1.5">
              <label htmlFor="edit_amount" className={labelClass}>
                {t.newInvoiceModal.amount}
              </label>
              <input
                id="edit_amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={invoice.amount}
                placeholder="0,00"
                className={inputClass}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="edit_currency" className={labelClass}>
                {t.newInvoiceModal.currency}
              </label>
              <select
                id="edit_currency"
                name="currency"
                defaultValue={invoice.currency}
                className={inputClass}
              >
                <option value="EUR">€ EUR</option>
                <option value="USD">$ USD</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            <div className="flex min-w-0 flex-2 flex-col gap-1.5">
              <label htmlFor="edit_due_date" className={labelClass}>
                {t.newInvoiceModal.dueDate}
              </label>
              <input
                id="edit_due_date"
                name="due_date"
                type="date"
                required
                defaultValue={invoice.due_date}
                className={inputClass}
              />
            </div>
          </div>

          <PaymentFields
            locale={locale}
            defaultMethod={invoice.payment_method as PaymentMethod | null}
            defaultValue={invoice.payment_value ?? ""}
          />

          <button
            type="submit"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            <Pencil className="h-4 w-4" />
            {t.editInvoiceModal.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
