import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kxzolskpgvbrosaibmqr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4em9sc2twZ3Zicm9zYWlibXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTIxMzIsImV4cCI6MjA5Mjg4ODEzMn0.j35-d0WHuyLOvpCIvsGC7lSEejge4Epi37D9QBs_r60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
