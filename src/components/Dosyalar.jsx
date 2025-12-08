import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Download, Eye } from 'lucide-react';
import { Input } from './ui/input';
import { exportDosyalarToExcel } from '../utils/excelExport';
import { Pagination, usePagination } from './ui/pagination';
import { DeleteConfirmDialog, useDeleteConfirm } from './ui/delete-confirm';
import { toast } from '../utils/toast';
import { useDebounce } from '../hooks/useDebounce';
import { Avatar } from './ui/avatar';
import { DropdownMenu, DropdownMenuItem } from './ui/dropdown';

const Dosyalar = ({ dosyalar, formatPara, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const { deleteState, openDeleteDialog, closeDeleteDialog } = useDeleteConfirm();

  // Debounced search - 300ms bekle
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleExport = useCallback(() => {
    const success = exportDosyalarToExcel(dosyalar);
    if (success) {
      toast.exported();
    } else {
      toast.error('Excel dışa aktarma hatası!');
    }
  }, [dosyalar]);

  const handleDelete = useCallback(() => {
    if (onDelete && deleteState.itemId) {
      onDelete(deleteState.itemId);
      toast.deleted();
    }
  }, [onDelete, deleteState.itemId]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  // Memoized filtering & sorting - prevent recalculation on every render
  const filteredDosyalar = useMemo(() => {
    let filtered = dosyalar.filter(d => 
      d.dosya_no?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      d.muvekkil_adi?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [dosyalar, debouncedSearchTerm, sortField, sortDirection]);

  // Pagination
  const {
    currentPage,
    totalPages,
    currentData,
    handlePageChange,
    totalItems,
    itemsPerPage
  } = usePagination(filteredDosyalar, 10);

  const SortButton = ({ field, children }) => (
    <div 
      className="flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown size={14} className="opacity-50" />
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Serbest Müvekkil Dosyaları</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Dosya veya müvekkil ara..."
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
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Yeni Dosya
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">
                    <SortButton field="dosya_no">Dosya No</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <SortButton field="muvekkil_adi">Müvekkil Adı</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    <SortButton field="tahsil_edilen">Tahsil Edilen</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    <SortButton field="tahsil_edilecek">Tahsil Edilecek</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold">Not</TableHead>
                  <TableHead className="font-semibold text-center">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'Sonuç bulunamadı' : 'Henüz dosya eklenmemiş'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map(d => (
                    <TableRow key={d.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{d.dosya_no}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={d.muvekkil_adi} size="sm" />
                          <span>{d.muvekkil_adi}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-700">{formatPara(d.tahsil_edilen)}</TableCell>
                      <TableCell className="text-right font-semibold text-orange-700">{formatPara(d.tahsil_edilecek)}</TableCell>
                      <TableCell className="text-gray-500">{d.notes || '-'}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuItem onClick={() => alert('Görüntüle: ' + d.id)}>
                            <Eye size={14} />
                            <span>Görüntüle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(d)}>
                            <Pencil size={14} />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            variant="danger" 
                            onClick={() => openDeleteDialog(d.id, d.dosya_no)}
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
      
      <DeleteConfirmDialog
        open={deleteState.open}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Dosyayı Sil"
        description="Bu dosya kalıcı olarak silinecektir. Bu işlem geri alınamaz."
        itemName={deleteState.itemName}
      />
    </div>
  );
};

export default Dosyalar;
