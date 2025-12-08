# 🎯 Hukuk Bürosu Mali Yönetim Sistemi - Özellikler

## ✨ Ana Özellikler

### 📊 Veri Yönetimi
- ✅ 5 veri tipi (Kurum Hakedişleri, Kurum Masrafları, Dosyalar, Dosya Masrafları, Ofis Giderleri)
- ✅ CRUD operasyonları (Create, Read, Update, Delete)
- ✅ Excel import/export (XLSX formatı)
- ✅ Veritabanı backup/restore (JSON)
- ✅ localStorage ile otomatik kaydetme

### 🔍 Arama ve Filtreleme
- ✅ Global arama (tüm alanlarda)
- ✅ Tarih aralığı filtresi
- ✅ Durum filtresi (Ödendi/Ödenmedi)
- ✅ Tutar aralığı filtresi
- ✅ Kategori bazlı filtreleme
- ✅ Gelişmiş filtre paneli

### 📈 Raporlama ve Analiz
- ✅ Interaktif Dashboard
- ✅ KPI kartları (Net Kar, Reel Gelir, Bekleyen Alacak)
- ✅ Grafik görselleştirmeler (Bar Chart, Pie Chart)
- ✅ PDF rapor oluşturma
- ✅ Aylık/Yıllık finansal raporlar
- ✅ Nakit akışı takibi

### 🔔 Bildirimler
- ✅ Ödeme hatırlatıcıları
- ✅ Gecikmiş ödeme uyarıları
- ✅ Yaklaşan ödeme bildirimleri
- ✅ Modern bildirim paneli

### 📋 Tablo Özellikleri
- ✅ Sıralama (tüm kolonlarda)
- ✅ Sayfalama (50 kayıt/sayfa)
- ✅ Toplu işlemler (bulk delete)
- ✅ Checkbox seçimi
- ✅ Sticky headers
- ✅ Detay görüntüleme modalları

### ⌨️ Klavye Kısayolları
- `Ctrl+K` - Aramaya odaklan
- `Ctrl+N` - Yeni kayıt ekle
- `Ctrl+F` - Filtreleri aç/kapat
- `Ctrl+S` - Ayarlar
- `Ctrl+D` - Dark mode
- `Ctrl+E` - Excel export
- `Ctrl+P` - PDF export
- `Ctrl+/` veya `?` - Yardım
- `Esc` - Modalları kapat
- `1,2,3,4` - Sekme geçişi

### 🎨 Kullanıcı Arayüzü
- ✅ Modern Tailwind CSS v4 tasarımı
- ✅ Dark mode (tam entegrasyon)
- ✅ Toast notifications
- ✅ Skeleton loading states
- ✅ Smooth animasyonlar
- ✅ Gradient'ler ve hover efektleri

### 📱 Responsive Tasarım
- ✅ Mobil hamburger menü
- ✅ Responsive grid sistemleri
- ✅ Touch-friendly butonlar
- ✅ Mobil overflow tablolar
- ✅ Adaptive padding ve spacing
- ✅ Mobile-first yaklaşım

### ⚙️ Ayarlar
- ✅ Firma adı özelleştirme
- ✅ Logo yükleme
- ✅ Para birimi seçimi
- ✅ Dark mode tercihi
- ✅ Ayarların otomatik kaydı

## 🚀 Kullanılan Teknolojiler

- **React 18.2** - UI framework
- **Vite 7.2.6** - Build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **XLSX** - Excel operations
- **jsPDF** - PDF generation
- **React Hot Toast** - Notifications
- **React Query v5** - State management (hazır)
- **Shadcn/ui** - UI components

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## 🎯 Kullanım

1. **Veri Girişi**: Her sekmede "+" butonuna tıklayarak yeni kayıt ekleyin
2. **Filtreleme**: Arama kutusunu veya gelişmiş filtreleri kullanın
3. **Raporlama**: Dashboard'da grafikleri görüntüleyin veya PDF/Excel export edin
4. **Backup**: Ayarlar menüsünden veritabanını yedekleyin/geri yükleyin

## 📝 Notlar

- Tüm veriler browser localStorage'da saklanır
- Excel import sırasında kolonlar otomatik eşleştirilir
- PDF raporları Turkish locale ile oluşturulur
- Dark mode tercihi otomatik kaydedilir
- Keyboard shortcuts tüm sayfalarda çalışır

## 🔄 Güncellemeler

**v10.0** (5 Aralık 2025)
- ✅ Tam responsive design
- ✅ Klavye kısayolları sistemi
- ✅ Pagination tüm tablolarda
- ✅ Bulk operations
- ✅ Advanced filters
- ✅ Dark mode polish
- ✅ Mobile optimization

---

**Geliştirici**: M&B Hukuk ve Danışmanlık
**Versiyon**: 10.0
**Tarih**: 5 Aralık 2025
