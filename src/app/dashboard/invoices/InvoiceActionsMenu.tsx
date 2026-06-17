"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Pin, PinOff, Trash2 } from "lucide-react";
import { deleteInvoice, setInvoicePinned } from "./actions";
import { EditInvoiceModal } from "./EditInvoiceModal";
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
  payment_method: PaymentMethod | null;
  payment_value: string | null;
  pinned: boolean;
};

export function InvoiceActionsMenu({ invoice, locale }: { invoice: Invoice; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = getDictionary(locale);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ top: rect.bottom + 4, left: rect.right - 176 });
    };

    updatePosition();

    const onClickOutside = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t.invoices.actionsMenuLabel}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 w-44 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-sm animate-fade-in"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEditOpen(true);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover"
            >
              <Pencil className="h-4 w-4" />
              {t.invoices.edit}
            </button>

            <form action={setInvoicePinned} onSubmit={() => setOpen(false)}>
              <input type="hidden" name="id" value={invoice.id} />
              <input type="hidden" name="pinned" value={(!invoice.pinned).toString()} />
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover"
              >
                {invoice.pinned ? (
                  <PinOff className="h-4 w-4" />
                ) : (
                  <Pin className="h-4 w-4" />
                )}
                {invoice.pinned ? t.invoices.unpin : t.invoices.pin}
              </button>
            </form>

            <form action={deleteInvoice} onSubmit={() => setOpen(false)}>
              <input type="hidden" name="id" value={invoice.id} />
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-surface"
              >
                <Trash2 className="h-4 w-4" />
                {t.invoices.delete}
              </button>
            </form>
          </div>,
          document.body,
        )}

      <EditInvoiceModal
        invoice={invoice}
        locale={locale}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
