export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** false = belum ada env Supabase; website jalan pakai data statis di src/data. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
