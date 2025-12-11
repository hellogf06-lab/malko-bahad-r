import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, X, Building2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const ReportTemplates = ({ isOpen, onClose, data, settings }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const formatPara = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value || 0);
  };

  const filterByDate = (items, dateField) => {
    return items.filter(item => {
      if (!item[dateField]) return false;
      const itemDate = new Date(item[dateField]);
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generateMonthlyReport = () => {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AYLIK FAALİYET RAPORU', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${settings?.firmName || 'Hukuk Bürosu'}`, 105, 30, { align: 'center' });
    doc.text(`Dönem: ${dateRange.start} / ${dateRange.end}`, 105, 38, { align: 'center' });

    let y = 50;

    // Dosya Özeti
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DOSYA ÖZETİ', 14, y);
    y += 10;

    const filteredFiles = filterByDate(data.dosyalar || [], 'created_at');
    doc.autoTable({
      startY: y,
      head: [['Dosya No', 'Müvekkil', 'Durum', 'Mahkeme']],
      body: filteredFiles.map(d => [
        d.dosya_no,
        d.muvekkil_adi,
        d.durum,
        d.mahkeme
      ]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    });

    y = doc.lastAutoTable.finalY + 15;

    // Gelir Özeti
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GELİR ÖZETİ', 14, y);
    y += 10;

    const filteredKurum = filterByDate(data.kurumDosyalari || [], 'created_at');
    const toplamGelir = filteredKurum.reduce((sum, k) => {
      const amount = k.net_hakedis || k.ucret || 0;
      const isPaid = k.odendi === true || k.odenmeDurumu === 'Ödendi';
      return sum + (isPaid ? amount : 0);
    }, 0);

    doc.autoTable({
      startY: y,
      head: [['Kurum', 'Dosya No', 'Net Hakediş', 'Durum']],
      body: filteredKurum.map(k => {
        const amount = k.net_hakedis || k.ucret || 0;
        const isPaid = k.odendi === true || k.odenmeDurumu === 'Ödendi';
        return [
          k.kurum_adi || 'Kurum',
          k.dosya_no || '-',
          formatPara(amount),
          isPaid ? 'Ödendi' : 'Bekliyor'
        ];
      }),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      foot: [['', '', formatPara(toplamGelir), '']],
      footStyles: { fillColor: [209, 250, 229], textColor: [6, 78, 59], fontStyle: 'bold' },
    });

    y = doc.lastAutoTable.finalY + 15;

    // Gider Özeti
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GİDER ÖZETİ', 14, y);
    y += 10;

    const filteredGider = filterByDate(data.giderler || [], 'tarih');
    const toplamGider = filteredGider.reduce((sum, g) => sum + (g.tutar || 0), 0);

    doc.autoTable({
      startY: y,
      head: [['Kategori', 'Açıklama', 'Tutar', 'Tarih']],
      body: filteredGider.map(g => [
        g.kategori,
        g.aciklama,
        formatPara(g.tutar),
        new Date(g.tarih).toLocaleDateString('tr-TR')
      ]),
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] },
      foot: [['', '', formatPara(toplamGider), '']],
      footStyles: { fillColor: [254, 226, 226], textColor: [127, 29, 29], fontStyle: 'bold' },
    });

    // Kaydet
    doc.save(`aylik_rapor_${dateRange.start}_${dateRange.end}.pdf`);
    toast.success('Aylık rapor oluşturuldu!', { icon: '📄' });
  };

  const generateAnnualReport = () => {
    const doc = new jsPDF();
    
    // Başlık
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('YILLIK FAALİYET RAPORU', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${settings?.firmName || 'Hukuk Bürosu'}`, 105, 30, { align: 'center' });
    doc.text(`Yıl: ${new Date(dateRange.start).getFullYear()}`, 105, 38, { align: 'center' });

    let y = 50;

    // Genel İstatistikler
    const toplamDosya = data.dosyalar?.length || 0;
    const toplamGelir = (data.kurumDosyalari || []).reduce((sum, k) => sum + (k.net_hakedis || 0), 0);
    const toplamGider = (data.giderler || []).reduce((sum, g) => sum + (g.tutar || 0), 0);
    const netKar = toplamGelir - toplamGider;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GENEL İSTATİSTİKLER', 14, y);
    y += 10;

    doc.autoTable({
      startY: y,
      body: [
        ['Toplam Dosya Sayısı', toplamDosya.toString()],
        ['Toplam Gelir', formatPara(toplamGelir)],
        ['Toplam Gider', formatPara(toplamGider)],
        ['Net Kar/Zarar', formatPara(netKar)],
      ],
      theme: 'grid',
      styles: { fontSize: 12, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [243, 244, 246] },
        1: { halign: 'right' }
      },
    });

    y = doc.lastAutoTable.finalY + 15;

    // Aylık Dağılım
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AYLIK GELİR-GİDER DAĞILIMI', 14, y);
    y += 10;

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const monthGelir = (data.kurumDosyalari || [])
        .filter(k => new Date(k.created_at).getMonth() + 1 === month)
        .reduce((sum, k) => sum + (k.net_hakedis || 0), 0);
      const monthGider = (data.giderler || [])
        .filter(g => new Date(g.tarih).getMonth() + 1 === month)
        .reduce((sum, g) => sum + (g.tutar || 0), 0);
      
      return [
        new Date(2024, i, 1).toLocaleDateString('tr-TR', { month: 'long' }),
        formatPara(monthGelir),
        formatPara(monthGider),
        formatPara(monthGelir - monthGider)
      ];
    });

    doc.autoTable({
      startY: y,
      head: [['Ay', 'Gelir', 'Gider', 'Net']],
      body: monthlyData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`yillik_rapor_${new Date().getFullYear()}.pdf`);
    toast.success('Yıllık rapor oluşturuldu!', { icon: '📊' });
  };

  const generateClientReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MÜVEKKİL BAZLI RAPOR', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${settings?.firmName || 'Hukuk Bürosu'}`, 105, 30, { align: 'center' });

    let y = 50;

    // Müvekkil bazında gruplama
    const clientMap = {};
    (data.dosyalar || []).forEach(dosya => {
      if (!clientMap[dosya.muvekkil_adi]) {
        clientMap[dosya.muvekkil_adi] = [];
      }
      clientMap[dosya.muvekkil_adi].push(dosya);
    });

    Object.entries(clientMap).forEach(([client, files], index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${client}`, 14, y);
      y += 8;

      doc.autoTable({
        startY: y,
        head: [['Dosya No', 'Konu', 'Durum', 'Mahkeme']],
        body: files.map(f => [f.dosya_no, f.konu, f.durum, f.mahkeme]),
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
      });

      y = doc.lastAutoTable.finalY + 15;
    });

    doc.save(`muvekkil_raporu_${dateRange.start}_${dateRange.end}.pdf`);
    toast.success('Müvekkil raporu oluşturuldu!', { icon: '👥' });
  };

  if (!isOpen) return null;

  const templates = [
    {
      id: 'monthly',
      name: 'Aylık Rapor',
      description: 'Seçili dönem için detaylı aylık faaliyet raporu',
      icon: Calendar,
      color: 'blue',
      action: generateMonthlyReport,
    },
    {
      id: 'annual',
      name: 'Yıllık Rapor',
      description: 'Yıl bazında gelir-gider analizi ve istatistikler',
      icon: TrendingUp,
      color: 'green',
      action: generateAnnualReport,
    },
    {
      id: 'client',
      name: 'Müvekkil Raporu',
      description: 'Müvekkil bazında dosya ve işlem listesi',
      icon: Building2,
      color: 'purple',
      action: generateClientReport,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={24} className="text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold text-2xl">
                Rapor Şablonları
              </span>
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Tarih Aralığı */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Şablonlar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map(template => {
              const IconComponent = template.icon;
              
              // Color mapping for Tailwind classes (must be complete strings)
              const colorClasses = {
                blue: {
                  bg: 'bg-blue-100',
                  text: 'text-blue-600',
                  btn: 'bg-blue-600 hover:bg-blue-700'
                },
                green: {
                  bg: 'bg-green-100',
                  text: 'text-green-600',
                  btn: 'bg-green-600 hover:bg-green-700'
                },
                purple: {
                  bg: 'bg-purple-100',
                  text: 'text-purple-600',
                  btn: 'bg-purple-600 hover:bg-purple-700'
                }
              };
              
              const colors = colorClasses[template.color] || colorClasses.blue;
              
              return (
                <div
                  key={template.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer group"
                  onClick={template.action}
                >
                  <div className={`p-3 ${colors.bg} rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={32} className={colors.text} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <Button
                    className={`w-full ${colors.btn} text-white`}
                  >
                    <Download size={16} className="mr-2" />
                    Rapor Oluştur
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTemplates;
