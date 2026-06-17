import type { Locale } from "./i18n/config";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// "2026-06-14" -> "14/06/2026" (sans passer par Date, pour éviter les décalages de fuseau horaire)
export function formatDateOnly(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatTime(date: Date, locale: Locale): string {
  return locale === "en"
    ? `${pad(date.getHours())}:${pad(date.getMinutes())}`
    : `${pad(date.getHours())}h${pad(date.getMinutes())}`;
}

function formatDateNumeric(date: Date): string {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatDateTimeFR(date: Date): string {
  return `${formatDateNumeric(date)} à ${formatTime(date, "fr")}`;
}

const WEEKDAYS: Record<Locale, string[]> = {
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

// Horodatage relatif pour les bulles de message
export function formatRelativeTimestamp(iso: string, locale: Locale = "fr"): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 60) {
    const minutes = Math.max(1, diffMinutes);
    return locale === "en"
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      : `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86400000,
  );
  const time = formatTime(date, locale);

  if (dayDiff === 0) return locale === "en" ? `today at ${time}` : `aujourd'hui à ${time}`;
  if (dayDiff === 1) return locale === "en" ? `yesterday at ${time}` : `hier à ${time}`;
  if (dayDiff > 1 && dayDiff < 7) {
    const weekday = WEEKDAYS[locale][date.getDay()];
    return locale === "en" ? `${weekday} at ${time}` : `${weekday} à ${time}`;
  }

  return locale === "en"
    ? `${formatDateNumeric(date)} at ${time}`
    : `${formatDateNumeric(date)} à ${time}`;
}
