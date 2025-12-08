import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], fileName: string) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Veriler");
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportAllData = (dosyalar: any[], kurumDosyalari: any[], giderler: any[]) => {
    const wb = XLSX.utils.book_new();
    
    // Her veri türü ayrı bir sayfa (Sheet) olsun
    if(dosyalar.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dosyalar), "Dosyalar");
    if(kurumDosyalari.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kurumDosyalari), "Kurum Hakediş");
    if(giderler.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(giderler), "Ofis Giderleri");

    XLSX.writeFile(wb, "MB_Hukuk_Tam_Yedek.xlsx");
};
