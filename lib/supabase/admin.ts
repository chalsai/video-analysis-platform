import { createClient } from "@supabase/supabase-js"

// For server-side usage (with service role key)
export const getSupabaseAdmin = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
