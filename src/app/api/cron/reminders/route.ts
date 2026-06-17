import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDueReminderType } from "@/lib/reminders";
import { getReminderEmail } from "@/lib/email-templates";
import { formatDateTimeFR } from "@/lib/datetime";
import { resend } from "@/lib/resend";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .is("paid_at", null);

  const sent: { invoice_id: string; reminder_type: string }[] = [];
  const failed: { invoice_id: string; reminder_type: string; error: string }[] = [];

  for (const invoice of invoices ?? []) {
    const reminderType = getDueReminderType(invoice.due_date, today);
    if (!reminderType) continue;

    const { data: existing } = await supabase
      .from("reminder_logs")
      .select("id")
      .eq("invoice_id", invoice.id)
      .eq("reminder_type", reminderType)
      .maybeSingle();

    if (existing) continue;

    const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/f/${invoice.public_token}`;

    const [{ data: owner }, { data: ownerProfile }] = await Promise.all([
      supabase.auth.admin.getUserById(invoice.user_id),
      supabase
        .from("user_profiles")
        .select("display_name")
        .eq("id", invoice.user_id)
        .maybeSingle(),
    ]);

    const ownerName = ownerProfile?.display_name || "Votre prestataire";

    const { subject, html, text } = getReminderEmail({
      invoice,
      ownerName,
      reminderType,
      publicUrl,
    });

    const { error: sendError } = await resend.emails.send({
      from: "Outils de relance <onboarding@resend.dev>",
      to: invoice.client_email,
      replyTo: owner.user?.email,
      subject,
      html,
      text,
    });

    if (sendError) {
      failed.push({
        invoice_id: invoice.id,
        reminder_type: reminderType,
        error: sendError.message,
      });
      continue;
    }

    await supabase.from("reminder_logs").insert({
      invoice_id: invoice.id,
      reminder_type: reminderType,
    });

    await supabase.from("invoice_messages").insert({
      invoice_id: invoice.id,
      message: `📧 Relance automatique envoyée · ${reminderType} · ${formatDateTimeFR(new Date())}`,
      sender: "system",
    });

    sent.push({ invoice_id: invoice.id, reminder_type: reminderType });
  }

  return NextResponse.json({ sent: sent.length, details: sent, failed });
}
