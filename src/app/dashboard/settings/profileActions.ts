"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UserProfile = {
  display_name: string | null;
  email: string | null;
  address: string | null;
  siret: string | null;
  tva: string | null;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("display_name, email, address, siret, tva")
    .eq("id", user.user.id)
    .maybeSingle();

  return data ?? null;
}

export async function saveUserProfile(profile: UserProfile) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  await supabase.from("user_profiles").upsert({
    id: user.user.id,
    ...profile,
    updated_at: new Date().toISOString(),
  });

  revalidatePath("/dashboard/invoices", "layout");
}
