-- Hukuk/Dava Takip Sistemi Modül Güncellemesi (19.12.2025)
-- 1. Dosyalar tablosu yeni alanlar
ALTER TABLE dosyalar
  ADD COLUMN IF NOT EXISTS mahkeme_adi TEXT,
  ADD COLUMN IF NOT EXISTS esas_no TEXT,
  ADD COLUMN IF NOT EXISTS dosya_durumu TEXT DEFAULT 'Derdest',
  ADD COLUMN IF NOT EXISTS dosya_asamasi TEXT,
  ADD COLUMN IF NOT EXISTS son_degisim_tarihi TIMESTAMP DEFAULT NOW();

-- Dosya durumu değişince son_degisim_tarihi güncellensin
CREATE OR REPLACE FUNCTION update_son_degisim_tarihi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dosya_durumu IS DISTINCT FROM OLD.dosya_durumu THEN
    NEW.son_degisim_tarihi = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_son_degisim_tarihi ON dosyalar;
CREATE TRIGGER trg_update_son_degisim_tarihi
BEFORE UPDATE ON dosyalar
FOR EACH ROW
EXECUTE FUNCTION update_son_degisim_tarihi();

-- 2. Giderler tablosunda update yetkisi (örnek RLS policy, Supabase için)
-- (Kendi RLS politikanıza göre düzenleyin)
-- enable row level security;
-- allow update for owner or admin
--
-- 3. Kurum hakedişi ve masraf girişleri için örnek tablo (varsa atla)
CREATE TABLE IF NOT EXISTS kurum_hakedisleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kurum_adi TEXT NOT NULL,
  dosya_no TEXT,
  tahsil_tutar NUMERIC,
  vekalet_orani NUMERIC,
  net_hakedis NUMERIC,
  odendi BOOLEAN DEFAULT FALSE,
  user_id uuid,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dosyaya bağlı masraf tablosu (varsa atla)
CREATE TABLE IF NOT EXISTS dosya_masraflari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dosya_id uuid NOT NULL,
  masraf_turu TEXT,
  tutar NUMERIC,
  tarih DATE,
  odendi BOOLEAN DEFAULT FALSE,
  notes TEXT,
  user_id uuid,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Validasyonlar ve zorunlu alanlar için NOT NULL ve CHECK eklenebilir.
-- (Uygulama tarafında da kontrol edilecek)
