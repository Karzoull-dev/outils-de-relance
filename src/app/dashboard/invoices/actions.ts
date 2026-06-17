"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/invoices";

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const client_name = formData.get("client_name") as string;
  const client_email = formData.get("client_email") as string;
  const client_siret = (formData.get("client_siret") as string) || null;
  const client_address = (formData.get("client_address") as string) || null;
  const client_tva = (formData.get("client_tva") as string) || null;
  const client_contact_name = (formData.get("client_contact_name") as string) || null;
  const client_contact_role = (formData.get("client_contact_role") as string) || null;
  const amount = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const due_date = formData.get("due_date") as string;
  const paymentEnabled = formData.get("payment_enabled") === "on";
  const payment_method = paymentEnabled
    ? (formData.get("payment_method") as string)
    : null;
  const payment_value = paymentEnabled
    ? (formData.get("payment_value") as string)
    : null;

  const { error } = await supabase.from("invoices").insert({
    user_id: userData.user.id,
    client_name,
    client_email,
    client_siret,
    client_address,
    client_tva,
    client_contact_name,
    client_contact_role,
    amount: Number(amount),
    currency,
    due_date,
    payment_method,
    payment_value,
  });

  if (error) {
    redirect(
      `/dashboard/invoices?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/dashboard/invoices");
}

export async function updateInvoice(formData: FormData) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const id = formData.get("id") as string;
  const client_name = formData.get("client_name") as string;
  const client_email = formData.get("client_email") as string;
  const client_siret = (formData.get("client_siret") as string) || null;
  const client_address = (formData.get("client_address") as string) || null;
  const client_tva = (formData.get("client_tva") as string) || null;
  const client_contact_name = (formData.get("client_contact_name") as string) || null;
  const client_contact_role = (formData.get("client_contact_role") as string) || null;
  const amount = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const due_date = formData.get("due_date") as string;
  const paymentEnabled = formData.get("payment_enabled") === "on";
  const payment_method = paymentEnabled
    ? (formData.get("payment_method") as string)
    : null;
  const payment_value = paymentEnabled
    ? (formData.get("payment_value") as string)
    : null;

  // Fetch current values to build a useful diff description
  const { data: current } = await supabase
    .from("invoices")
    .select("client_name, client_email, amount, currency, due_date")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("invoices")
    .update({
      client_name,
      client_email,
      client_siret,
      client_address,
      client_tva,
      client_contact_name,
      client_contact_role,
      amount: Number(amount),
      currency,
      due_date,
      payment_method,
      payment_value,
    })
    .eq("id", id);

  if (error) {
    redirect(
      `/dashboard/invoices?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Build diff description for the event log
  const changes: string[] = [];
  if (current) {
    if (Number(current.amount) !== Number(amount) || current.currency !== currency) {
      changes.push(
        `Montant : ${formatCurrency(Number(current.amount), current.currency, "fr")} → ${formatCurrency(Number(amount), currency, "fr")}`,
      );
    }
    if (current.due_date !== due_date) {
      changes.push(`Échéance : ${current.due_date} → ${due_date}`);
    }
    if (current.client_name !== client_name) {
      changes.push(`Client : ${current.client_name} → ${client_name}`);
    }
    if (current.client_email !== client_email) {
      changes.push(`Email : ${current.client_email} → ${client_email}`);
    }
  }
  const description = changes.length > 0 ? changes.join(" · ") : "";

  await supabase.from("invoice_events").insert({
    invoice_id: id,
    event_type: "updated",
    description,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard/invoices");
}

export async function setInvoicePinned(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const pinned = formData.get("pinned") === "true";

  await supabase.from("invoices").update({ pinned }).eq("id", id);

  await supabase.from("invoice_events").insert({
    invoice_id: id,
    event_type: pinned ? "pinned" : "unpinned",
    description: "",
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function markInvoiceAsPaid(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase
    .from("invoices")
    .update({ paid_at: new Date().toISOString() })
    .eq("id", id);

  await supabase.from("invoice_events").insert({
    invoice_id: id,
    event_type: "paid",
    description: "",
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}

export async function updateInvoiceNote(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;

  await supabase.from("invoices").update({ notes }).eq("id", id);
  revalidatePath(`/dashboard/invoices/${id}`);
}

export async function updateInvoiceDetail(formData: FormData) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const id = formData.get("id") as string;
  const client_name = formData.get("client_name") as string;
  const client_email = formData.get("client_email") as string;
  const client_siret = (formData.get("client_siret") as string) || null;
  const client_address = (formData.get("client_address") as string) || null;
  const client_tva = (formData.get("client_tva") as string) || null;
  const client_contact_name = (formData.get("client_contact_name") as string) || null;
  const client_contact_role = (formData.get("client_contact_role") as string) || null;
  const amount = formData.get("amount") as string;
  const currency = formData.get("currency") as string;
  const due_date = formData.get("due_date") as string;
  const paymentEnabled = formData.get("payment_enabled") === "on";
  const payment_method = paymentEnabled ? (formData.get("payment_method") as string) : null;
  const payment_value = paymentEnabled ? (formData.get("payment_value") as string) : null;

  const { data: current } = await supabase
    .from("invoices")
    .select("client_name, client_email, amount, currency, due_date")
    .eq("id", id)
    .single();

  await supabase
    .from("invoices")
    .update({ client_name, client_email, client_siret, client_address, client_tva, client_contact_name, client_contact_role, amount: Number(amount), currency, due_date, payment_method, payment_value })
    .eq("id", id);

  const changes: string[] = [];
  if (current) {
    if (Number(current.amount) !== Number(amount) || current.currency !== currency)
      changes.push(`Montant : ${formatCurrency(Number(current.amount), current.currency, "fr")} → ${formatCurrency(Number(amount), currency, "fr")}`);
    if (current.due_date !== due_date) changes.push(`Échéance : ${current.due_date} → ${due_date}`);
    if (current.client_name !== client_name) changes.push(`Client : ${current.client_name} → ${client_name}`);
    if (current.client_email !== client_email) changes.push(`Email : ${current.client_email} → ${client_email}`);
  }

  await supabase.from("invoice_events").insert({ invoice_id: id, event_type: "updated", description: changes.join(" · ") });

  revalidatePath(`/dashboard/invoices/${id}`);
}

export async function deleteInvoice(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  await supabase.from("invoices").delete().eq("id", id);

  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");
}
