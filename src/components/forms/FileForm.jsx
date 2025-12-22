import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

const FileForm = ({ onSubmit, initialData = null, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      dosya_no: '',
      muvekkil_adi: '',
      mahkeme_adi: '',
      esas_no: '',
      dosya_durumu: '',
      dosya_asamasi: '',
      son_degisim_tarihi: new Date().toISOString().split('T')[0],
      tahsil_edilen: 0,
      tahsil_edilecek: 0,
      notes: ''
    }
  });

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tahsil_edilen: parseFloat(data.tahsil_edilen) || 0,
      tahsil_edilecek: parseFloat(data.tahsil_edilecek) || 0,
      son_degisim_tarihi: data.son_degisim_tarihi || new Date().toISOString().split('T')[0]
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
      
      {/* Grup 1: Dosya Bilgileri */}
      <div className="pb-5 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          📁 Dosya Bilgileri
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Dosya No */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Dosya No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('dosya_no', { 
                required: 'Dosya numarası zorunludur',
                minLength: { value: 2, message: 'En az 2 karakter olmalıdır' }
              })}
              placeholder="Örn: 2024/001"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dosya_no ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dosya_no && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.dosya_no.message}</p>
            )}
          </div>
          {/* Müvekkil Adı */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Müvekkil Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('muvekkil_adi', { 
                required: 'Müvekkil adı zorunludur',
                minLength: { value: 2, message: 'En az 2 karakter olmalıdır' }
              })}
              placeholder="Müvekkil adını giriniz"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.muvekkil_adi ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.muvekkil_adi && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.muvekkil_adi.message}</p>
            )}
          </div>
          {/* Mahkeme Adı */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mahkeme Adı
            </label>
            <input
              type="text"
              {...register('mahkeme_adi', { maxLength: { value: 100, message: 'En fazla 100 karakter' } })}
              placeholder="Örn: İstanbul 5. Asliye Hukuk"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mahkeme_adi ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.mahkeme_adi && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.mahkeme_adi.message}</p>
            )}
          </div>
          {/* Esas No */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Esas No
            </label>
            <input
              type="text"
              {...register('esas_no', { maxLength: { value: 50, message: 'En fazla 50 karakter' } })}
              placeholder="Örn: 2024/123 E."
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.esas_no ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.esas_no && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.esas_no.message}</p>
            )}
          </div>
          {/* Dosya Durumu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Dosya Durumu
            </label>
            <select
              {...register('dosya_durumu')}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dosya_durumu ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seçiniz</option>
              <option value="acik">Açık</option>
              <option value="kapali">Kapalı</option>
              <option value="takipte">Takipte</option>
              <option value="tasfiye">Tasfiye</option>
            </select>
            {errors.dosya_durumu && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.dosya_durumu.message}</p>
            )}
          </div>
          {/* Dosya Aşaması */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Dosya Aşaması
            </label>
            <input
              type="text"
              {...register('dosya_asamasi', { maxLength: { value: 100, message: 'En fazla 100 karakter' } })}
              placeholder="Örn: Dava açıldı, keşif bekleniyor"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dosya_asamasi ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dosya_asamasi && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.dosya_asamasi.message}</p>
            )}
          </div>
          {/* Son Değişim Tarihi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Son Değişim Tarihi
            </label>
            <input
              type="date"
              {...register('son_degisim_tarihi')}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.son_degisim_tarihi ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.son_degisim_tarihi && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.son_degisim_tarihi.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Grup 2: Tahsilat Bilgileri */}
      <div className="pb-5 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          💰 Tahsilat Bilgileri
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Tahsil Edilen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              💵 Tahsil Edilen
            </label>
            <input
              type="number"
              step="0.01"
              {...register('tahsil_edilen', {
                min: { value: 0, message: 'Negatif değer girilemez' }
              })}
              placeholder="0.00"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tahsil_edilen ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tahsil_edilen && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tahsil_edilen.message}</p>
            )}
          </div>

          {/* Tahsil Edilecek */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              ⏳ Tahsil Edilecek
            </label>
            <input
              type="number"
              step="0.01"
              {...register('tahsil_edilecek', {
                min: { value: 0, message: 'Negatif değer girilemez' }
              })}
              placeholder="0.00"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tahsil_edilecek ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tahsil_edilecek && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tahsil_edilecek.message}</p>
            )}
          </div>
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
            placeholder="Dosya ile ilgili notlarınızı buraya ekleyebilirsiniz..."
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

export default FileForm;
