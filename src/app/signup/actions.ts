"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Si la confirmation par email est activée côté Supabase, aucune session
  // n'est créée immédiatement : on prévient l'utilisateur sur la page de connexion.
  if (!data.session) {
    const locale = await getLocale();
    const t = getDictionary(locale);
    redirect(`/login?message=${encodeURIComponent(t.signup.confirmEmailMessage)}`);
  }

  redirect("/dashboard");
}
