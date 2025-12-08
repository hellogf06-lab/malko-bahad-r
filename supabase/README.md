# Supabase Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub/Google ile giriş yapın
4. "New Project" butonuna tıklayın
5. Proje adı, veritabanı şifresi ve bölge seçin
6. "Create new project" butonuna tıklayın

## 2. Veritabanı Şemasını Oluşturma

1. Supabase Dashboard'da **SQL Editor** sekmesine gidin
2. `supabase/01_schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'a yapıştırın
4. **"Run"** butonuna tıklayın
5. ✅ Başarılı mesajı görmelisiniz

## 3. RLS Politikalarını Aktifleştirme

1. **SQL Editor** sekmesinde yeni bir query açın
2. `supabase/02_rls_policies.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'a yapıştırın
4. **"Run"** butonuna tıklayın
5. ✅ Tüm politikalar oluşturulmalıdır

## 4. Environment Variables Ayarlama

1. Supabase Dashboard'da **Settings > API** sekmesine gidin
2. Aşağıdaki değerleri bulun:
   - **Project URL** (REACT_APP_SUPABASE_URL)
   - **anon/public key** (REACT_APP_SUPABASE_ANON_KEY)

3. Proje klasöründeki `.env` dosyasını açın ve değerleri girin:

```bash
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Authentication Ayarları

1. Supabase Dashboard'da **Authentication > Providers** sekmesine gidin
2. **Email** provider'ı aktif edin
3. **Confirm email** seçeneğini kapatabilirsiniz (development için)
4. Site URL'i ayarlayın: `http://localhost:3000`

## 6. Test Kullanıcısı Oluşturma

### Yöntem 1: Dashboard Üzerinden
1. **Authentication > Users** sekmesine gidin
2. **"Add user"** > **"Create new user"** seçeneğini tıklayın
3. Email ve şifre girin
4. **"Create user"** butonuna tıklayın

### Yöntem 2: Uygulama Üzerinden
1. Uygulamayı başlatın: `npm start`
2. "Kayıt Ol" linkine tıklayın
3. Formu doldurun
4. Email doğrulama linkini tıklayın (eğer aktifse)

## 7. RLS Kontrolü

SQL Editor'da şu sorguyu çalıştırın:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Tüm tabloların `rowsecurity` kolonu `true` olmalıdır.

## 8. Test

1. Uygulamaya giriş yapın
2. Dosya ekleyin
3. Supabase Dashboard > Table Editor'da verileri görün
4. `user_id` kolonunun otomatik dolduğunu kontrol edin

## 🔒 Güvenlik Notu

RLS politikaları sayesinde:
- ✅ Her kullanıcı sadece kendi verilerini görebilir
- ✅ Frontend hacklense bile başka kullanıcının verisi çalınamaz
- ✅ Veritabanı seviyesinde koruma
- ✅ SQL injection koruması

## Sorun Giderme

### Bağlantı Hatası
- `.env` dosyasındaki değerleri kontrol edin
- Supabase projesinin aktif olduğundan emin olun
- `npm start` ile uygulamayı yeniden başlatın

### RLS Hatası
- SQL scriptlerinin sırasıyla çalıştırıldığından emin olun
- `auth.uid()` fonksiyonunun mevcut olduğunu kontrol edin

### Auth Hatası
- Email provider'ın aktif olduğunu kontrol edin
- Site URL'in doğru olduğunu kontrol edin
