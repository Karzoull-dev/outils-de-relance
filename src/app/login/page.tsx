import Link from "next/link";
import { login } from "./actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold">{t.login.title}</h1>

        {message && (
          <p className="mb-4 rounded-md bg-info-surface p-2 text-sm text-info">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-md bg-danger-surface p-2 text-sm text-danger">
            {error}
          </p>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email">{t.login.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password">{t.login.password}</label>
              <Link href="/forgot-password" className="text-xs text-muted underline">
                {t.login.forgotPasswordLink}
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t.login.submit}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted">
          {t.login.noAccount}{" "}
          <Link href="/signup" className="underline">
            {t.login.signupLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
