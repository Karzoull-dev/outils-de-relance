"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useMobileNav } from "./MobileNavContext";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { setOpen } = useMobileNav();
  const t = getDictionary(locale);

  const titles: { pattern: RegExp; label: string }[] = [
    { pattern: /^\/dashboard$/, label: t.nav.dashboard },
    { pattern: /^\/dashboard\/invoices\/new$/, label: t.header.newInvoice },
    { pattern: /^\/dashboard\/invoices\/.+$/, label: t.header.invoiceDetail },
    { pattern: /^\/dashboard\/invoices$/, label: t.nav.invoices },
    { pattern: /^\/dashboard\/messages\/.+$/, label: t.header.conversation },
    { pattern: /^\/dashboard\/messages$/, label: t.nav.messages },
    { pattern: /^\/dashboard\/stats$/, label: t.nav.stats },
  ];

  const title = titles.find((item) => item.pattern.test(pathname))?.label ?? t.nav.dashboard;

  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menu"
        className="-ml-1 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-ink md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
