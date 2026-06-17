import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client Supabase "admin" : utilise la clé secrète et ignore les policies RLS.
// A n'utiliser QUE côté serveur (route handlers, cron) :
// - pour la page publique d'une facture (lecture sans compte utilisateur)
// - pour l'envoi des relances automatiques
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
