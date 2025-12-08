import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const DataImporter = ({ isOpen, onClose, onImport }) => {
  const [importResults, setImportResults] = useState(null);

  const handleFileUpload = (event, dataType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error('Excel dosyası boş!');
          return;
        }

        // Veri tipine göre işle
        const processed = processImportData(jsonData, dataType);
        setImportResults(processed);

        if (processed.success > 0) {
          toast.success(`${processed.success} kayıt başarıyla içe aktarıldı!`, { icon: '✅' });
          
          // Notify parent and reload
          if (onImport) {
            onImport({ type: dataType, count: processed.success });
          }
        }
      } catch (error) {
        console.error('İçe aktarma hatası:', error);
        toast.error('Excel dosyası okunamadı!');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processImportData = (jsonData, dataType) => {
    let success = 0;
    let failed = 0;
    const processedData = [];

    jsonData.forEach((row, index) => {
      try {
        let item = {};
        
        if (dataType === 'dosyalar') {
          item = {
            id: Date.now() + index,
            dosya_no: row['Dosya No'] || row['dosya_no'] || '',
            muvekkil_adi: row['Müvekkil Adı'] || row['muvekkil_adi'] || '',
            karsi_taraf: row['Karşı Taraf'] || row['karsi_taraf'] || '',
            konu: row['Konu'] || row['konu'] || '',
            mahkeme: row['Mahkeme'] || row['mahkeme'] || '',
            durum: row['Durum'] || row['durum'] || 'Devam Ediyor',
            teslim_tarihi: row['Teslim Tarihi'] || row['teslim_tarihi'] || null,
            notes: row['Notlar'] || row['notes'] || '',
            created_at: new Date().toISOString(),
          };
        } else if (dataType === 'giderler') {
          item = {
            id: Date.now() + index,
            kategori: row['Kategori'] || row['kategori'] || 'Genel',
            aciklama: row['Açıklama'] || row['aciklama'] || '',
            tutar: parseFloat(row['Tutar'] || row['tutar'] || 0),
            tarih: row['Tarih'] || row['tarih'] || new Date().toISOString(),
            notes: row['Notlar'] || row['notes'] || '',
            created_at: new Date().toISOString(),
          };
        } else if (dataType === 'kurumDosyalari') {
          item = {
            id: Date.now() + index,
            kurum_adi: row['Kurum Adı'] || row['kurum_adi'] || '',
            dosya_no: row['Dosya No'] || row['dosya_no'] || '',
            tahsil_tutar: parseFloat(row['Tahsil Tutarı'] || row['tahsil_tutar'] || 0),
            vekalet_orani: parseFloat(row['Vekalet Oranı'] || row['vekalet_orani'] || 0),
            net_hakedis: parseFloat(row['Net Hakediş'] || row['net_hakedis'] || 0),
            odendi: row['Ödendi'] === 'Evet' || row['odendi'] === true,
            notes: row['Notlar'] || row['notes'] || '',
            created_at: new Date().toISOString(),
          };
        }

        if (item.id) {
          processedData.push(item);
          success++;
        }
      } catch (err) {
        failed++;
        console.error('Satır işleme hatası:', index, err);
      }
    });

    return { success, failed, data: processedData };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white shadow-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSpreadsheet size={24} className="text-green-600" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-extrabold text-2xl">
                Veri İçe Aktarma
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
          {/* Bilgi */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Excel Dosyası Nasıl Hazırlanır?</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>İlk satır sütun başlıklarını içermelidir</li>
                <li>Dosyalar için: "Dosya No", "Müvekkil Adı", "Karşı Taraf", "Konu", "Mahkeme"</li>
                <li>Giderler için: "Kategori", "Açıklama", "Tutar", "Tarih"</li>
                <li>Kurum için: "Kurum Adı", "Dosya No", "Tahsil Tutarı", "Vekalet Oranı"</li>
              </ul>
            </div>
          </div>

          {/* Dosyalar İçe Aktarma */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet size={18} />
              Dosyalar İçe Aktar
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'dosyalar')}
              className="hidden"
              id="import-dosyalar"
            />
            <label htmlFor="import-dosyalar">
              <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload size={18} />
                Excel'den Dosya Yükle
              </div>
            </label>
          </div>

          {/* Giderler İçe Aktarma */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet size={18} />
              Giderler İçe Aktar
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'giderler')}
              className="hidden"
              id="import-giderler"
            />
            <label htmlFor="import-giderler">
              <div className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload size={18} />
                Excel'den Gider Yükle
              </div>
            </label>
          </div>

          {/* Kurum Dosyaları İçe Aktarma */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet size={18} />
              Kurum Dosyaları İçe Aktar
            </h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'kurumDosyalari')}
              className="hidden"
              id="import-kurum"
            />
            <label htmlFor="import-kurum">
              <div className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload size={18} />
                Excel'den Kurum Dosyası Yükle
              </div>
            </label>
          </div>

          {/* Sonuçlar */}
          {importResults && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                İçe Aktarma Sonuçları
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-xs text-green-700 font-semibold">Başarılı</p>
                  <p className="text-2xl font-bold text-green-800">{importResults.success}</p>
                </div>
                {importResults.failed > 0 && (
                  <div className="p-3 bg-red-100 rounded-lg">
                    <p className="text-xs text-red-700 font-semibold">Başarısız</p>
                    <p className="text-2xl font-bold text-red-800">{importResults.failed}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImporter;
