import { createClient } from "@supabase/supabase-js";

// Reemplaza con tus credenciales
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SECRET_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
