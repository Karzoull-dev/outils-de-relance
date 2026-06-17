"use client";

import { useState, useTransition } from "react";
import { StickyNote } from "lucide-react";
import { updateInvoiceNote } from "../actions";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type SaveState = "idle" | "saving" | "saved";

export function InvoiceNote({
  invoiceId,
  defaultNote,
  locale,
}: {
  invoiceId: string;
  defaultNote: string | null;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const [note, setNote] = useState(defaultNote ?? "");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (note === (defaultNote ?? "")) return;

    setSaveState("saving");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", invoiceId);
      formData.set("notes", note);
      await updateInvoiceNote(formData);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <StickyNote className="h-3.5 w-3.5" />
          {t.invoiceDetail.notesTitle}
        </h2>

        <span
          className={`text-xs transition-opacity duration-300 ${
            saveState === "idle" ? "opacity-0" : "opacity-100"
          } ${saveState === "saved" ? "text-success" : "text-muted"}`}
        >
          {isPending || saveState === "saving"
            ? t.invoiceDetail.notesSaving
            : t.invoiceDetail.notesSaved}
        </span>
      </div>

      <textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaveState("idle");
        }}
        onBlur={handleBlur}
        placeholder={t.invoiceDetail.notesPlaceholder}
        rows={5}
        className="w-full resize-none rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
