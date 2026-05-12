import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL  ?? 'https://zrrtoasbescwvlesrvfk.supabase.co';
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycnRvYXNiZXNjd3ZsZXNydmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDM3OTEsImV4cCI6MjA4OTUxOTc5MX0.VO7Ze6Qq5HPETSZcnmNCr5rOfzUlnGL7RpL2FSGcezo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:            AsyncStorage,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: false,
  },
});
