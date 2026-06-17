import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase pour Server Components / Server Actions / Route Handlers.
// Respecte les policies RLS car il utilise la session de l'utilisateur connecté.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component : peut être ignoré
            // car le middleware s'occupe de rafraîchir la session.
          }
        },
      },
    },
  );
}
