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
  
  return exportToExcel(formattedData, 'Kurum_Dosyalari', 'Kurum Avukatlığı');
};


export const exportAllData = (dosyalar, giderler, kurumHakedisler) => {
  try {
    const wb = XLSX.utils.book_new();

    // 1. Özet Sayfası
    const summary = [
      ["Rapor Tarihi", new Date().toLocaleString()],
      ["Toplam Dosya", dosyalar.length],
      ["Toplam Gider", giderler.length],
      ["Toplam Kurum Hakedişi", kurumHakedisler.length],
      ["Toplam Tahsil Edilen", dosyalar.reduce((a, d) => a + (Number(d.tahsil_edilen) || 0), 0)],
      ["Toplam Gider Tutarı", giderler.reduce((a, g) => a + (Number(g.tutar) || 0), 0)],
      ["Toplam Kurum Net Hakediş", kurumHakedisler.reduce((a, k) => a + (Number(k.net_hakedis) || 0), 0)]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Rapor');

    // 2. Dosyalar Sayfası
    if (dosyalar.length > 0) {
      const dosyalarData = dosyalar.map(d => ({
        'Dosya No': d.dosya_no,
        'Müvekkil Adı': d.muvekkil_adi,
        'Karşı Taraf': d.karsi_taraf || '-',
        'Mahkeme': d.mahkeme || '-',
        'Dava Türü': d.type || '-',
        'Açılış Tarihi': d.created_at || '-',
        'Anlaşılan Ücret': d.anlasilan_ucret || 0,
        'Tahsil Edilen': d.tahsil_edilen || 0,
        'Tahsil Edilecek': d.tahsil_edilecek || 0,
        'Durum': d.durum || 'Açık',
        'Kapanış Tarihi': d.closed_at || '-',
        'Kullanıcı': d.user_id || '-',
        'Not': d.notes || '-'
      }));
      const wsDosyalar = XLSX.utils.json_to_sheet([
        { 'AÇIKLAMA': 'Dava dosyalarınızın detaylı listesi. Tüm alanlar ve özetler aşağıda.' },
        ...dosyalarData
      ], { skipHeader: false });
      // Otomatik filtreyi sadece veri başlıkları varsa uygula
      const ref = wsDosyalar['!ref'];
      if (ref) {
        const range = XLSX.utils.decode_range(ref);
        // Açıklama satırını atla, başlık satırından başlat
        if (range.s.r < range.e.r) {
          range.s.r = 1;
          wsDosyalar['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
        }
      }
      wsDosyalar['!cols'] = Object.keys(dosyalarData[0] || {}).map(key => ({ wch: Math.max(key.length, 18) }));
      XLSX.utils.book_append_sheet(wb, wsDosyalar, 'Dosyalar');
    }

    // 3. Giderler Sayfası
    if (giderler.length > 0) {
      const giderlerData = giderler.map(g => ({
        'Tarih': g.tarih,
        'Açıklama': g.aciklama,
        'Kategori': g.kategori,
        'Tutar': g.tutar,
        'Fatura No': g.faturaNo || '-',
        'Ödendi mi?': g.odendi ? 'Evet' : 'Hayır',
        'Kullanıcı': g.user_id || '-',
        'Not': g.notes || '-'
      }));
      const wsGiderler = XLSX.utils.json_to_sheet([
        { 'AÇIKLAMA': 'Tüm gider hareketlerinizin detaylı listesi.' },
        ...giderlerData
      ], { skipHeader: false });
      const refG = wsGiderler['!ref'];
      if (refG) {
        const rangeG = XLSX.utils.decode_range(refG);
        if (rangeG.s.r < rangeG.e.r) {
          rangeG.s.r = 1;
          wsGiderler['!autofilter'] = { ref: XLSX.utils.encode_range(rangeG) };
        }
      }
      wsGiderler['!cols'] = Object.keys(giderlerData[0] || {}).map(key => ({ wch: Math.max(key.length, 18) }));
      XLSX.utils.book_append_sheet(wb, wsGiderler, 'Giderler');
    }

    // 4. Kurum Hakedişleri Sayfası
    if (kurumHakedisler.length > 0) {
      const kurumData = kurumHakedisler.map(k => ({
        'Kurum Adı': k.kurum_adi,
        'Dosya No': k.dosya_no,
        'Tahsil Tutarı': k.tahsil_tutar,
        'Vekalet Oranı (%)': k.vekalet_orani,
        'Net Hakediş': k.net_hakedis,
        'Ödendi': k.odendi ? 'Evet' : 'Hayır',
        'Kullanıcı': k.user_id || '-',
        'Not': k.notes || '-'
      }));
      const wsKurum = XLSX.utils.json_to_sheet([
        { 'AÇIKLAMA': 'Kurum avukatlığına ait tahsilat ve hakedişler.' },
        ...kurumData
      ], { skipHeader: false });
      const refK = wsKurum['!ref'];
      if (refK) {
        const rangeK = XLSX.utils.decode_range(refK);
        if (rangeK.s.r < rangeK.e.r) {
          rangeK.s.r = 1;
          wsKurum['!autofilter'] = { ref: XLSX.utils.encode_range(rangeK) };
        }
      }
      wsKurum['!cols'] = Object.keys(kurumData[0] || {}).map(key => ({ wch: Math.max(key.length, 18) }));
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
