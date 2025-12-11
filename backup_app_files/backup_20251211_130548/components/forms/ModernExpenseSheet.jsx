import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Calendar } from 'lucide-react';

const ModernExpenseSheet = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      aciklama: '',
      kategori: 'Kira',
      tutar: 0,
      tarih: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tutar: parseFloat(data.tutar) || 0
    });
    reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            {initialData ? '✏️ Gider Düzenle' : '💰 Yeni Gider İşlemi'}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Gider detaylarını eksiksiz giriniz. Tüm alanlar kaydedilecektir.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-8 space-y-8">
          {/* Grup 1: Temel Bilgiler */}
          <div className="space-y-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              📋 Temel Bilgiler
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aciklama" className="text-gray-700 font-medium">
                    Açıklama <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="aciklama"
                    placeholder="Örn: Ofis kira ödemesi"
                    {...register('aciklama', { 
                      required: 'Açıklama zorunludur',
                      minLength: { value: 2, message: 'En az 2 karakter olmalıdır' }
                    })}
                    className={errors.aciklama ? 'border-red-500' : ''}
                  />
                  {errors.aciklama && (
                    <p className="text-sm text-red-600 font-medium">{errors.aciklama.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tarih" className="text-gray-700 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    İşlem Tarihi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tarih"
                    type="date"
                    {...register('tarih', { required: 'Tarih zorunludur' })}
                    className={errors.tarih ? 'border-red-500' : ''}
                  />
                  {errors.tarih && (
                    <p className="text-sm text-red-600 font-medium">{errors.tarih.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tutar" className="text-gray-700 font-medium">
                    Tutar (₺) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tutar"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('tutar', {
                      required: 'Tutar zorunludur',
                      min: { value: 0, message: 'Negatif değer girilemez' }
                    })}
                    className={errors.tutar ? 'border-red-500' : ''}
                  />
                  {errors.tutar && (
                    <p className="text-sm text-red-600 font-medium">{errors.tutar.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grup 2: Kategori */}
          <div className="space-y-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              🏷️ Kategori Seçimi
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="kategori" className="text-gray-700 font-medium">
                Gider Kategorisi <span className="text-red-500">*</span>
              </Label>
              <select
                id="kategori"
                {...register('kategori', { required: 'Kategori zorunludur' })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="Kira">🏠 Kira</option>
                <option value="Maaş">👤 Maaş</option>
                <option value="Elektrik">⚡ Elektrik</option>
                <option value="Su">💧 Su</option>
                <option value="İnternet">🌐 İnternet</option>
                <option value="Kırtasiye">📎 Kırtasiye</option>
                <option value="Diğer">📦 Diğer</option>
              </select>
              {errors.kategori && (
                <p className="text-sm text-red-600 font-medium">{errors.kategori.message}</p>
              )}
            </div>
          </div>

          {/* Grup 3: Notlar */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              📝 Ek Bilgiler
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium">
                Notlar
              </Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows="4"
                placeholder="Ek açıklamalarınızı buraya yazabilirsiniz..."
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1"
            >
              İptal
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {initialData ? '💾 Güncelle' : '✅ Kaydet ve İşle'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ModernExpenseSheet;
