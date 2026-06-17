import Link from "next/link";
import { signup } from "./actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">{t.signup.title}</h1>

        {error && (
          <p className="mb-4 rounded-md bg-danger-surface p-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form action={signup} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">{t.signup.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">{t.signup.password}</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t.signup.submit}
          </button>
        </form>

        <p className="mt-4 text-xs text-muted">
          En créant un compte, vous acceptez les{" "}
          <Link href="/cgu" className="underline">CGU</Link>{" "}
          et la{" "}
          <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </p>

        <p className="mt-4 text-sm text-muted">
          {t.signup.haveAccount}{" "}
          <Link href="/login" className="underline">
            {t.signup.loginLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
