import { getLocale } from "@/lib/i18n/getLocale";
import { SettingsContent } from "./SettingsContent";
import { getUserProfile } from "./profileActions";

export default async function SettingsPage() {
  const locale = await getLocale();
  const profile = await getUserProfile();
  return <SettingsContent locale={locale} profile={profile} />;
}
