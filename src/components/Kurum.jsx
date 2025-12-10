import React, { useState, useMemo, useCallback } from 'react';
import InstitutionExpenseForm from './forms/InstitutionExpenseForm';
import { useAddData } from '../hooks/useQuery';
import { Plus, Pencil, Trash2, Search, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { exportKurumToExcel } from '../utils/excelExport';
import { toast } from '../utils/toast';
import { useDebounce } from '../hooks/useDebounce';
import { Avatar, Badge } from './ui/avatar';
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown';

const Kurum = ({ kurumHakedisler, formatPara, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [showMasrafForm, setShowMasrafForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const addInstitutionExpenseMutation = useAddData('kurumMasraflari');

  const handleExport = useCallback(() => {
    const success = exportKurumToExcel(kurumHakedisler);
    if (success) {
      toast.exported();
    } else {
      toast.error('Excel dışa aktarma hatası!');
    }
  }, [kurumHakedisler]);

  const filteredKurum = useMemo(() => 
    kurumHakedisler.filter(k => 
      k.kurum_adi?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      k.dosya_no?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [kurumHakedisler, debouncedSearchTerm]
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-bold text-gray-800">Kurum Avukatlığı ve Hakediş Takibi</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kurum veya dosya ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <Download size={16} />
              Excel
            </Button>
            <Button className="flex items-center gap-2" onClick={() => setShowMasrafForm(true)}>
              <Plus size={16} />
              Yeni Kurum Masrafı
            </Button>
          </div>
        </CardHeader>
        {/* Kurum masrafı ekleme formu modalı */}
        {showMasrafForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
              <InstitutionExpenseForm
                onSubmit={async (data) => {
                  setLoading(true);
                  try {
                    await addInstitutionExpenseMutation.mutateAsync(data);
                    toast.success('Kurum masrafı başarıyla eklendi!');
                    setShowMasrafForm(false);
                    // Sayfa yenileme veya veri fetch işlemi burada tetiklenmeli
                  } catch (err) {
                    toast.error('Kurum masrafı eklenemedi: ' + (err.message || err));
                  }
                  setLoading(false);
                }}
                onCancel={() => setShowMasrafForm(false)}
              />
            </div>
          </div>
        )}
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Kurum Adı</TableHead>
                  <TableHead className="font-semibold">Hakediş Tarihi</TableHead>
                  <TableHead className="font-semibold text-right">Tahsil Tutarı</TableHead>
                  <TableHead className="font-semibold text-center">Vekalet %</TableHead>
                  <TableHead className="font-semibold text-right">Net Hakediş</TableHead>
                  <TableHead className="font-semibold text-center">Ödendi</TableHead>
                  <TableHead className="font-semibold">Not</TableHead>
                  <TableHead className="font-semibold text-center">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKurum.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Sonuç bulunamadı' : 'Henüz kurum hakedişi eklenmemiş'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKurum.map(k => (
                    <TableRow key={k.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={k.kurum_adi} size="sm" />
                          <span>{k.kurum_adi}</span>
                        </div>
                      </TableCell>
                      <TableCell>{k.tarih ? k.tarih : (k.created_at ? k.created_at.split('T')[0] : '-')}</TableCell>
                      <TableCell className="text-right">{formatPara(k.tahsil_tutar)}</TableCell>
                      <TableCell className="text-center">{k.vekalet_orani}%</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">{formatPara(k.net_hakedis)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={k.odendi ? 'success' : 'warning'}>
                          {k.odendi ? 'Tahsil Edildi' : 'Bekliyor'}
                        </Badge>
                      </TableCell>
                      <TableCell>{k.notes || '-'}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuItem onClick={() => alert('Görüntüle: ' + k.id)}>
                            <Eye size={14} />
                            <span>Görüntüle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit && onEdit(k)}>
                            <Pencil size={14} />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="danger" 
                            onClick={() => onDelete && onDelete(k.id)}
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
    </div>
  );
};

export default Kurum;
