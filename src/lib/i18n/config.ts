export type Locale = "fr" | "en";

export const defaultLocale: Locale = "fr";

export const locales: Locale[] = ["fr", "en"];

export const localeCookieName = "locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "fr" || value === "en";
}
