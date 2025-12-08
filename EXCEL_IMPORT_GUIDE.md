# 📊 Excel Toplu Yükleme Kılavuzu

## 🎯 Özellik Özeti

Artık **50 dosyayı tek tek girmek yerine**, Excel'den toplu yükleme yapabilirsiniz!

### ✅ Desteklenen İçerikler
1. **Dava Dosyaları** - Dosya listesi toplu import
2. **Ofis Giderleri** - Maaş, kira, fatura vb.
3. **Kurum Hakedişleri** - Adalet, SGK, TBB ödemeleri

---

## 📥 Nasıl Kullanılır?

### Adım 1: Şablon İndirme
1. İlgili sekmede **"Excel'den Yükle"** butonuna tıklayın
2. Açılan pencerede **"Şablon İndir"** butonunu kullanın
3. Bilgisayarınıza `dosyalar_sablon.xlsx` (veya ilgili tür) inecek

### Adım 2: Veri Doldurma
Excel dosyasını açın ve örnek satırları silin. Kendi verilerinizi girin:

#### 📁 Dosyalar Şablonu
| Dosya No | Müvekkil | Karşı Taraf | Mahkeme | Dava Türü | Anlaşılan Ücret | Peşin Alınan | Notlar |
|----------|----------|-------------|---------|-----------|-----------------|--------------|---------|
| 2024/101 | Ahmet Yılmaz | X Ltd. | Ankara 1. Asliye | hukuk | 15000 | 5000 | Duruşma haftaya |
| 2024/102 | Zeynep Demir | Y A.Ş. | İstanbul 5. İş | is | 25000 | 10000 | |

**Dava Türü Değerleri:**
- `ceza` - Ağır Ceza / Asliye Ceza
- `hukuk` - Asliye Hukuk / Sulh Hukuk
- `is` - İş Mahkemesi
- `aile` - Aile Mahkemesi (Boşanma vb.)
- `icra` - İcra Takibi
- `danismanlik` - Danışmanlık

#### 💰 Giderler Şablonu
| Tarih | Açıklama | Kategori | Tutar | Belge No |
|-------|----------|----------|-------|----------|
| 2024-01-15 | Ofis Kirası | kira | 12000 | K-01 |
| 2024-01-20 | Elektrik Faturası | elektrik | 850 | E-01 |

**Kategori Değerleri:**
- `kira`, `elektrik`, `su`, `internet`, `kirtasiye`, `ulasim`, `diger`

**Tarih Formatı:** `YYYY-MM-DD` (Örn: 2024-12-05)

#### 🏛️ Kurum Hakedişleri Şablonu
| Kurum Adı | Dosya No | Tahsilat Tutarı | Vekalet Oranı | Notlar |
|-----------|----------|-----------------|---------------|---------|
| adalet | 2024/AB-101 | 50000 | 10 | SGK vekalet ücreti |
| sgk | 2024/SGK-45 | 35000 | 12 | |

**Kurum Adı Değerleri:**
- `adalet` - Adalet Bakanlığı
- `sgk` - SGK
- `maliye` - Maliye Bakanlığı
- `tmob` - Türkiye Barolar Birliği
- `sigorta` - Sigorta Şirketi
- `diger` - Diğer

**Not:** Vekalet Oranı yüzde (%) olarak girilir. Net Hakediş otomatik hesaplanır.

### Adım 3: Dosya Yükleme
1. Excel dosyasını kaydedin
2. "Excel'den Yükle" penceresinde **dosya seçin**
3. **Önizleme tablosu** açılacak - verilerinizi kontrol edin
4. **"Verileri Aktar (X)"** butonuna basın
5. 🎉 BUM! Saniyeler içinde tüm kayıtlar veritabanında

---

## ⚠️ Önemli Notlar

