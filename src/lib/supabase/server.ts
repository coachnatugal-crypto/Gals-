import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta ${name}`);
  return value;
}

/** Cliente público (RLS). Solo lectura de events publicados. */
export function createSupabaseAnon() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/** Cliente servidor (bypass RLS). Registros, pagos, admin. */
export function createSupabaseAdmin(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("PEGA_AQUI") &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("PEGA_AQUI"),
  );
}
