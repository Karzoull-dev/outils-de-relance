"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function LanguageSettings({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(locale);

  const options: { value: Locale; label: string }[] = [
    { value: "fr", label: t.settings.french },
    { value: "en", label: t.settings.english },
  ];

  const current = options.find((option) => option.value === locale) ?? options[0];
  const otherOptions = options.filter((option) => option.value !== locale);

  async function selectLocale(value: Locale) {
    setOpen(false);
    const formData = new FormData();
    formData.set("locale", value);
    await setLocale(formData);
  }

  return (
    <div className="max-w-md rounded-xl border border-border bg-surface p-4 shadow-sm flex items-center justify-between">
      <span className="font-semibold">{t.settings.languageLabel}</span>

      <div className="w-32 overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-hover"
        >
          {current.label}
          <ChevronDown
            className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            {otherOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectLocale(option.value)}
                className="block w-full px-3 py-1.5 text-left text-sm text-muted transition-colors hover:bg-surface-hover hover:text-ink"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
