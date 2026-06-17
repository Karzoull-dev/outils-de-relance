import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, getInvoiceStatus } from "@/lib/invoices";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MessagesFilters } from "./MessagesFilters";
import { NewConversationButton } from "./NewConversationButton";

type ConversationMessage = {
  id: string;
  message: string;
  sender: "client" | "owner" | "system";
  created_at: string;
  read_at: string | null;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = getDictionary(locale);

  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      "id, client_name, amount, currency, due_date, paid_at, invoice_messages(id, message, sender, created_at, read_at)",
    );

  const allInvoices = invoices ?? [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: remindersSent } = await supabase
    .from("reminder_logs")
    .select("id", { count: "exact", head: true })
    .gte("sent_at", sevenDaysAgo.toISOString());

  const conversations = allInvoices
    .filter((invoice) => (invoice.invoice_messages ?? []).length > 0)
    .map((invoice) => {
      const messages = (invoice.invoice_messages ?? []) as ConversationMessage[];
      const sorted = [...messages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const lastMessage = sorted[0];
      const unreadCount = messages.filter(
        (m) => m.sender === "client" && !m.read_at,
      ).length;

      return { invoice, lastMessage, unreadCount };
    })
    .sort(
      (a, b) =>
        new Date(b.lastMessage.created_at).getTime() -
        new Date(a.lastMessage.created_at).getTime(),
    );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = conversations.filter(({ invoice, unreadCount }) => {
    if (q && !invoice.client_name.toLowerCase().includes(q.toLowerCase())) {
      return false;
    }
    if (status === "unread" && unreadCount === 0) return false;
    if (status === "late" && getInvoiceStatus(invoice) !== "late") return false;
    if (status === "paid" && getInvoiceStatus(invoice) !== "paid") return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-muted">{t.messages.kpiActiveConversations}</p>
          <p className="mt-1 text-2xl font-bold">{conversations.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-muted">{t.messages.kpiUnread}</p>
          <p className="mt-1 text-2xl font-bold text-danger">{totalUnread}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-muted">{t.messages.kpiReminders}</p>
          <p className="mt-1 text-2xl font-bold">{remindersSent ?? 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MessagesFilters locale={locale} />
        <NewConversationButton
          invoices={allInvoices.map(({ id, client_name, amount, currency }) => ({
            id,
            client_name,
            amount,
            currency,
          }))}
          locale={locale}
        />
      </div>

      {!conversations.length ? (
        <p className="text-muted">{t.messages.none}</p>
      ) : !filtered.length ? (
        <p className="text-muted">{t.messages.noMatch}</p>
      ) : (
        <div className="flex max-w-2xl flex-col gap-2">
          {filtered.map(({ invoice, lastMessage, unreadCount }) => (
            <Link
              key={invoice.id}
              href={`/dashboard/messages/${invoice.id}`}
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 shadow-sm transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{invoice.client_name}</span>
                {unreadCount > 0 && (
                  <span
                    className="h-2 w-2 rounded-full bg-[#3b82f6]"
                    aria-label={t.messages.unreadAriaLabel}
                  />
                )}
              </div>
              <p className="text-xs text-muted">
                {formatCurrency(invoice.amount, invoice.currency, locale)} · {t.messages.due}{" "}
                {invoice.due_date}
              </p>
              <p className="truncate text-sm text-muted">
                {lastMessage.sender === "owner" ? t.messages.youPrefix : ""}
                {lastMessage.message}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
