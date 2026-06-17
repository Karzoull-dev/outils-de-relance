import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInvoiceStatus, getStatusLabels, formatCurrency } from "@/lib/invoices";
import { formatDateOnly, formatRelativeTimestamp } from "@/lib/datetime";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { replyToMessage } from "../actions";
import { MessageTextarea } from "./MessageTextarea";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const statusLabels = getStatusLabels(locale);

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!invoice) {
    notFound();
  }

  const { data: messages } = await supabase
    .from("invoice_messages")
    .select("*")
    .eq("invoice_id", id)
    .order("created_at", { ascending: true });

  await supabase
    .from("invoice_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("invoice_id", id)
    .eq("sender", "client")
    .is("read_at", null);

  const status = getInvoiceStatus(invoice);
  const { label, className } = statusLabels[status];

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <Link href="/dashboard/messages" className="text-sm underline">
        {t.conversation.back}
      </Link>

      <div className="mt-2 flex min-h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-surface-hover px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-muted" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{invoice.client_name}</p>
            <p className="text-xs text-muted">
              {formatCurrency(invoice.amount, invoice.currency, locale)} · {t.conversation.due}{" "}
              {formatDateOnly(invoice.due_date)}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
            {label}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {!messages?.length ? (
            <p className="text-muted">{t.conversation.none}</p>
          ) : (
            messages.map((m) =>
              m.sender === "system" ? (
                <div key={m.id} className="my-1 flex items-center gap-3 text-xs text-muted">
                  <div className="h-px flex-1 bg-border" />
                  <span>{m.message}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              ) : (
                <div
                  key={m.id}
                  className={`max-w-3/4 rounded-lg border border-border p-2 text-sm ${
                    m.sender === "owner"
                      ? "self-end bg-surface-hover text-ink"
                      : "self-start bg-surface text-ink"
                  }`}
                >
                  <p>{m.message}</p>
                  <p className="mt-1 text-xs text-muted">
                    {formatRelativeTimestamp(m.created_at, locale)}
                  </p>
                </div>
              ),
            )
          )}
        </div>
      </div>

      <form action={replyToMessage} className="mt-4 flex flex-col gap-2">
        <input type="hidden" name="invoice_id" value={invoice.id} />
        <MessageTextarea locale={locale} />
        <button
          type="submit"
          className="self-start rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          {t.conversation.send}
        </button>
      </form>
    </div>
  );
}
