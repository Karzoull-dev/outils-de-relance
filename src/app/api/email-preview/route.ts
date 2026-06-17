import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getReminderEmail } from "@/lib/email-templates";
import type { ReminderType } from "@/lib/reminders";

const VALID_TYPES: ReminderType[] = ["J-3", "J0", "J+7", "J+14", "J+30"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  // "+" devient un espace une fois décodé depuis la query string (ex: "J+7" -> "J 7")
  const rawType = (searchParams.get("type") ?? "J0").replace(/ /g, "+");
  const reminderType = VALID_TYPES.includes(rawType as ReminderType)
    ? (rawType as ReminderType)
    : "J0";

  if (!token) {
    return NextResponse.json({ error: "Missing ?token=<public_token>" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("public_token", token)
    .maybeSingle();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const { data: ownerProfile } = await supabase
    .from("user_profiles")
    .select("display_name")
    .eq("id", invoice.user_id)
    .maybeSingle();

  const ownerName = ownerProfile?.display_name || "Votre prestataire";
  const publicUrl = `${origin}/f/${invoice.public_token}`;

  const { html } = getReminderEmail({
    invoice,
    ownerName,
    reminderType,
    publicUrl,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
