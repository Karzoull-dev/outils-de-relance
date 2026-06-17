"use client";

import { useTransition, useState } from "react";
import { Building2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { saveUserProfile, type UserProfile } from "./profileActions";

export function ProfileSettings({
  locale,
  defaultProfile,
}: {
  locale: Locale;
  defaultProfile: UserProfile | null;
}) {
  const t = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const profile: UserProfile = {
      display_name: (fd.get("display_name") as string) || null,
      email: (fd.get("email") as string) || null,
      address: (fd.get("address") as string) || null,
      siret: (fd.get("siret") as string) || null,
      tva: (fd.get("tva") as string) || null,
    };
    startTransition(async () => {
      await saveUserProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  const field = "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted" />
        <span className="text-sm font-medium">{t.settings.profileTitle}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          name="display_name"
          className={field}
          placeholder={t.settings.profileNamePlaceholder}
          defaultValue={defaultProfile?.display_name ?? ""}
        />
        <input
          name="email"
          type="email"
          className={field}
          placeholder={t.settings.profileEmailPlaceholder}
          defaultValue={defaultProfile?.email ?? ""}
        />
        <input
          name="address"
          className={field}
          placeholder={t.settings.profileAddressPlaceholder}
          defaultValue={defaultProfile?.address ?? ""}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="siret"
            className={field}
            placeholder={t.settings.profileSiretPlaceholder}
            defaultValue={defaultProfile?.siret ?? ""}
          />
          <input
            name="tva"
            className={field}
            placeholder={t.settings.profileTvaPlaceholder}
            defaultValue={defaultProfile?.tva ?? ""}
          />
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isPending ? t.settings.profileSaving : t.settings.profileSave}
          </button>
          <span
            className={`text-xs text-success transition-opacity duration-300 ${saved ? "opacity-100" : "opacity-0"}`}
          >
            {t.settings.profileSaved}
          </span>
        </div>
      </form>
    </div>
  );
}
