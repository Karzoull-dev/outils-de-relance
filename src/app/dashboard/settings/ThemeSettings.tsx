"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function applyDark(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeSettings({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync initial theme from DOM after hydration to avoid SSR mismatch
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    applyDark(next);
  }

  return (
    <div className="max-w-md rounded-xl border border-border bg-surface p-4 shadow-sm flex items-center justify-between">
      <span className="font-semibold">{t.settings.themeLabel}</span>

      <button
        type="button"
        role="switch"
        aria-checked={isDark ? "true" : "false"}
        onClick={toggle}
        className={`relative inline-flex h-8 w-16 items-center rounded-full border border-border transition-colors ${
          isDark ? "bg-accent" : "bg-canvas"
        }`}
      >
        <span
          className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface shadow transition-transform ${
            isDark ? "translate-x-8" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-ink"
            >
              <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-warning"
            >
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 17a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm19 0a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5.64 5.64a1 1 0 0 1 1.41 0l.71.7a1 1 0 0 1-1.41 1.42l-.71-.71a1 1 0 0 1 0-1.41Zm11.6 11.6a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.7a1 1 0 0 1 0-1.42ZM18.36 5.64a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.41l.7-.71a1 1 0 0 1 1.42 0ZM6.76 16.54a1 1 0 0 1 0 1.42l-.7.7a1 1 0 0 1-1.42-1.41l.71-.71a1 1 0 0 1 1.41 0Z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
