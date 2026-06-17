import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale);
  const u = t.updatePassword;

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{u.title}</h1>
          <p className="text-sm text-muted">{u.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <UpdatePasswordForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
