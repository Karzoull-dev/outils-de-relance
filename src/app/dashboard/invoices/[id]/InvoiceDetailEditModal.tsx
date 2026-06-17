"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Pencil, X } from "lucide-react";
import { PaymentFields } from "@/app/dashboard/invoices/PaymentFields";
import { updateInvoiceDetail } from "@/app/dashboard/invoices/actions";
import type { PaymentMethod } from "@/lib/payment-methods";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Invoice = {
  id: string;
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
  payment_method: string | null;
  payment_value: string | null;
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function InvoiceDetailEditModal({
  invoice,
  locale,
}: {
  invoice: Invoice;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const t = getDictionary(locale);

  const inp =
    "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateInvoiceDetail(fd);
      setOpen(false);
      router.refresh();
    });
  }

  const modal = open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-modal-in">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold">{t.invoiceDetail.editModalTitle}</h2>
            <p className="text-xs text-muted">{t.invoiceDetail.editModalSubtitle}</p>
          </div>
          <button
            type="button"
            aria-label={t.settings.close}
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={invoice.id} />

            <div className="flex flex-col gap-4 p-6">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label={t.newInvoiceModal.clientName} htmlFor="client_name">
                  <input
                    id="client_name"
                    name="client_name"
                    required
                    className={inp}
                    defaultValue={invoice.client_name}
                    placeholder={t.newInvoiceModal.clientNamePlaceholder}
                  />
                </Field>
                <Field label={t.newInvoiceModal.clientEmail} htmlFor="client_email">
                  <input
                    id="client_email"
                    name="client_email"
                    type="email"
                    required
                    className={inp}
                    defaultValue={invoice.client_email}
                    placeholder={t.newInvoiceModal.clientEmailPlaceholder}
                  />
                </Field>
              </div>

              <Field label={t.newInvoiceModal.clientAddress} htmlFor="client_address">
                <input
                  id="client_address"
                  name="client_address"
                  className={inp}
                  defaultValue={invoice.client_address ?? ""}
                  placeholder={t.newInvoiceModal.clientAddressPlaceholder}
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="SIRET" htmlFor="client_siret">
                  <input
                    id="client_siret"
                    name="client_siret"
                    className={inp}
                    defaultValue={invoice.client_siret ?? ""}
                    placeholder={t.newInvoiceModal.clientSiretPlaceholder}
                  />
                </Field>
                <Field label="TVA" htmlFor="client_tva">
                  <input
                    id="client_tva"
                    name="client_tva"
                    className={inp}
                    defaultValue={invoice.client_tva ?? ""}
                    placeholder={t.newInvoiceModal.clientTvaPlaceholder}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Contact" htmlFor="client_contact_name">
                  <input
                    id="client_contact_name"
                    name="client_contact_name"
                    className={inp}
                    defaultValue={invoice.client_contact_name ?? ""}
                    placeholder={t.newInvoiceModal.contactNamePlaceholder}
                  />
                </Field>
                <Field label="Fonction" htmlFor="client_contact_role">
                  <input
                    id="client_contact_role"
                    name="client_contact_role"
                    className={inp}
                    defaultValue={invoice.client_contact_role ?? ""}
                    placeholder={t.newInvoiceModal.contactRolePlaceholder}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label={t.newInvoiceModal.amount} htmlFor="amount">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    className={inp}
                    defaultValue={invoice.amount}
                    placeholder="0.00"
                  />
                </Field>
                <Field label={t.newInvoiceModal.currency} htmlFor="currency">
                  <select id="currency" name="currency" defaultValue={invoice.currency} title={t.newInvoiceModal.currency} className={inp}>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="CHF">CHF</option>
                  </select>
                </Field>
                <Field label={t.newInvoiceModal.dueDate} htmlFor="due_date">
                  <input
                    id="due_date"
                    name="due_date"
                    type="date"
                    required
                    title={t.newInvoiceModal.dueDate}
                    className={inp}
                    defaultValue={invoice.due_date}
                  />
                </Field>
              </div>

              <PaymentFields
                locale={locale}
                defaultMethod={invoice.payment_method as PaymentMethod | null}
                defaultValue={invoice.payment_value ?? ""}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-hover"
              >
                {t.settings.close}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {isPending ? "Enregistrement…" : t.editInvoiceModal.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <Pencil className="h-4 w-4" />
        {t.invoiceDetail.editModalTitle}
      </button>

      {typeof window !== "undefined" && modal
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
