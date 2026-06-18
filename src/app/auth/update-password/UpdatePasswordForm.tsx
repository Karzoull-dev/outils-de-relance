"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { updatePassword } from "@/app/dashboard/settings/accountActions";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

export function UpdatePasswordForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const u = t.updatePassword;
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updatePassword(fd);
      if (res.error) {
        setError(res.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <p className="text-lg font-semibold">{u.success}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          {u.backToDashboard}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted">
          {u.newLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder={u.newPlaceholder}
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-xs font-medium uppercase tracking-wider text-muted">
          {u.confirmLabel}
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          placeholder={u.confirmPlaceholder}
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-lg bg-danger-surface/60 px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? u.submitting : u.submit}
      </button>
    </form>
  );
}
