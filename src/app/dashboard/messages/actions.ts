"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function replyToMessage(formData: FormData) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const invoice_id = formData.get("invoice_id") as string;
  const message = formData.get("message") as string;

  await supabase.from("invoice_messages").insert({
    invoice_id,
    message,
    sender: "owner",
  });

  revalidatePath(`/dashboard/messages/${invoice_id}`);
  revalidatePath("/dashboard/messages");
}
