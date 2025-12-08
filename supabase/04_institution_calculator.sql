-- =====================================================
-- 🏛️ KURUM HAKEDİŞLERİ: Otomatik Hesaplama Alanları
-- =====================================================
-- Bu migration, kurumDosyalari tablosuna otomatik hesaplama
-- için gerekli alanları ekler.
-- =====================================================

-- 1. Mevcut kurum tablosuna yeni kolonlar ekle
ALTER TABLE public.kurumDosyalari 
ADD COLUMN IF NOT EXISTS tahsil_tutar NUMERIC DEFAULT 0,          -- Kurumdan alınan toplam tutar
ADD COLUMN IF NOT EXISTS vekalet_orani NUMERIC DEFAULT 10,        -- Vekalet ücreti yüzdesi (%)
ADD COLUMN IF NOT EXISTS net_hakedis NUMERIC GENERATED ALWAYS AS (
  (tahsil_tutar * vekalet_orani) / 100
) STORED,                                                          -- Otomatik hesaplanan net hakediş
ADD COLUMN IF NOT EXISTS notes TEXT;                              -- Ödeme notları

-- 2. Dosyalar tablosuna eksik kolonları ekle (FileSheet için)
ALTER TABLE public.dosyalar
ADD COLUMN IF NOT EXISTS karsi_taraf TEXT,                        -- Karşı taraf adı
ADD COLUMN IF NOT EXISTS mahkeme TEXT,                            -- Mahkeme/kurum adı
ADD COLUMN IF NOT EXISTS dava_turu TEXT,                          -- Dava türü (ceza, hukuk, vs)
ADD COLUMN IF NOT EXISTS tahsil_edilecek NUMERIC DEFAULT 0,       -- Anlaşılan ücret
ADD COLUMN IF NOT EXISTS durum TEXT DEFAULT 'acik';               -- Dosya durumu

-- 3. Performans için index'ler ekle
CREATE INDEX IF NOT EXISTS idx_kurum_odendi ON public.kurumDosyalari(odendi);
CREATE INDEX IF NOT EXISTS idx_kurum_kurum_adi ON public.kurumDosyalari(kurum_adi);
CREATE INDEX IF NOT EXISTS idx_dosyalar_dava_turu ON public.dosyalar(dava_turu);
CREATE INDEX IF NOT EXISTS idx_dosyalar_durum ON public.dosyalar(durum);

-- 4. Yorum ekle (dokümantasyon)
COMMENT ON COLUMN public.kurumDosyalari.tahsil_tutar IS 'Kurumdan alınan toplam tahsilat tutarı';
COMMENT ON COLUMN public.kurumDosyalari.vekalet_orani IS 'Vekalet ücreti kesinti oranı (yüzde olarak, örn: 10 = %10)';
COMMENT ON COLUMN public.kurumDosyalari.net_hakedis IS 'Otomatik hesaplanan net hakediş tutarı (tahsil_tutar * vekalet_orani / 100)';
COMMENT ON COLUMN public.dosyalar.karsi_taraf IS 'Dava karşı tarafının adı';
COMMENT ON COLUMN public.dosyalar.mahkeme IS 'Davanın görüldüğü mahkeme veya icra dairesi';
COMMENT ON COLUMN public.dosyalar.dava_turu IS 'Dava türü: ceza, hukuk, is, aile, icra, danismanlik';
