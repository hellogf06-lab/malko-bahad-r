# UI/UX İyileştirmeleri Test Checklist
# Tarih: 5 Aralık 2025

## ✅ Test Edilmesi Gerekenler

### 1. Avatar Component
- [ ] Kurum Hakedişleri tablosunda kurum_adi yanında avatar görünüyor mu?
- [ ] Dosyalar tablosunda müvekkil_adi yanında avatar görünüyor mu?
- [ ] Avatar renkleri tutarlı mı? (Aynı isim her zaman aynı renk)
- [ ] İnitial harfleri doğru mu? (2 harf - isim ve soyisim)
- [ ] 3 farklı boyut (sm/md/lg) çalışıyor mu?

### 2. Badge Component
- [ ] Kurum Hakedişleri'nde durum badge'i görünüyor mu?
- [ ] "Tahsil Edildi" → yeşil (success)
- [ ] "Bekliyor" → turuncu (warning)
- [ ] Giderler tablosunda kategori badge'i görünüyor mu?
- [ ] Dosya Masrafları tablosunda tür badge'i görünüyor mu?

### 3. Dropdown Menu
- [ ] Kurum Hakedişleri - 3 nokta butonu var mı?
- [ ] Tıklayınca menü açılıyor mu?
- [ ] Dışarı tıklayınca kapanıyor mu?
- [ ] Menü itemlerine tıklayınca kapanıyor mu?
- [ ] "Detayları Görüntüle" çalışıyor mu?
- [ ] "Düzenle" çalışıyor mu?
- [ ] "Sil" (kırmızı) çalışıyor mu?
- [ ] Dosyalar tablosunda dropdown çalışıyor mu?
- [ ] Giderler tablosunda dropdown çalışıyor mu?
- [ ] Kurum Masrafları tablosunda dropdown çalışıyor mu?
- [ ] Dosya Masrafları tablosunda dropdown çalışıyor mu?

### 4. Empty State (Grafikler)
- [ ] Veri yokken "Nakit Akışı" grafiğinde boş state görünüyor mu?
- [ ] Veri yokken "Gider Dağılımı" grafiğinde boş state görünüyor mu?
- [ ] Icon, başlık ve açıklama doğru görünüyor mu?

### 5. Skeleton Loading
- [ ] Veriler yüklenirken grafiklerde skeleton animasyonu görünüyor mu?
- [ ] 2 grafik için skeleton var mı? (Bar + Pie)
- [ ] Animasyon smooth mu?

### 6. ExpenseSheet (Gider Formu)
- [ ] "Yeni Gider" butonuna basınca sağdan panel açılıyor mu?
- [ ] Backdrop blur efekti çalışıyor mu?
- [ ] Slide-in animasyonu smooth mu?
- [ ] Form alanları:
  - [ ] Tutar girişi (₺ sembolü var mı?)
  - [ ] Tarih seçici (Türkçe takvim)
  - [ ] Başlık/Açıklama
  - [ ] Kategori dropdown (5 seçenek)
  - [ ] Fiş No (opsiyonel)
- [ ] Validasyon çalışıyor mu?
  - [ ] Boş tutar → hata
  - [ ] Negatif tutar → hata
  - [ ] Boş başlık → hata
  - [ ] Kategori seçilmemiş → hata
  - [ ] Tarih seçilmemiş → hata
- [ ] "Kaydet ve İşle" butonuna basınca:
  - [ ] Form kapanıyor mu?
  - [ ] Toast notification görünüyor mu?
  - [ ] Tabloya ekleniyor mu?

### 7. FileSheet (Dosya Formu)
- [ ] "Serbest Dosyalar" → "Ekle" butonuna basınca açılıyor mu?
- [ ] Form alanları:
  - [ ] Dosya No (zorunlu)
  - [ ] Müvekkil Adı (zorunlu)
  - [ ] Karşı Taraf (opsiyonel)
  - [ ] Mahkeme (opsiyonel)
  - [ ] Tahsilat tutarı
  - [ ] Duruşma tarihi (takvim)
  - [ ] Açıklama
- [ ] Validasyon çalışıyor mu?
- [ ] Submit sonrası tabloya ekleniyor mu?

