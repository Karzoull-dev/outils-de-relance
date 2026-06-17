import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const f = t.forgotPassword;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold">{f.title}</h1>
        <p className="mb-6 text-sm text-muted">{f.subtitle}</p>

        {sent === "1" ? (
          <p className="rounded-md bg-info-surface p-3 text-sm text-info">
            {f.success}
          </p>
        ) : (
          <form action={requestPasswordReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email">{f.email}</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-lg border border-border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              {f.submit}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-muted">
          <Link href="/login" className="underline">
            {f.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
}
