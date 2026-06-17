"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, Send, X } from "lucide-react";
import { createInvoice } from "./actions";
import { PaymentFields } from "./PaymentFields";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function NewInvoiceModal({ error, locale }: { error?: string; locale: Locale }) {
  const [open, setOpen] = useState(!!error);
  const router = useRouter();
  const t = getDictionary(locale);

  const close = () => {
    setOpen(false);
    if (error) router.replace("/dashboard/invoices");
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const inputClass =
    "w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="max-w-50 rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        {t.invoices.newInvoice}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm animate-fade-in"
          onClick={close}
        >
          <div
            className="max-h-[90vh] w-full max-w-120 overflow-y-auto rounded-xl border border-border bg-surface p-6 shadow-sm animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border pb-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FilePlus className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold">{t.newInvoiceModal.title}</h1>
                <p className="text-sm text-muted">{t.newInvoiceModal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t.newInvoiceModal.close}
                className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-surface-hover"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-danger-surface p-2 text-sm text-danger">
                {error}
              </p>
            )}

            <form
              action={createInvoice}
              onSubmit={() => setOpen(false)}
              className="mt-5 flex flex-col gap-5"
            >
              <div className="flex gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_name" className={labelClass}>
                    {t.newInvoiceModal.clientName}
                  </label>
                  <input
                    id="client_name"
                    name="client_name"
                    type="text"
                    required
                    placeholder={t.newInvoiceModal.clientNamePlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_email" className={labelClass}>
                    {t.newInvoiceModal.clientEmail}
                  </label>
                  <input
                    id="client_email"
                    name="client_email"
                    type="email"
                    required
                    placeholder={t.newInvoiceModal.clientEmailPlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_siret" className={labelClass}>
                    {t.newInvoiceModal.clientSiret}
                  </label>
                  <input
                    id="client_siret"
                    name="client_siret"
                    type="text"
                    placeholder={t.newInvoiceModal.clientSiretPlaceholder}
                    className={inputClass}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_tva" className={labelClass}>
                    {t.newInvoiceModal.clientTva}
                  </label>
                  <input
                    id="client_tva"
                    name="client_tva"
                    type="text"
                    placeholder={t.newInvoiceModal.clientTvaPlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="client_address" className={labelClass}>
                  {t.newInvoiceModal.clientAddress}
                </label>
                <input
                  id="client_address"
                  name="client_address"
                  type="text"
                  placeholder={t.newInvoiceModal.clientAddressPlaceholder}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_contact_name" className={labelClass}>
                    {t.newInvoiceModal.contactName}
                  </label>
                  <input
                    id="client_contact_name"
                    name="client_contact_name"
                    type="text"
                    placeholder={t.newInvoiceModal.contactNamePlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="client_contact_role" className={labelClass}>
                    {t.newInvoiceModal.contactRole}
                  </label>
                  <input
                    id="client_contact_role"
                    name="client_contact_role"
                    type="text"
                    placeholder={t.newInvoiceModal.contactRolePlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex min-w-0 flex-2 flex-col gap-1.5">
                  <label htmlFor="amount" className={labelClass}>
                    {t.newInvoiceModal.amount}
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0,00"
                    className={inputClass}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="currency" className={labelClass}>
                    {t.newInvoiceModal.currency}
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    defaultValue="EUR"
                    className={inputClass}
                  >
                    <option value="EUR">€ EUR</option>
                    <option value="USD">$ USD</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                </div>

                <div className="flex min-w-0 flex-2 flex-col gap-1.5">
                  <label htmlFor="due_date" className={labelClass}>
                    {t.newInvoiceModal.dueDate}
                  </label>
                  <input
                    id="due_date"
                    name="due_date"
                    type="date"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <PaymentFields locale={locale} />

              <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                <Send className="h-4 w-4" />
                {t.newInvoiceModal.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
