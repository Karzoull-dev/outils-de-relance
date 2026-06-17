"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function getAccountInfo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email ?? "",
    displayName: profile?.display_name ?? "",
  };
}

export async function updateDisplayName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const display_name = (formData.get("display_name") as string).trim();
  if (!display_name) return { error: "Le nom ne peut pas être vide" };

  await supabase.from("user_profiles").upsert({
    id: user.id,
    display_name,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim();
  if (!email) return { error: "Email invalide" };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };
  return { success: true };
}

export async function sendPasswordReset() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Non connecté" };

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password.length < 8) return { error: "Minimum 8 caractères" };
  if (password !== confirm) return { error: "Les mots de passe ne correspondent pas" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );

  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  redirect("/login");
}
