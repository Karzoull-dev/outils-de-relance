import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/getLocale";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNavProvider } from "./MobileNavContext";
import { getUserProfile } from "./settings/profileActions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const [{ count: unreadCount }, locale, profile] = await Promise.all([
    supabase
      .from("invoice_messages")
      .select("id", { count: "exact", head: true })
      .eq("sender", "client")
      .is("read_at", null),
    getLocale(),
    getUserProfile(),
  ]);

  return (
    <MobileNavProvider>
      <div className="flex flex-1">
        <Sidebar
          unreadCount={unreadCount ?? 0}
          userEmail={data.user.email ?? ""}
          locale={locale}
          profile={profile}
        />
        <div className="flex flex-1 flex-col min-w-0">
          <Header locale={locale} />
          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-350">{children}</div>
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
