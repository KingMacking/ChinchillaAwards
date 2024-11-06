import { createClient } from "@supabase/supabase-js";

// Reemplaza con tus credenciales
const supabaseUrl = "https://<YOUR_SUPABASE_PROJECT>.supabase.co";
const supabaseKey = "<YOUR_SUPABASE_ANON_KEY>";

export const supabase = createClient(supabaseUrl, supabaseKey);
