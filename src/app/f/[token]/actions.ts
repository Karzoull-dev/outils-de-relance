"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import { getNewClientMessageEmail } from "@/lib/email-templates";

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_MESSAGES = 3;
const MAX_MESSAGE_LENGTH = 500;

export async function sendMessage(formData: FormData) {
  const token = formData.get("token") as string;
  const message = (formData.get("message") as string)?.trim();
  const honeypot = formData.get("website") as string;

  // Champ honeypot rempli => bot. On fait comme si le message était envoyé
  // pour ne pas l'aider à détecter le piège.
  if (honeypot) {
    redirect(`/f/${token}?sent=1`);
  }

  if (!message || message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    redirect(`/f/${token}`);
  }

  const supabase = createAdminClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, user_id, client_name, created_at, number")
    .eq("public_token", token)
    .maybeSingle();

  if (!invoice) {
    redirect(`/f/${token}`);
  }

  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  ).toISOString();

  const { count } = await supabase
    .from("invoice_messages")
    .select("id", { count: "exact", head: true })
    .eq("invoice_id", invoice.id)
    .eq("sender", "client")
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMIT_MAX_MESSAGES) {
    redirect(`/f/${token}?error=rate_limit`);
  }

  await supabase.from("invoice_messages").insert({
    invoice_id: invoice.id,
    message,
    sender: "client",
  });

  const { data: owner } = await supabase.auth.admin.getUserById(invoice.user_id);
  if (owner.user?.email) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/messages/${invoice.id}`;
    const { subject, html, text } = getNewClientMessageEmail({
      invoice,
      message,
      dashboardUrl,
    });

    await resend.emails.send({
      from: "Outils de relance <onboarding@resend.dev>",
      to: owner.user.email,
      subject,
      html,
      text,
    });
  }

  redirect(`/f/${token}?sent=1`);
}
