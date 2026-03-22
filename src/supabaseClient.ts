import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This exports the client so you can use it anywhere in your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)