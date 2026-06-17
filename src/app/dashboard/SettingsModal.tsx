"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Settings, Settings2, Accessibility, UserCircle, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ThemeSettings } from "./settings/ThemeSettings";
import { LanguageSettings } from "./settings/LanguageSettings";
import { AccountSettings } from "./settings/AccountSettings";
import { ProfileSettings } from "./settings/ProfileSettings";
import type { UserProfile } from "./settings/profileActions";

type Tab = "account" | "general" | "accessibility";

function AutoOpen({ onOpen }: { onOpen: () => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("openSettings") === "1") {
      onOpen();
      router.replace("/dashboard");
    }
  }, [searchParams, onOpen, router]);

  return null;
}

export function SettingsModal({
  locale,
  profile,
}: {
  locale: Locale;
  profile: UserProfile | null;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Tab>("account");
  const t = getDictionary(locale);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function openToGeneral() {
    setActive("general");
    setOpen(true);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "account",       label: t.settings.tabAccount,       icon: UserCircle    },
    { id: "general",       label: t.settings.tabGeneral,       icon: Settings2     },
    { id: "accessibility", label: t.settings.tabAccessibility, icon: Accessibility },
  ];

  const contentTitle = {
    account:       t.settings.tabAccount,
    general:       t.settings.tabGeneral,
    accessibility: t.settings.tabAccessibility,
  }[active];

  const contentSubtitle = {
    account:       t.settings.accountSubtitle,
    general:       t.settings.generalSubtitle,
    accessibility: t.settings.accessibilitySubtitle,
  }[active];

  const modal = open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 flex h-[85vh] max-h-130 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-modal-in sm:h-130 sm:flex-row">

        {/* ── Settings sidebar ── */}
        <div className="flex shrink-0 flex-col border-b border-border sm:w-52 sm:border-r sm:border-b-0">
          <div className="hidden border-b border-border px-4 py-4 sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t.settings.modalTitle}
            </p>
          </div>

          <nav className="flex gap-0.5 overflow-x-auto p-2 sm:flex-1 sm:flex-col sm:overflow-x-visible">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors sm:w-full ${
                  active === id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:bg-surface-hover hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Version */}
          <div className="hidden border-t border-border px-4 py-3 sm:block">
            <p className="text-[11px] text-muted/50">v0.1.0</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Content header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold">{contentTitle}</h2>
              <p className="text-xs text-muted">{contentSubtitle}</p>
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

          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {active === "account" && (
              <AccountSettings locale={locale} />
            )}

            {active === "general" && (
              <ProfileSettings locale={locale} defaultProfile={profile} />
            )}

            {active === "accessibility" && (
              <div className="flex flex-col gap-4">
                <ThemeSettings locale={locale} />
                <LanguageSettings locale={locale} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Suspense fallback={null}>
        <AutoOpen onOpen={openToGeneral} />
      </Suspense>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-ink"
      >
        <Settings className="h-4 w-4" />
        {t.nav.settings}
      </button>

      {typeof window !== "undefined" && modal
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
