import { useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hangi tabloya ne yüklenecek? Ayarlar burada.
const IMPORT_CONFIGS = {
  dosyalar: {
    title: "Dava Dosyaları Yükle",
    tableName: "dosyalar",
    // Excel Başlığı : Veritabanı Sütun Adı
    columnMap: {
      "Dosya No": "dosya_no",
      "Müvekkil": "muvekkil_adi",
      "Karşı Taraf": "karsi_taraf",
      "Mahkeme": "mahkeme",
      "Dava Türü": "dava_turu",
      "Anlaşılan Ücret": "tahsil_edilecek",
      "Peşin Alınan": "tahsil_edilen",
      "Notlar": "notes"
    },
    sampleData: [
      { 
        "Dosya No": "2024/101", 
        "Müvekkil": "Ahmet Yılmaz", 
        "Karşı Taraf": "X Ltd.", 
        "Mahkeme": "Ankara 1. Asliye", 
        "Dava Türü": "hukuk", 
        "Anlaşılan Ücret": 15000,
        "Peşin Alınan": 5000,
        "Notlar": "Duruşma haftaya" 
      },
      { 
        "Dosya No": "2024/102", 
        "Müvekkil": "Zeynep Demir", 
        "Karşı Taraf": "Y A.Ş.", 
        "Mahkeme": "İstanbul 5. İş", 
        "Dava Türü": "is", 
        "Anlaşılan Ücret": 25000,
        "Peşin Alınan": 10000,
        "Notlar": "" 
      }
    ]
  },
  giderler: {
    title: "Gider Listesi Yükle",
    tableName: "giderler",
    columnMap: {
      "Tarih": "tarih", // Excel'de YYYY-MM-DD formatı önerilir
      "Açıklama": "aciklama",
      "Kategori": "kategori",
      "Tutar": "tutar",
      "Belge No": "belge_no"
    },
    sampleData: [
      { "Tarih": "2024-01-15", "Açıklama": "Ofis Kirası", "Kategori": "kira", "Tutar": 12000, "Belge No": "K-01" },
      { "Tarih": "2024-01-20", "Açıklama": "Elektrik Faturası", "Kategori": "elektrik", "Tutar": 850, "Belge No": "E-01" }
    ]
  },
  kurumDosyalari: {
    title: "Kurum Hakedişleri Yükle",
    tableName: "kurumDosyalari",
    columnMap: {
      "Kurum Adı": "kurum_adi",
      "Dosya No": "dosya_no",
      "Tahsilat Tutarı": "tahsil_tutar",
      "Vekalet Oranı": "vekalet_orani",
      "Notlar": "notes"
    },
    sampleData: [
      { "Kurum Adı": "adalet", "Dosya No": "2024/AB-101", "Tahsilat Tutarı": 50000, "Vekalet Oranı": 10, "Notlar": "SGK vekalet ücreti" }
    ]
  }
};

export function ImportDialog({ type, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const config = IMPORT_CONFIGS[type];

  // 1. Şablon İndirme (Kullanıcı ne dolduracağını bilsin)
  const downloadTemplate = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(config.sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sablon");
      // Dosya adını güvenli hale getir
      const safeFileName = `${type}_sablon`.replace(/[^a-zA-Z0-9-_]/g, '_') + '.xlsx';
      XLSX.writeFile(wb, safeFileName);
      toast.success("📥 Şablon indirildi!", {
        description: "Excel'i açıp verilerinizi doldurun."
      });
    } catch (err) {
      toast.error('Excel şablonu indirilirken hata oluştu!');
      console.error('Excel Download Error:', err);
    }
  };

  // 2. Dosya Okuma ve İşleme
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Excel verisini ham JSON'a çevir
        const rawData = XLSX.utils.sheet_to_json(ws);

        // Veritabanı sütun isimlerine dönüştür (Mapping)
        const mappedData = rawData.map((row) => {
          const newRow = {};
          Object.keys(config.columnMap).forEach((excelKey) => {
            const dbKey = config.columnMap[excelKey];
            // Eğer Excel'de bu sütun varsa, değerini al
            if (row[excelKey] !== undefined) {
              newRow[dbKey] = row[excelKey];
            }
          });
          // Sabit değerler ekle
          if(type === 'dosyalar') {
            newRow['durum'] = 'acik';
            newRow['tahsil_edilen'] = newRow['tahsil_edilen'] || 0;
          }
          if(type === 'giderler') {
            newRow['odendi'] = false;
          }
          if(type === 'kurumDosyalari') {
            newRow['odendi'] = false;
          }
          return newRow;
        });

        setData(mappedData);
        toast.info(`📊 ${mappedData.length} satır veri okundu`, {
          description: "Önizlemeyi kontrol edin ve 'Verileri Aktar' butonuna tıklayın."
        });
      } catch (error) {
        toast.error("❌ Dosya okunamadı", {
          description: error.message
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  // 3. Supabase'e Toplu Gönderme
  const handleImport = async () => {
    if (data.length === 0) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from(config.tableName)
        .insert(data);

      if (error) throw error;

      toast.success("✅ Veriler başarıyla yüklendi!", {
        description: `${data.length} kayıt veritabanına eklendi.`
      });
      setIsOpen(false);
      setData([]);
      if (onSuccess) onSuccess(); // Ana sayfayı yenile
    } catch (error) {
      toast.error("❌ Yükleme Hatası", { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-dashed border-slate-300 hover:border-green-400 hover:bg-green-50">
          <FileSpreadsheet size={16} className="text-green-600" />
          Excel'den Yükle
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="text-green-600" size={24} />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            Bilgisayarınızdaki Excel dosyasını seçerek toplu veri girişi yapabilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          
          {/* Adım 1: Dosya Seçimi ve Şablon */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <input 
                    type="file" 
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
            </div>
            <Button variant="ghost" size="sm" onClick={downloadTemplate} className="text-slate-600 gap-2 hover:bg-green-100 hover:text-green-700">
                <Download size={16} /> Şablon İndir
            </Button>
          </div>

          {/* Adım 2: Önizleme Tablosu */}
          {data.length > 0 && (
            <div className="border rounded-md">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                    <span>📋 İçe Aktarılacak Veri Önizlemesi</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">{data.length} Kayıt</span>
                </div>
                <ScrollArea className="h-[300px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(data[0]).map((key) => (
                                    <TableHead key={key} className="text-xs font-bold bg-slate-50">{key}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, i) => (
                                <TableRow key={i} className="hover:bg-blue-50">
                                    {Object.values(row).map((val, j) => (
                                        <TableCell key={j} className="text-xs font-medium">
                                            {String(val)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
          )}

          {data.length === 0 && (
             <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg text-slate-400 bg-slate-50">
                <UploadCloud size={40} className="mb-2 opacity-50" />
                <p className="text-sm">Henüz dosya seçilmedi</p>
                <p className="text-xs text-slate-400 mt-1">Yukarıdan Excel dosyası seçin veya şablon indirin</p>
             </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="gap-2">
              ❌ İptal
            </Button>
            <Button 
                onClick={handleImport} 
                disabled={data.length === 0 || loading}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-lg"
            >
                {loading ? "⏳ Yükleniyor..." : `✅ Verileri Aktar (${data.length})`}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
