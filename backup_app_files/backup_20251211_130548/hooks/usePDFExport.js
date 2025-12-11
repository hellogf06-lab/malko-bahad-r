import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatPara } from '../utils/helpers';
import { toast } from 'sonner';

export const usePDFExport = (hesaplamalar, dosyalar, giderler, settings) => {
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(18);
    doc.text(settings.firmName, 14, 22);
    doc.setFontSize(11);
    doc.text(`Dönemsel Mali Rapor - ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
    
    // Özet Bilgiler
    doc.setFontSize(14);
    doc.text('Mali Özet', 14, 45);
    doc.setFontSize(10);
    doc.text(`Net Kâr: ${formatPara(hesaplamalar.netKar, settings.currency)}`, 14, 55);
    doc.text(`Toplam Reel Gelir: ${formatPara(hesaplamalar.toplamReelGelir, settings.currency)}`, 14, 62);
    doc.text(`Toplam Gider: ${formatPara(hesaplamalar.toplamGider, settings.currency)}`, 14, 69);
    doc.text(`Bekleyen Alacak: ${formatPara(hesaplamalar.kurumBekleyenAlacak, settings.currency)}`, 14, 76);
    
    // Kurum Hakedişleri Tablosu
    doc.setFontSize(12);
    doc.text('Kurum Hakedişleri', 14, 90);
    doc.autoTable({
      startY: 95,
      head: [['Kurum', 'Dosya No', 'Hakediş', 'Durum']],
      body: hesaplamalar.kurumHakedisler.map(k => [
        k.kurum_adi,
        k.dosya_no,
        formatPara(k.net_hakedis, settings.currency),
        k.odendi ? 'Ödendi' : 'Bekliyor'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 }
    });
    
    // Serbest Dosyalar
    doc.addPage();
    doc.setFontSize(12);
    doc.text('Serbest Dosyalar', 14, 20);
    doc.autoTable({
      startY: 25,
      head: [['Dosya No', 'Müvekkil', 'Tahsilat']],
      body: dosyalar.map(d => [
        d.dosya_no,
        d.muvekkil_adi,
        formatPara(d.tahsil_edilen, settings.currency)
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 }
    });
    
    // Ofis Giderleri
    const yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.text('Ofis Giderleri', 14, yPos);
    doc.autoTable({
      startY: yPos + 5,
      head: [['Kategori', 'Açıklama', 'Tutar', 'Tarih']],
      body: giderler.map(g => [
        g.kategori,
        g.aciklama,
        formatPara(g.tutar, settings.currency),
        g.tarih
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 8 }
    });
    
    // PDF'i indir
    doc.save(`${settings.firmName.replace(/\s+/g, '_')}_Mali_Rapor_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF rapor başarıyla oluşturuldu', {
      description: 'Rapor dosyası indirildi'
    });
  };

  return { generatePDFReport };
};
