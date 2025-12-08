-- =====================================================
-- EKSİK SÜTUNLAR MİGRATION
-- =====================================================
-- Sanity Check'te tespit edilen eksik sütunları ekler
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- =====================================================

-- 1. DOSYALAR TABLOSUNA EKSİK SÜTUNLAR
ALTER TABLE public.dosyalar 
ADD COLUMN IF NOT EXISTS durusma_tarihi TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS karsi_taraf VARCHAR(255),
ADD COLUMN IF NOT EXISTS mahkeme VARCHAR(255),
ADD COLUMN IF NOT EXISTS dava_turu VARCHAR(50),
ADD COLUMN IF NOT EXISTS durum VARCHAR(20) DEFAULT 'acik';

-- 2. GİDERLER TABLOSUNA FİŞ UPLOAD SÜTUNU
ALTER TABLE public.giderler 
ADD COLUMN IF NOT EXISTS fis_url TEXT;

-- 3. İNDEKSLER (Performans için)
CREATE INDEX IF NOT EXISTS idx_dosyalar_durusma_tarihi ON public.dosyalar(durusma_tarihi);
CREATE INDEX IF NOT EXISTS idx_dosyalar_durum ON public.dosyalar(durum);
CREATE INDEX IF NOT EXISTS idx_giderler_fis_url ON public.giderler(fis_url) WHERE fis_url IS NOT NULL;

-- 4. YORUM EKLE
COMMENT ON COLUMN public.dosyalar.durusma_tarihi IS 'Duruşma/Celse tarihi - Takvimde gösterilir';
COMMENT ON COLUMN public.dosyalar.karsi_taraf IS 'Davalı/Davacı karşı taraf adı';
COMMENT ON COLUMN public.dosyalar.mahkeme IS 'Mahkeme veya İcra Dairesi adı';
COMMENT ON COLUMN public.dosyalar.dava_turu IS 'ceza, hukuk, is, aile, icra, danismanlik';
COMMENT ON COLUMN public.dosyalar.durum IS 'Dosya durumu: acik, kapali';
COMMENT ON COLUMN public.giderler.fis_url IS 'Supabase Storage URL - Yüklenen fiş belgesi';