### ✅ Yapılması Gerekenler
- **Sütun başlıklarını değiştirmeyin** (Dosya No, Müvekkil, vb. aynen kalmalı)
- **Tarih formatı** mutlaka `YYYY-MM-DD` olmalı
- **Kategori/Kurum/Dava Türü** değerleri yukarıdaki listeden seçilmeli
- **Sayısal alanlar** (Tutar, Oran) sayı olarak girilmeli (₺ simgesi yok)

### ❌ Yapılmaması Gerekenler
- Boş satır bırakmayın (Excel'in sonuna kadar okur)
- Sütun sırasını değiştirmeyin
- Yabancı karakter/emoji kullanmaktan kaçının
- Formül kullanmayın (hesaplanan değerler otomatik gelir)

---

## 🔧 Teknik Detaylar

### Veri Haritalama (Mapping)
Excel başlıkları otomatik olarak veritabanı sütunlarına çevrilir:

| Excel Başlığı | Veritabanı Sütunu |
|---------------|-------------------|
| Dosya No | `dosya_no` |
| Müvekkil | `muvekkil_adi` |
| Karşı Taraf | `karsi_taraf` |
| Anlaşılan Ücret | `tahsil_edilecek` |
| Açıklama | `aciklama` |
| Belge No | `belge_no` |

### Otomatik Eklenen Alanlar
- **Dosyalar:** `durum = 'acik'` (tüm dosyalar açık olarak başlar)
- **Giderler:** `odendi = false` (tüm giderler ödenmemiş başlar)
- **Kurum:** `odendi = false`, `net_hakedis` otomatik hesaplanır

---

## 💡 Kullanım Örnekleri

### Senaryo 1: Yeni Büroda 100 Dosya Yükleme
1. Eski sisteminizden dosya listesi çıkartın
2. Excel'e yapıştırın (sütun başlıklarını düzenleyin)
3. Tek seferde tüm dosyaları yükleyin
4. ⏱️ 2 dakika > 2 saat tasarruf!

### Senaryo 2: Aylık Gider Planlaması
1. Şablonu indirin
2. Tüm aylık giderleri (kira, maaş, faturalar) ekleyin
3. Toplu yükleyin
4. Dashboard'da anlık raporları görün

### Senaryo 3: Kurum Ödemelerini Takip
1. Adalet, SGK, TBB'den beklenen ödemeleri listeleyin
2. Tahsilat tutarı + vekalet oranını girin
3. Net hakediş otomatik hesaplanır
4. Ödeme geldiğinde durumunu güncelleyin

---

## 🐛 Sorun Giderme

### "Dosya okunamadı" Hatası
- Excel dosyasının `.xlsx` veya `.xls` uzantılı olduğundan emin olun
- Dosyayı kapatın ve tekrar deneyin
- Şablonu yeniden indirin

### "Yükleme Hatası" Mesajı
- **Zorunlu alanları** kontrol edin (Dosya No, Müvekkil, Açıklama vb.)
- **Kategori/Dava Türü** değerlerinin listeden olduğundan emin olun
- **Tarih formatı** doğru mu? (YYYY-MM-DD)
- Konsol hatasını okuyun (F12 ile açın)

### Veriler Görünmüyor
- Sayfayı yenileyin (F5)
- Filtreleri temizleyin
- Farklı sekmede olup olmadığınızı kontrol edin

---

## 📞 Destek

Sorunla karşılaşırsanız:
1. Önce bu kılavuzu kontrol edin
2. Tarayıcı konsolunu açın (F12) - hata mesajı var mı?
3. Şablon dosyasını yeniden indirin
4. Hala çözülemezse teknik destek alın

---

## 🚀 Gelecek Özellikler

- [ ] CSV formatı desteği
- [ ] Toplu güncelleme (mevcut kayıtları güncelle)
- [ ] Veri doğrulama (duplicate kontrol)
- [ ] Export/Import komple sistem yedeği
- [ ] Özel şablon tasarlayıcı

---

**Son Güncelleme:** 5 Aralık 2024  
**Versiyon:** 2.0 - Excel Import Modülü
