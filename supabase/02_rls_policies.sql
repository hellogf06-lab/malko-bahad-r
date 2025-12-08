-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =====================================================
-- KRİTİK: Her avukat sadece kendi verilerini görebilir!
-- Frontend hacklense bile veritabanı seviyesinde koruma
-- =====================================================

-- 1. RLS'yi Aktifleştir
ALTER TABLE public.dosyalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takip_masraflari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kurum_dosyalari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kurum_masraflari ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giderler ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- DOSYALAR POLİTİKALARI
-- =====================================================

-- SELECT: Kullanıcı sadece kendi dosyalarını görebilir
CREATE POLICY "Users can view own dosyalar"
    ON public.dosyalar
    FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: Kullanıcı sadece kendi adına dosya ekleyebilir
CREATE POLICY "Users can insert own dosyalar"
    ON public.dosyalar
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Kullanıcı sadece kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update own dosyalar"
    ON public.dosyalar
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Kullanıcı sadece kendi dosyalarını silebilir
CREATE POLICY "Users can delete own dosyalar"
    ON public.dosyalar
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- TAKİP MASRAFLARI POLİTİKALARI
-- =====================================================

CREATE POLICY "Users can view own takip_masraflari"
    ON public.takip_masraflari
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own takip_masraflari"
    ON public.takip_masraflari
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own takip_masraflari"
    ON public.takip_masraflari
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own takip_masraflari"
    ON public.takip_masraflari
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- KURUM DOSYALARI POLİTİKALARI
-- =====================================================

CREATE POLICY "Users can view own kurum_dosyalari"
    ON public.kurum_dosyalari
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kurum_dosyalari"
    ON public.kurum_dosyalari
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kurum_dosyalari"
    ON public.kurum_dosyalari
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own kurum_dosyalari"
    ON public.kurum_dosyalari
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- KURUM MASRAFLARI POLİTİKALARI
-- =====================================================

CREATE POLICY "Users can view own kurum_masraflari"
    ON public.kurum_masraflari
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kurum_masraflari"
    ON public.kurum_masraflari
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kurum_masraflari"
    ON public.kurum_masraflari
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own kurum_masraflari"
    ON public.kurum_masraflari
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- GİDERLER POLİTİKALARI
-- =====================================================

CREATE POLICY "Users can view own giderler"
    ON public.giderler
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own giderler"
    ON public.giderler
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own giderler"
    ON public.giderler
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own giderler"
    ON public.giderler
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- VERİFY RLS
-- =====================================================
-- Bu query'ler ile RLS aktif mi kontrol edebilirsiniz:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
