import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// On garde l'export par défaut
export default customSupabaseClient;

// On garde les exports nommés pour que le reste de l'application fonctionne
export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};