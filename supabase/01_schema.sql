-- =====================================================
-- HUKUK BÜRO TAKİP SİSTEMİ - SUPABASE VERİTABANI ŞEMASI
-- =====================================================
-- Bu SQL scriptini Supabase Dashboard > SQL Editor'da çalıştırın
-- =====================================================

-- 1. DOSYALAR TABLOSU (Serbest Müvekkil Dosyaları)
CREATE TABLE IF NOT EXISTS public.dosyalar (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dosya_no VARCHAR(100) NOT NULL,
    muvekkil_adi VARCHAR(255) NOT NULL,
    tahsil_edilen DECIMAL(15, 2) DEFAULT 0,
    tahsil_edilecek DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TAKİP MASRAFLARI TABLOSU (Serbest Dosya Masrafları)
CREATE TABLE IF NOT EXISTS public.takip_masraflari (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dosya_id BIGINT NOT NULL REFERENCES public.dosyalar(id) ON DELETE CASCADE,
    masraf_turu VARCHAR(100) NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    tarih DATE NOT NULL,
    odendi BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. KURUM DOSYALARI TABLOSU (Kurumsal Hakedişler)
CREATE TABLE IF NOT EXISTS public.kurum_dosyalari (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kurum_adi VARCHAR(255) NOT NULL,
    dosya_no VARCHAR(100) NOT NULL,
    tahsil_tutar DECIMAL(15, 2) NOT NULL,
    vekalet_orani DECIMAL(5, 2) DEFAULT 10,
    net_hakedis DECIMAL(15, 2) GENERATED ALWAYS AS (tahsil_tutar * vekalet_orani / 100) STORED,
    odendi BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. KURUM MASRAFLARI TABLOSU
CREATE TABLE IF NOT EXISTS public.kurum_masraflari (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    aciklama VARCHAR(255) NOT NULL,
    masraf_turu VARCHAR(100) NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    tarih DATE NOT NULL,
    odendi BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GİDERLER TABLOSU (Ofis Giderleri)
CREATE TABLE IF NOT EXISTS public.giderler (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kategori VARCHAR(100) NOT NULL,
    aciklama VARCHAR(255) NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    tarih DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER update_dosyalar_updated_at
    BEFORE UPDATE ON public.dosyalar
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_takip_masraflari_updated_at
    BEFORE UPDATE ON public.takip_masraflari
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_kurum_dosyalari_updated_at
    BEFORE UPDATE ON public.kurum_dosyalari
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_kurum_masraflari_updated_at
    BEFORE UPDATE ON public.kurum_masraflari
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_giderler_updated_at
    BEFORE UPDATE ON public.giderler
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- INDEXES (Performans İçin)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_dosyalar_user_id ON public.dosyalar(user_id);
CREATE INDEX IF NOT EXISTS idx_takip_masraflari_user_id ON public.takip_masraflari(user_id);
CREATE INDEX IF NOT EXISTS idx_takip_masraflari_dosya_id ON public.takip_masraflari(dosya_id);
CREATE INDEX IF NOT EXISTS idx_kurum_dosyalari_user_id ON public.kurum_dosyalari(user_id);
CREATE INDEX IF NOT EXISTS idx_kurum_masraflari_user_id ON public.kurum_masraflari(user_id);
CREATE INDEX IF NOT EXISTS idx_giderler_user_id ON public.giderler(user_id);
