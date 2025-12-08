import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename, sheetName = 'Sayfa1') => {
  try {
    // Workbook oluştur
    const wb = XLSX.utils.book_new();
    
    // Veriyi worksheet'e çevir
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Sütun genişliklerini ayarla
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    // Worksheet'i workbook'a ekle
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Dosyayı indir
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Excel export hatası:', error);
    return false;
  }
};

export const exportDosyalarToExcel = (dosyalar) => {
  const formattedData = dosyalar.map(d => ({
    'Dosya No': d.dosya_no,
    'Müvekkil Adı': d.muvekkil_adi,
    'Karşı Taraf': d.karsi_taraf || '-',
    'Mahkeme': d.mahkeme || '-',
    'Dava Türü': d.type || '-',
    'Anlaşılan Ücret': d.anlasilan_ucret || 0,
    'Tahsil Edilen': d.tahsil_edilen || 0,
    'Tahsil Edilecek': d.tahsil_edilecek || 0,
    'Durum': d.durum || 'Açık',
    'Not': d.notes || '-'
  }));
  
  return exportToExcel(formattedData, 'Dosyalar', 'Dava Dosyaları');
};

export const exportGiderlerToExcel = (giderler) => {
  const formattedData = giderler.map(g => ({
    'Tarih': g.tarih,
    'Açıklama': g.aciklama,
    'Kategori': g.kategori,
    'Tutar': g.tutar,
    'Fatura No': g.faturaNo || '-',
    'Ödendi mi?': g.odendi,
    'Not': g.notes || '-'
  }));
  
  return exportToExcel(formattedData, 'Giderler', 'Büro Giderleri');
};

export const exportKurumToExcel = (kurumHakedisler) => {
  const formattedData = kurumHakedisler.map(k => ({
    'Kurum Adı': k.kurum_adi,
    'Dosya No': k.dosya_no,
    'Tahsil Tutarı': k.tahsil_tutar,
    'Vekalet Oranı (%)': k.vekalet_orani,
    'Net Hakediş': k.net_hakedis,
    'Ödendi': k.odendi ? 'Evet' : 'Hayır',
    'Not': k.notes || '-'
  }));
  
  return exportToExcel(formattedData, 'Kurum_Hakedisleri', 'Kurum Avukatlığı');
};

export const exportAllData = (dosyalar, giderler, kurumHakedisler) => {
  try {
    const wb = XLSX.utils.book_new();
    
    // Dosyalar sayfası
    if (dosyalar.length > 0) {
      const dosyalarData = dosyalar.map(d => ({
        'Dosya No': d.dosya_no,
        'Müvekkil Adı': d.muvekkil_adi,
        'Karşı Taraf': d.karsi_taraf || '-',
        'Mahkeme': d.mahkeme || '-',
        'Dava Türü': d.type || '-',
        'Anlaşılan Ücret': d.anlasilan_ucret || 0,
        'Tahsil Edilen': d.tahsil_edilen || 0,
        'Tahsil Edilecek': d.tahsil_edilecek || 0,
        'Durum': d.durum || 'Açık',
        'Not': d.notes || '-'
      }));
      const wsDosyalar = XLSX.utils.json_to_sheet(dosyalarData);
      XLSX.utils.book_append_sheet(wb, wsDosyalar, 'Dosyalar');
    }
    
    // Giderler sayfası
    if (giderler.length > 0) {
      const giderlerData = giderler.map(g => ({
        'Tarih': g.tarih,
        'Açıklama': g.aciklama,
        'Kategori': g.kategori,
        'Tutar': g.tutar,
        'Fatura No': g.faturaNo || '-',
        'Ödendi mi?': g.odendi,
        'Not': g.notes || '-'
      }));
      const wsGiderler = XLSX.utils.json_to_sheet(giderlerData);
      XLSX.utils.book_append_sheet(wb, wsGiderler, 'Giderler');
    }
    
    // Kurum sayfası
    if (kurumHakedisler.length > 0) {
      const kurumData = kurumHakedisler.map(k => ({
        'Kurum Adı': k.kurum_adi,
        'Dosya No': k.dosya_no,
        'Tahsil Tutarı': k.tahsil_tutar,
        'Vekalet Oranı (%)': k.vekalet_orani,
        'Net Hakediş': k.net_hakedis,
        'Ödendi': k.odendi ? 'Evet' : 'Hayır',
        'Not': k.notes || '-'
      }));
      const wsKurum = XLSX.utils.json_to_sheet(kurumData);
      XLSX.utils.book_append_sheet(wb, wsKurum, 'Kurum');
    }
    
    // Dosyayı indir
    XLSX.writeFile(wb, `Tum_Veriler_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Excel export hatası:', error);
    return false;
  }
};
