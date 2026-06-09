import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dfuprxqhyvpelekncuzv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdXByeHFoeXZwZWxla25jdXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzc3MDEsImV4cCI6MjA5NjUxMzcwMX0.efXSNm5ljZcFrsK_dELNILJfXuke1uKSVRTtR3OUEtQ";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
