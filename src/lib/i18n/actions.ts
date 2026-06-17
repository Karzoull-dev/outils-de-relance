"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLocale, localeCookieName } from "./config";

export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");

  if (typeof locale !== "string" || !isLocale(locale)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
