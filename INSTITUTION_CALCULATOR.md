# 🧮 Akıllı Kurum Hakediş Modülü

## 🎯 Özellikler

### ✨ Otomatik Hesaplama Motoru
- **Tahsilat Tutarı** gir → **Vekalet Oranı (%)** belirle → **Net Hakediş** otomatik hesaplanır
- React Hook Form ile canlı hesaplama (useEffect + form.watch)
- Veritabanında `GENERATED ALWAYS AS` ile persistent hesaplama

### 📊 Form Bileşenleri

```jsx
<InstitutionSheet 
  open={isInstSheetOpen} 
  onOpenChange={setInstSheetOpen} 
  onSubmit={handleInstSubmit} 
/>
```

**Field Mapping:**
```javascript
{
  institutionName: "adalet" | "sgk" | "maliye" | "tmob" | "sigorta" | "diger",
  fileNo: "2024/105",
  baseAmount: 10000,        // Tahsilat Tutarı (₺)
  rate: 10,                 // Vekalet Oranı (%)
  netAmount: 1000,          // Otomatik hesaplanan (10000 * 10 / 100)
  status: "bekliyor" | "odendi",
  notes: "Ödeme tarihi..."
}
```

### 🎨 Tasarım

- **Tema:** İndigo (Resmi kurum rengi)
- **İkonlar:** Building2 (Kurum), Calculator (Hesaplama), Save (Kaydet)
- **Layout:** 
  - Header: bg-indigo-50 (Kurum bilgisi)
  - Hesaplama Alanı: bg-slate-50 shadow-inner (Vurgulu)
  - Net Hakediş: bg-emerald-50 text-emerald-700 (Başarı rengi)

## 📦 Veritabanı Şeması

```sql
-- Otomatik hesaplama ile column ekleme
ALTER TABLE kurumDosyalari 
ADD COLUMN tahsil_tutar NUMERIC DEFAULT 0,
ADD COLUMN vekalet_orani NUMERIC DEFAULT 10,
ADD COLUMN net_hakedis NUMERIC GENERATED ALWAYS AS (
  (tahsil_tutar * vekalet_orani) / 100
) STORED;
```

**Migration Dosyası:** `supabase/04_institution_calculator.sql`

## 🔧 Kullanım

### 1. Form Açma
```jsx
const [isInstSheetOpen, setInstSheetOpen] = useState(false);

<Button onClick={() => setInstSheetOpen(true)}>
  Yeni Hakediş
</Button>
```

### 2. Veri Kaydetme
```jsx
const handleInstSubmit = async (formData) => {
  await addInstMutation.mutateAsync({
    kurum_adi: formData.institutionName,
    dosya_no: formData.fileNo,
    tahsil_tutar: formData.baseAmount,
    vekalet_orani: formData.rate,
    net_hakedis: formData.netAmount,  // Otomatik hesaplanmış değer
    odendi: formData.status === 'odendi',
    notes: formData.notes
  });

  toast.success("Hakediş kaydedildi!", {
    description: `Net: ${formData.netAmount}₺`
  });
};
```

## 🧪 Test Senaryosu

1. **Formu Aç:** "Yeni Hakediş" butonuna tıkla
2. **Kurum Seç:** "Adalet Bakanlığı" seç
3. **Dosya No:** "2024/105" gir
4. **Tahsilat Tutarı:** 10.000 ₺ yaz
5. **Vekalet Oranı:** %10 (varsayılan)
6. **Sonuç:** "Net Hakediş" alanı otomatik 1.000 ₺ olarak görünür
7. **Durum:** "Ödeme Bekleniyor" seç
8. **Kaydet:** Supabase'e kaydedilir, toast görünür

## 📈 Hesaplama Mantığı

```javascript
// React Hook Form watch ile canlı izleme
const baseAmount = form.watch("baseAmount");
const rate = form.watch("rate");

useEffect(() => {
  if (baseAmount > 0 && rate > 0) {
    const calculated = (baseAmount * rate) / 100;
    form.setValue("netAmount", calculated);
  }
}, [baseAmount, rate, form]);
```

**Örnek Hesaplamalar:**
- 10.000₺ × %10 = **1.000₺**
- 50.000₺ × %15 = **7.500₺**
- 100.000₺ × %8 = **8.000₺**

## 🔄 Güncelleme Dosyası

Migration'ı Supabase'e uygulama:

```bash
# SQL dosyasını kopyala
cat supabase/04_institution_calculator.sql

# Supabase Dashboard'da çalıştır:
# 1. Database → SQL Editor
# 2. Paste SQL content
# 3. Run
```

## ✅ Özellikler

- ✅ Otomatik hesaplama (useEffect + watch)
- ✅ Read-only net hakediş alanı
- ✅ 6 hazır kurum seçeneği
- ✅ Durum takibi (Bekliyor/Ödendi)
- ✅ Sonner toast bildirimleri
- ✅ Zod validasyonu
- ✅ Indigo tema tasarım
- ✅ Responsive layout

## 🚀 Sonraki Adımlar

- [ ] Hakediş listesini görüntüleme
- [ ] Filtreleme (Kurum adı, durum)
- [ ] Excel export
- [ ] Grafik (Kurumlara göre tahsilat)
