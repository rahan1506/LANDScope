/**
 * LANDScope Supabase Client Architecture
 *
 * Configures the official Supabase client using public/anon credentials:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Security:
 * - Uses publishable/anon key ONLY (client-safe).
 * - NEVER uses or exposes the service_role key.
 * - Enforces Row-Level Security (RLS) policies defined in Supabase.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns a singleton instance of the Supabase client.
 * Safe for both Client and Server Components in Next.js.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Supabase credentials missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseInstance;
}

/**
 * Direct exported client instance for quick queries
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (null as unknown as SupabaseClient);

/**
 * Returns an authenticated Supabase client scoped with the user's JWT access token.
 * This guarantees Supabase PostgREST evaluates auth.uid() and all RLS policies properly.
 */
export function getAuthenticatedSupabaseClient(accessToken?: string): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (!accessToken) {
    return getSupabaseClient() || supabase;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Health check helper to verify Supabase connectivity
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  authConnected: boolean;
  storageConnected: boolean;
  url: string;
  error?: string;
}> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      connected: false,
      authConnected: false,
      storageConnected: false,
      url: supabaseUrl,
      error: "Missing credentials in environment variables",
    };
  }

  try {
    const client = getSupabaseClient();
    if (!client) {
      return {
        connected: false,
        authConnected: false,
        storageConnected: false,
        url: supabaseUrl,
        error: "Failed to initialize client",
      };
    }

    // 1. Auth connection check
    const { error: authError } = await client.auth.getSession();
    const authOk = !authError;

    // 2. Storage connection check
    const { error: storageError } = await client.storage.listBuckets();
    const storageOk = !storageError;

    return {
      connected: authOk && storageOk,
      authConnected: authOk,
      storageConnected: storageOk,
      url: supabaseUrl,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      authConnected: false,
      storageConnected: false,
      url: supabaseUrl,
      error: msg,
    };
  }
}
