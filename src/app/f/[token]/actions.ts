"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function sendMessage(formData: FormData) {
  const token = formData.get("token") as string;
  const message = formData.get("message") as string;

  const supabase = createAdminClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id")
    .eq("public_token", token)
    .maybeSingle();

  if (!invoice) {
    redirect(`/f/${token}`);
  }

  await supabase.from("invoice_messages").insert({
    invoice_id: invoice.id,
    message,
    sender: "client",
  });

  redirect(`/f/${token}?sent=1`);
}