### 8. InstitutionSheet (Kurum Hakedişi Formu)
- [ ] "Kurum Hakedişleri" → "Ekle" butonuna basınca açılıyor mu?
- [ ] Form alanları:
  - [ ] Tutar (zorunlu)
  - [ ] Tarih (zorunlu, takvim)
  - [ ] Kurum Adı (zorunlu)
  - [ ] Dosya No (zorunlu)
  - [ ] Hakediş Türü (dropdown: Avukatlık Ücreti, Vekalet Ücreti, Yargılama Gideri, Diğer)
  - [ ] Açıklama
- [ ] Validasyon çalışıyor mu?
- [ ] Submit sonrası tabloya ekleniyor mu?

### 9. LegalExpenseSheet (Dosya Masrafı Formu)
- [ ] "Dosya Masrafları" → "Ekle" butonuna basınca açılıyor mu?
- [ ] Form alanları:
  - [ ] Tutar (zorunlu)
  - [ ] Tarih (zorunlu, geçmiş tarihler)
  - [ ] Dosya Seçimi (dropdown - mevcut dosyalardan)
  - [ ] Masraf Türü (dropdown: Harç, Posta, Noter, Bilirkişi, Tapu, Tercüme, Ulaşım, Diğer)
  - [ ] Açıklama
- [ ] Dosya listesi doğru görünüyor mu?
- [ ] Validasyon çalışıyor mu?
- [ ] Submit sonrası tabloya ekleniyor mu?

### 10. Keyboard Shortcuts
- [ ] Ctrl+N (Kurum sekmesinde) → InstitutionSheet açıyor mu?
- [ ] Ctrl+N (Dosyalar sekmesinde) → FileSheet açıyor mu?
- [ ] Ctrl+N (Giderler sekmesinde) → ExpenseSheet açıyor mu?

### 11. Tablo Genişlikleri
- [ ] Kurum Hakedişleri: 9 kolon → 7 kolon oldu mu?
- [ ] Dosyalar: 8 kolon → 6 kolon oldu mu?
- [ ] Giderler: 9 kolon → 7 kolon oldu mu?
- [ ] Kurum Masrafları: 8 kolon → 6 kolon oldu mu?
- [ ] Dosya Masrafları: 10 kolon → 7 kolon oldu mu?
- [ ] Tablolar daha kompakt görünüyor mu?

### 12. Hover Efektleri
- [ ] Tablo satırlarında hover: bg-*/30 (daha subtle)
- [ ] Dropdown butonu hover
- [ ] Badge'lerde hover yok (static)
- [ ] Avatar'da hover tooltip var mı?

### 13. Responsive Design
- [ ] Mobile'da Sheet paneller ekranı kaplayıyor mu?
- [ ] Tablolar yatay scroll yapıyor mu?
- [ ] Grafikler mobile'da düzgün görünüyor mu?

### 14. Performance
- [ ] Tablo scroll smooth mu?
- [ ] Sheet açılma/kapanma smooth mu? (0.3s)
- [ ] Dropdown açılma anında mı?
- [ ] Skeleton → veri geçişi smooth mu?

### 15. Browser Konsolu
- [ ] Console'da hata var mı?
- [ ] Warning var mı?
- [ ] PropTypes hatası var mı?
- [ ] Memory leak var mı?

---

## Hızlı Test Adımları

1. **Sayfayı aç**: http://localhost:3000
2. **Konsolu kontrol et**: F12 → Console → Hata var mı?
3. **Her sekmeyi aç**: Kurum / Dosyalar / Giderler / Dashboard
4. **Avatar'ları gör**: İsimlerin yanında renkli daireler
5. **Badge'leri gör**: Durumlar renkli kutular
6. **Dropdown'ları test et**: 3 nokta → menü → dışarı tıkla
7. **Sheet'leri test et**: 
   - Giderler → Yeni Gider
   - Dosyalar → Ekle
   - Kurum → Ekle
8. **Form validasyonu test et**: Boş submit → hata mesajları
9. **Başarılı submit**: Form doldur → Kaydet → Toast → Tabloda gör
10. **Keyboard test**: Ctrl+N her sekmede

---

## Bilinen Sorunlar (Varsa)
- None

## Notlar
- Tüm Sheet formlar Zod validasyonu kullanıyor
- Tarih seçici Türkçe (date-fns/locale/tr)
- Dropdown click-outside detection React useRef ile
- Avatar renkleri hash-based (tutarlı)
