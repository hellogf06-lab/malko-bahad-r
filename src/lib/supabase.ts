import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using localStorage fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Supabase bağlantısını test et
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('dosyalar').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase bağlantısı başarılı');
    return true;
  } catch (error) {
    console.error('❌ Supabase bağlantı hatası:', error);
    return false;
  }
};
