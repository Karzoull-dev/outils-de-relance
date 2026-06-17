"use client";

import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function MessageTextarea({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const t = getDictionary(locale);

  return (
    <textarea
      ref={ref}
      name="message"
      required
      rows={2}
      placeholder={t.conversation.replyPlaceholder}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          ref.current?.form?.requestSubmit();
        }
      }}
      className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
    />
  );
}
