import { supabase } from '../lib/supabase';
import type { 
  AllDataResponse, 
  Dosya, 
  TakipMasrafi, 
  KurumDosyasi, 
  KurumMasrafi, 
  Gider 
} from '../types';

// Helper: Get current user ID
const getUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Kullanıcı oturumu bulunamadı');
  return user.id;
};

// ============================================
// FETCH ALL DATA
// ============================================
export const fetchAllData = async (): Promise<AllDataResponse> => {
  const userId = await getUserId();

  const [dosyalarRes, takipRes, kurumDosyalariRes, kurumMasraflariRes, giderlerRes] = await Promise.all([
    supabase.from('dosyalar').select('*').eq('user_id', userId),
    supabase.from('takip_masraflari').select('*').eq('user_id', userId),
    supabase.from('kurum_hakedisleri').select('*').eq('user_id', userId),
    supabase.from('kurum_masraflari').select('*').eq('user_id', userId),
    supabase.from('giderler').select('*').eq('user_id', userId),
  ]);

  if (dosyalarRes.error) throw dosyalarRes.error;
  if (takipRes.error) throw takipRes.error;
  if (kurumDosyalariRes.error) throw kurumDosyalariRes.error;
  if (kurumMasraflariRes.error) throw kurumMasraflariRes.error;
  if (giderlerRes.error) throw giderlerRes.error;

  return {
    dosyalar: dosyalarRes.data || [],
    takipMasraflari: takipRes.data || [],
    kurumDosyalari: kurumDosyalariRes.data || [],
    kurumMasraflari: kurumMasraflariRes.data || [],
    giderler: giderlerRes.data || [],
  };
};

// ============================================
// DOSYALAR
// ============================================
export const fetchDosyalar = async (): Promise<Dosya[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('dosyalar')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addDosya = async (dosya: Omit<Dosya, 'id' | 'created_at' | 'updated_at'>): Promise<Dosya> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('dosyalar')
    .insert([{ ...dosya, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDosya = async (id: number, updates: Partial<Dosya>): Promise<Dosya> => {
  const { data, error } = await supabase
    .from('dosyalar')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteDosya = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('dosyalar')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============================================
// TAKİP MASRAFLARI
// ============================================
export const fetchTakipMasraflari = async (): Promise<TakipMasrafi[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('takip_masraflari')
    .select('*')
    .eq('user_id', userId)
    .order('tarih', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addTakipMasrafi = async (masraf: Omit<TakipMasrafi, 'id' | 'created_at' | 'updated_at'>): Promise<TakipMasrafi> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('takip_masraflari')
    .insert([{ ...masraf, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTakipMasrafi = async (id: number, updates: Partial<TakipMasrafi>): Promise<TakipMasrafi> => {
  const { data, error } = await supabase
    .from('takip_masraflari')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTakipMasrafi = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('takip_masraflari')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleTakipMasrafiPaid = async (id: number, odendi: boolean): Promise<TakipMasrafi> => {
  return updateTakipMasrafi(id, { odendi });
};

// ============================================
// KURUM DOSYALARI
// ============================================
export const fetchKurumHakedisleri = async (): Promise<KurumDosyasi[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('kurum_hakedisleri')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addKurumHakedisi = async (dosya: Omit<KurumDosyasi, 'id' | 'net_hakedis' | 'created_at' | 'updated_at'>): Promise<KurumDosyasi> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('kurum_hakedisleri')
    .insert([{ ...dosya, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateKurumHakedisi = async (id: number, updates: Partial<KurumDosyasi>): Promise<KurumDosyasi> => {
  const { data, error } = await supabase
    .from('kurum_hakedisleri')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteKurumHakedisi = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('kurum_hakedisleri')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleKurumHakedisiPaid = async (id: number, odendi: boolean): Promise<KurumDosyasi> => {
  return updateKurumHakedisi(id, { odendi });
};

// ============================================
// KURUM MASRAFLARI
// ============================================
export const fetchKurumMasraflari = async (): Promise<KurumMasrafi[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('kurum_masraflari')
    .select('*')
    .eq('user_id', userId)
    .order('tarih', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addKurumMasrafi = async (masraf: Omit<KurumMasrafi, 'id' | 'created_at' | 'updated_at'>): Promise<KurumMasrafi> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('kurum_masraflari')
    .insert([{ ...masraf, user_id: userId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateKurumMasrafi = async (id: number, updates: Partial<KurumMasrafi>): Promise<KurumMasrafi> => {
  const { data, error } = await supabase
    .from('kurum_masraflari')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteKurumMasrafi = async (id: number): Promise<void> => {
  const userId = await getUserId();
  const { error } = await supabase
    .from('kurum_masraflari')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
};

export const toggleKurumMasrafiPaid = async (id: number, odendi: boolean): Promise<KurumMasrafi> => {
  return updateKurumMasrafi(id, { odendi });
};

// ============================================
// GİDERLER
// ============================================
export const fetchGiderler = async (): Promise<Gider[]> => {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('giderler')
    .select('*')
    .eq('user_id', userId)
    .order('tarih', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addGider = async (gider: Omit<Gider, 'id' | 'created_at' | 'updated_at'>): Promise<Gider> => {
  const userId = await getUserId();
  // user_id varsa çıkar
  const { user_id, ...giderWithoutUserId } = gider;
  const insertObj = { user_id: userId, ...giderWithoutUserId };
  console.log('Supabase insert objesi:', insertObj);
  const { data, error } = await supabase
    .from('giderler')
    .insert([insertObj])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateGider = async (id: number, updates: Partial<Gider>): Promise<Gider> => {
  const { data, error } = await supabase
    .from('giderler')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteGider = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('giderler')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
