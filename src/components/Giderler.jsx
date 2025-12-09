import React, { useState, useMemo, useCallback } from 'react';
import ExpenseForm from './forms/ExpenseForm';
import { addGider } from '../services/supabaseApi';
import { Plus, Pencil, Trash2, Search, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { exportGiderlerToExcel } from '../utils/excelExport';
import { toast } from '../utils/toast';
import { useDebounce } from '../hooks/useDebounce';
import { Badge } from './ui/avatar';
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown';

const Giderler = ({ giderler, formatPara, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(() => {
    const success = exportGiderlerToExcel(giderler);
    if (success) {
      toast.exported();
    } else {
      toast.error('Excel dışa aktarma hatası!');
    }
  }, [giderler]);

  const filteredGiderler = useMemo(() => 
    giderler.filter(g => 
      g.aciklama?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      g.kategori?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [giderler, debouncedSearchTerm]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
        <CardTitle>Büro Giderleri</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Gider ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-48"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-1" 
            size="sm"
            onClick={handleExport}
          >
            <Download size={16}/> Excel
          </Button>
          <Button className="flex items-center gap-1" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16}/> Yeni Gider
          </Button>
        </div>
      </CardHeader>
      {/* Gider ekleme formu modalı */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
            <ExpenseForm
              onSubmit={async (data) => {
                setLoading(true);
                try {
                  await addGider(data);
                  toast.success('Gider başarıyla eklendi!');
                  setShowForm(false);
                  // Sayfa yenileme veya veri fetch işlemi burada tetiklenmeli
                } catch (err) {
                  toast.error('Gider eklenemedi: ' + (err.message || err));
                }
                setLoading(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      <CardContent className="p-2">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Tarih</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead>Fatura No</TableHead>
                <TableHead className="text-center">Ödendi mi?</TableHead>
                <TableHead className="text-center">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGiderler.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Sonuç bulunamadı' : 'Henüz gider eklenmemiş'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredGiderler.map(g => (
                  <TableRow key={g.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">{g.tarih}</TableCell>
                    <TableCell className="text-sm">{g.aciklama}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="info" size="sm">{g.kategori}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">{formatPara(g.tutar)}</TableCell>
                    <TableCell className="text-sm">{g.faturaNo}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={g.odendi === 'Evet' ? 'success' : 'danger'}>
                        {g.odendi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuItem onClick={() => alert('Görüntüle: ' + g.id)}>
                          <Eye size={14} />
                          <span>Görüntüle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit && onEdit(g)}>
                          <Pencil size={14} />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          variant="danger" 
                          onClick={() => onDelete && onDelete(g.id)}
                        >
                          <Trash2 size={14} />
                          <span>Sil</span>
                        </DropdownMenuItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Giderler;
