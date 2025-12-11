import { useState } from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../services/supabaseApi";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const TABLE_OPTIONS = {
  dosyalar: "Serbest Dosyalar",
  giderler: "Ofis Giderleri",
  kurumHakedisleri: "Kurum Hakedişleri"
};

interface DataImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (data: any) => void;
}

export default function DataImporter({ isOpen, onClose, onImport }: DataImporterProps) {
  const [selectedTable, setSelectedTable] = useState<string>("dosyalar");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rawData = XLSX.utils.sheet_to_json(ws);
      setData(rawData);
      toast.info(`${rawData.length} satır veri okundu.`);
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (data.length === 0) return;
    setLoading(true);

    try {
      const { error } = await supabase.from(selectedTable).insert(data);

      if (error) throw error;

      toast.success("✅ Veriler başarıyla yüklendi!");
      if (onImport) onImport(data);
      onClose();
      setData([]);
    } catch (error: any) {
      toast.error("Yükleme Hatası", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const sample = selectedTable === 'dosyalar' 
        ? [{ dosya_no: '2024/1', muvekkil_adi: 'Örnek Kişi', tahsil_edilecek: 1000 }] 
        : [{ aciklama: 'Kırtasiye', tutar: 500, kategori: 'kirtasiye', tarih: '2024-01-01' }];
    
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sablon");
    XLSX.writeFile(wb, `${selectedTable}_sablon.xlsx`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Excel'den Veri Yükle</DialogTitle>
          <DialogDescription>Toplu veri girişi için Excel dosyanızı seçin.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                    <SelectValue placeholder="Yüklenecek Tabloyu Seç" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(TABLE_OPTIONS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex items-center gap-4 p-6 border-2 border-dashed rounded-xl bg-slate-50 justify-center">
                <input 
                    type="file" 
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                    <Download size={16} className="mr-2"/> Şablon İndir
                </Button>
            </div>

            {data.length > 0 && (
                <ScrollArea className="h-[200px] border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(data[0]).map((key) => <TableHead key={key}>{key}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, i) => (
                                <TableRow key={i}>
                                    {Object.values(row).map((val: any, j) => <TableCell key={j}>{val}</TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            )}

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>İptal</Button>
                <Button onClick={handleImport} disabled={loading || data.length === 0} className="bg-green-600 hover:bg-green-700">
                    {loading ? "Yükleniyor..." : "Verileri Veritabanına Yaz"}
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
