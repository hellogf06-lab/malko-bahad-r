import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  title = "Silme Onayı",
  description = "Bu işlem geri alınamaz. Devam etmek istediğinize emin misiniz?",
  itemName = ""
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {itemName && (
              <p className="font-semibold text-gray-900 mb-2">
                "{itemName}"
              </p>
            )}
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Evet, Sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useDeleteConfirm = () => {
  const [deleteState, setDeleteState] = React.useState({
    open: false,
    itemId: null,
    itemName: ''
  });

  const openDeleteDialog = (itemId, itemName = '') => {
    setDeleteState({ open: true, itemId, itemName });
  };

  const closeDeleteDialog = () => {
    setDeleteState({ open: false, itemId: null, itemName: '' });
  };

  return {
    deleteState,
    openDeleteDialog,
    closeDeleteDialog
  };
};
