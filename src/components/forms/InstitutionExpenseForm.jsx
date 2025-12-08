import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

const InstitutionExpenseForm = ({ onSubmit, initialData = null, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      aciklama: '',
      masraf_turu: 'Dosya Masrafı',
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
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
      
      {/* Grup 1: Temel Bilgiler */}
      <div className="pb-5 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          📋 Temel Bilgiler
        </h3>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('aciklama', { 
                required: 'Açıklama zorunludur',
                minLength: { value: 2, message: 'En az 2 karakter olmalıdır' }
              })}
              placeholder="Örn: Duruşma masrafı - İcra Müdürlüğü"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.aciklama ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.aciklama && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.aciklama.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tarih */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                📅 Tarih <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('tarih', { required: 'Tarih zorunludur' })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tarih ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tarih && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tarih.message}</p>
              )}
            </div>

            {/* Tutar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                💰 Tutar <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('tutar', {
                  required: 'Tutar zorunludur',
                  min: { value: 0, message: 'Negatif değer girilemez' }
                })}
                placeholder="0.00"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tutar ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tutar && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tutar.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grup 2: Kategori */}
      <div className="pb-5 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          🏷️ Masraf Türü
        </h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Masraf Kategorisi <span className="text-red-500">*</span>
          </label>
          <select
            {...register('masraf_turu', { required: 'Masraf türü zorunludur' })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Dosya Masrafı">📁 Dosya Masrafı</option>
            <option value="Ulaşım">🚗 Ulaşım</option>
            <option value="Diğer">📦 Diğer</option>
          </select>
          {errors.masraf_turu && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.masraf_turu.message}</p>
          )}
        </div>
      </div>

      {/* Grup 3: Ek Bilgiler */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          📝 Ek Bilgiler
        </h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Notlar
          </label>
          <textarea
            {...register('notes')}
            rows="4"
            placeholder="Masraf ile ilgili ek açıklamalarınızı buraya yazabilirsiniz..."
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-y transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-5 border-t-2 border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onCancel();
          }}
          className="flex-1"
        >
          ❌ İptal
        </Button>
        <Button
          type="submit"
          className="flex-1"
        >
          {initialData ? '💾 Güncelle' : '✅ Kaydet'}
        </Button>
      </div>
    </form>
  );
};

export default InstitutionExpenseForm;
