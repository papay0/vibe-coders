import { createClient } from '@supabase/supabase-js'

export type UserSettings = {
  id: string
  clerk_user_id: string
  api_mode: 'premium' | 'byok'
  created_at: string
  updated_at: string
}

export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        return await getToken()
      },
    }
  )
}
