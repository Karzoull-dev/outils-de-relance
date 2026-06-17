"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Zap,
  LogOut,
} from "lucide-react";
import { logout } from "@/app/auth/actions";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SettingsModal } from "./SettingsModal";
import { useMobileNav } from "./MobileNavContext";
import type { UserProfile } from "./settings/profileActions";

export function Sidebar({
  unreadCount,
  userEmail,
  locale,
  profile,
}: {
  unreadCount: number;
  userEmail: string;
  locale: Locale;
  profile: UserProfile | null;
}) {
  const pathname = usePathname();
  const { open, setOpen } = useMobileNav();
  const t = getDictionary(locale);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/dashboard/invoices", label: t.nav.invoices, icon: FileText },
    { href: "/dashboard/messages", label: t.nav.messages, icon: MessageSquare },
    { href: "/dashboard/stats", label: t.nav.stats, icon: BarChart3 },
  ];

  return (
    <>
      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-40 flex w-55 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Zap className="h-4 w-4" />
        </span>
        <span className="font-bold">{t.common.appName}</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:bg-surface-hover hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.href === "/dashboard/messages" && unreadCount > 0 && (
                <span className="absolute right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
        <SettingsModal locale={locale} profile={profile} />
      </div>

      <div className="border-t border-border py-4">
        <div className="flex items-center gap-2 px-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
            {userEmail.slice(0, 2).toUpperCase()}
          </span>
          <p className="truncate text-sm">{userEmail}</p>
        </div>
        <form action={logout} className="mt-3 px-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg border border-danger py-2 text-xs font-medium text-danger transition-colors hover:bg-danger-surface"
          >
            <LogOut className="h-4 w-4" />
            {t.nav.logout}
          </button>
        </form>
      </div>
      </nav>
    </>
  );
}
