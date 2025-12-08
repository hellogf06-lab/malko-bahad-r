# Rol Yönetimi Sistemi

## 📋 Genel Bakış

Sistemde iki farklı kullanıcı rolü bulunmaktadır:
- **Admin (Yönetici)**: Ofis sahibi - Tüm finansal verilere erişim
- **User (Personel)**: Çalışanlar - Sınırlı erişim

## 🗄️ Veritabanı Yapısı

### Profiles Tablosu
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'user')),
  full_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## 🔧 Kurulum Adımları

### 1. SQL Script'i Çalıştırın

Supabase Dashboard → SQL Editor → Yeni Query:

```bash
# Dosya: supabase/03_profiles_roles.sql
```

Bu script:
- ✅ `profiles` tablosunu oluşturur
- ✅ RLS (Row Level Security) politikalarını ekler
- ✅ Yeni kullanıcı kaydında otomatik profil oluşturur (trigger)
- ✅ Mevcut kullanıcılar için profil oluşturur
- ✅ İlk kullanıcıyı admin yapar

### 2. Rolleri Yönetin

#### Kullanıcıyı Admin Yapmak

Supabase Dashboard → Table Editor → profiles:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE user_id = 'KULLANICI_UUID';
```

#### Kullanıcı UUID'sini Bulmak

```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at;
```

## 👥 Rol Özellikleri

### Admin (Yönetici) Görür:
- ✅ Tüm finansal KPI'lar (Gelir, Gider, Kar/Zarar)
- ✅ Tahsil edilecek tutarlar
- ✅ Kurum avukatlığı özeti
- ✅ Detaylı raporlar
- ✅ Tüm grafikler ve analizler
- ✅ Dosyalar ve masraflar (tüm işlemler)

### User (Personel) Görür:
- ✅ Basit hoş geldiniz mesajı
- ✅ Toplam dosya sayısı
- ✅ Aktif işlem sayısı
- ✅ Dosyalar sekmesi (CRUD işlemleri yapabilir)
- ✅ Masraflar sekmesi (CRUD işlemleri yapabilir)
- ❌ Finansal KPI'lar (gizli)
- ❌ Toplam gelir/gider/kar (gizli)
- ❌ Detaylı finansal raporlar (gizli)

## 🎨 UI Göstergeleri

### Header (Üst Bar)
- **Admin**: 🛡️ Shield ikonu + "Yönetici" badge
- **User**: 👤 User ikonu + "Personel" badge

### Dashboard
- **Admin**: Tam finansal dashboard (4 KPI kartı + Kurum özeti)
- **User**: Sadece bilgilendirme kartları (2 basit istatistik)

## 🔒 Güvenlik

### RLS (Row Level Security)
Her kullanıcı:
- ✅ Sadece kendi profilini görebilir
- ✅ Sadece kendi profilini güncelleyebilir
- ❌ Kendi rolünü değiştiremez (sadece SQL ile)
- ✅ Sadece kendi verilerine erişebilir (dosyalar, masraflar vb.)

## 📝 Kod Kullanımı

### AuthContext'ten Rol Bilgisi Almak

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAdmin, role, profile } = useAuth();
  
  return (
    <div>
      {isAdmin ? (
        <AdminView />
      ) : (
        <UserView />
      )}
    </div>
  );
}
```

### Koşullu Render Örnekleri

```jsx
// Sadece admin görsün
{isAdmin && <FinancialReports />}

// Farklı içerik göster
{isAdmin ? (
  <FullDashboard />
) : (
  <SimpleDashboard />
)}

// Role göre stil
<div className={isAdmin ? 'admin-panel' : 'user-panel'}>
  {/* İçerik */}
</div>
```

## 🧪 Test Senaryoları

### Test 1: Admin Kullanıcı
1. Admin hesabı ile giriş yapın
2. Dashboard'da tüm KPI'ları görebilmelisiniz
3. Header'da "Yönetici" badge'i görünmeli
4. Tüm sekmeler erişilebilir olmalı

### Test 2: Personel Kullanıcı
1. Yeni bir hesap oluşturun (otomatik 'user' rolü alır)
2. Dashboard'da sadece basit bilgiler görünmeli
3. Header'da "Personel" badge'i görünmeli
4. Finansal detaylar gizli olmalı
5. Dosyalar ve masrafları ekleyip düzenleyebilmeli

### Test 3: Rol Değişikliği
1. Supabase'de bir kullanıcının rolünü değiştirin
2. Kullanıcı çıkış yapıp tekrar giriş yapsın
3. Yeni role uygun dashboard görünmeli

## 🛠️ Sorun Giderme

### Profil Yüklenmiyor
```sql
-- Profil var mı kontrol et
SELECT * FROM public.profiles WHERE user_id = auth.uid();

-- Yoksa manuel oluştur
INSERT INTO public.profiles (user_id, role, full_name)
VALUES (auth.uid(), 'user', 'İsim Soyisim');
```

### Rol Değişikliği Yansımıyor
- Kullanıcının çıkış yapıp tekrar giriş yapması gerekir
- AuthContext profil bilgisini login sırasında yükler

### RLS Hatası
```sql
-- RLS aktif mi kontrol et
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Policies kontrol et
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## 📊 Gelecek Geliştirmeler

- [ ] Profil düzenleme sayfası
- [ ] Kullanıcı yönetim paneli (sadece admin)
- [ ] Özel izinler (custom permissions)
- [ ] Rol bazlı bildirimler
- [ ] Kullanıcı aktivite logu

## 🔗 İlgili Dosyalar

- `/supabase/03_profiles_roles.sql` - Veritabanı schema
- `/src/contexts/AuthContext.tsx` - Auth ve rol yönetimi
- `/src/components/Dashboard.jsx` - Rol bazlı görünüm
- `/src/components/Header.jsx` - Rol göstergesi

## 💡 İpuçları

1. **İlk kullanıcı otomatik admin olur** - Script ilk kullanıcıyı admin yapar
2. **Yeni kayıtlar 'user' rolü alır** - Trigger otomatik user rolü atar
3. **Admin yetkisi SQL ile verilir** - Frontend'den rol değiştirilemez
4. **Her kullanıcı kendi verilerine erişir** - RLS ile korunuyor
5. **Rol değişikliği için yeniden giriş gerekir** - Session yenilenmesi lazım
