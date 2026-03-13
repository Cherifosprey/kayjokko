import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyjhmzrrsgdmfjarisfc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95amhtenJyc2dkbWZqYXJpc2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzA3OTcsImV4cCI6MjA4MDM0Njc5N30.KymIz72mC-4gJXjbdceWfMSvcrRKLNwqoAJ7XD7OuIw';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
