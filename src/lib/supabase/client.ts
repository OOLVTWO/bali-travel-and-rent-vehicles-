import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabaseKey, supabaseUrl } from "./env";

/** Client di browser (pakai sesi admin dari cookie). Dipakai buat upload foto ke Storage. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
