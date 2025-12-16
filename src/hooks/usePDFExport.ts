
import { formatPara } from '../utils/helpers';
import { toast } from 'sonner';
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const usePDFExport = (hesaplamalar: any, dosyalar: any[], giderler: any[], settings: any, setAlert: any) => {
  const generatePDFReport = useCallback(() => {
    // DEBUG: Log data before export
    console.log('PDF Export - dosyalar:', dosyalar);
    console.log('PDF Export - giderler:', giderler);
    if (!dosyalar || dosyalar.length === 0) {
      alert('UYARI: PDF oluşturulurken dosyalar dizisi boş! (Veri gelmiyor)');
    } else {
      alert('PDF oluşturulurken dosyalar dizisi DOLU. İlk dosya: ' + JSON.stringify(dosyalar[0]));
    }
    try {
      const doc = new jsPDF();
      // --- BAŞLIK ---
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(settings.firmName, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Mali Durum Raporu - ${format(new Date(), 'd MMMM yyyy', { locale: tr })}`, 14, 30);

      // --- ÖZET KARTLARI ---
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(14, 40, 180, 25, 3, 3, 'F');
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text("Toplam Net Kâr", 20, 50);
      doc.text("Reel Gelir", 80, 50);
      doc.text("Toplam Gider", 140, 50);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      const currency = settings.currency || 'TRY';
      const fmt = (num: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(num);
      doc.text(fmt(hesaplamalar.netKar), 20, 60);
      doc.text(fmt(hesaplamalar.toplamReelGelir), 80, 60);
      doc.text(fmt(hesaplamalar.ofisGiderToplam), 140, 60);

      // --- TABLO 1: SON DOSYALAR ---
      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text("Son Eklenen Dosyalar", 14, 80);
      let dosyaBody = dosyalar && dosyalar.length > 0
        ? dosyalar.slice(0, 10).map(d => [
            d.dosya_no || '-',
            d.muvekkil_adi || '-',
            d.dava_turu || '-',
            fmt(d.tahsil_edilen || 0)
          ])
        : [['Veri yok', '', '', '']];
      doc.autoTable({
        startY: 85,
        head: [['Dosya No', 'Müvekkil', 'Dava Türü', 'Tahsilat']],
        body: dosyaBody,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 9 }
      });

      // --- TABLO 2: SON GİDERLER ---
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.text("Son Ofis Giderleri", 14, finalY);
      let giderBody = giderler && giderler.length > 0
        ? giderler.slice(0, 10).map(g => [
            g.tarih || '-',
            g.kategori || '-',
            g.aciklama || '-',
            fmt(g.tutar || 0)
          ])
        : [['Veri yok', '', '', '']];
      doc.autoTable({
        startY: finalY + 5,
        head: [['Tarih', 'Kategori', 'Açıklama', 'Tutar']],
        body: giderBody,
        theme: 'grid',
        headStyles: { fillColor: [220, 53, 69] },
        styles: { fontSize: 9 }
      });

      // İndir
      doc.save(`Mali_Rapor_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      if(setAlert) setAlert({ type: 'success', message: 'PDF raporu indirildi.' });
    } catch (error) {
      console.error(error);
      if(setAlert) setAlert({ type: 'error', message: 'PDF oluşturulurken hata çıktı.' });
    }
      }, [hesaplamalar, dosyalar, giderler, settings, setAlert]);

      return { generatePDFReport };
    };
