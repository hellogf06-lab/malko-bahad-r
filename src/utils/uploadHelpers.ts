import { supabase } from "@/lib/supabase";

/**
 * Fiş/Belge yükleme yardımcı fonksiyonu
 * @param file - Yüklenecek dosya
 * @returns Public URL veya null
 */
export const uploadReceipt = async (file: File): Promise<string | null> => {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `fis_${Date.now()}.${fileExt}`;
  const filePath = `giderler/${fileName}`;

  const { error } = await supabase.storage
    .from('belgeler') // Bucket adı 'belgeler' olmalı
    .upload(filePath, file);

  if (error) {
    throw new Error("Dosya yüklenirken hata oluştu: " + error.message);
  }

  // Yüklenen dosyanın tam adresini (Public URL) alalım
  const { data } = supabase.storage
    .from('belgeler')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
