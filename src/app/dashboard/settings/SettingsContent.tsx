"use client";

import { useState } from "react";
import { User, Settings2, Accessibility } from "lucide-react";
import { ThemeSettings } from "./ThemeSettings";
import { LanguageSettings } from "./LanguageSettings";
import { AccountSettings } from "./AccountSettings";
import { ProfileSettings } from "./ProfileSettings";
import type { UserProfile } from "./profileActions";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Tab = "account" | "general" | "accessibility";

export function SettingsContent({ locale, profile }: { locale: Locale; profile: UserProfile | null }) {
  const t = getDictionary(locale);
  const [active, setActive] = useState<Tab>("account");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "account", label: t.settings.tabAccount, icon: User },
    { id: "general", label: t.settings.tabGeneral, icon: Settings2 },
    { id: "accessibility", label: t.settings.tabAccessibility, icon: Accessibility },
  ];

  return (
    <div className="flex h-full min-h-120 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm sm:flex-row">

      {/* ── Settings sidebar ── */}
      <div className="flex shrink-0 flex-col border-b border-border sm:w-52 sm:border-r sm:border-b-0">
        <div className="hidden border-b border-border px-4 py-4 sm:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t.settings.modalTitle}
          </p>
        </div>

        <nav className="flex gap-0.5 overflow-x-auto p-2 sm:flex-1 sm:flex-col sm:overflow-x-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors sm:w-full ${
                  active === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:bg-surface-hover hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Version */}
        <div className="hidden border-t border-border px-4 py-3 sm:block">
          <p className="text-[11px] text-muted/50">v0.1.0</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        {active === "account" && (
          <div>
            <h2 className="text-base font-semibold">{t.settings.tabAccount}</h2>
            <div className="mt-6">
              <AccountSettings locale={locale} />
            </div>
          </div>
        )}

        {active === "general" && (
          <div>
            <h2 className="text-base font-semibold">{t.settings.tabGeneral}</h2>
            <p className="mt-1 text-sm text-muted">{t.settings.generalSubtitle}</p>
            <div className="mt-6">
              <ProfileSettings locale={locale} defaultProfile={profile} />
            </div>
          </div>
        )}

        {active === "accessibility" && (
          <div>
            <h2 className="text-base font-semibold">{t.settings.tabAccessibility}</h2>
            <p className="mt-1 text-sm text-muted">{t.settings.accessibilitySubtitle}</p>
            <div className="mt-6 flex flex-col gap-4">
              <ThemeSettings locale={locale} />
              <LanguageSettings locale={locale} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
