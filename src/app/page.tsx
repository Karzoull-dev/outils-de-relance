import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">{t.common.appName}</h1>
      <p className="text-muted">{t.home.tagline}</p>

      {data.user ? (
        <Link
          href="/dashboard"
          className="max-w-50 rounded-lg bg-accent px-4 py-2 text-center font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          {t.home.goToDashboard}
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="max-w-50 rounded-lg border border-border bg-surface px-4 py-2 text-center font-medium transition-colors hover:bg-surface-hover"
          >
            {t.home.login}
          </Link>
          <Link
            href="/signup"
            className="max-w-50 rounded-lg bg-accent px-4 py-2 text-center font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t.home.signup}
          </Link>
        </div>
      )}

      <div className="mt-8 flex gap-4 text-xs text-muted">
        <Link href="/mentions-legales" className="underline">Mentions légales</Link>
        <Link href="/cgu" className="underline">CGU</Link>
        <Link href="/confidentialite" className="underline">Confidentialité</Link>
      </div>
    </div>
  );
}
