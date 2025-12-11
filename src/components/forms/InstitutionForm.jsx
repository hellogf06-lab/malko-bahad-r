import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';

const InstitutionForm = ({ onSubmit, initialData = null, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {
      kurum_adi: '',
      hakedis_tarihi: new Date().toISOString().split('T')[0],
      tahsil_tutar: 0,
      vekalet_orani: 10,
      notes: ''
    }
  });

  const onFormSubmit = (data) => {
    const tahsil_tutar = Number(data.tahsil_tutar) || 0;
    const vekalet_orani = Number(data.vekalet_orani) || 0;
    // dosya_no zorunlu, boşsa otomatik üret
    let dosya_no = data.dosya_no && data.dosya_no.trim() !== '' ? data.dosya_no : `KURUM-${Date.now()}`;
    const hakedis_tarihi = data.hakedis_tarihi || new Date().toISOString().split('T')[0];
    onSubmit({
      kurum_adi: data.kurum_adi,
      dosya_no,
      tahsil_tutar,
      vekalet_orani,
      hakedis_tarihi,
      odendi: false,
      notes: data.notes || ''
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6">
      
      {/* Grup 1: Kurum Bilgileri */}
      <div className="pb-5 border-b-2 border-gray-200">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">
          🏛️ Kurum Bilgileri
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
                    {/* Hakediş Tarihi */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Hakediş Tarihi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('hakedis_tarihi', { required: 'Hakediş tarihi zorunludur' })}
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.hakedis_tarihi ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.hakedis_tarihi && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.hakedis_tarihi.message}</p>
                      )}
                    </div>
          {/* Kurum Adı */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kurum Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('kurum_adi', { required: 'Kurum adı zorunludur', minLength: { value: 2, message: 'En az 2 karakter olmalıdır' } })}
              placeholder="Örn: SGK, İcra Müdürlüğü"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.kurum_adi ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.kurum_adi && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.kurum_adi.message}</p>
            )}
          </div>
            {/* Tahsil Tutarı */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tahsil Tutarı <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('tahsil_tutar', {
                  required: 'Tahsil tutarı zorunludur',
                  min: { value: 0, message: 'Negatif değer girilemez' }
                })}
                placeholder="0.00"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tahsil_tutar ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tahsil_tutar && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tahsil_tutar.message}</p>
              )}
            </div>
            {/* Vekalet Oranı */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                📊 Vekalet Oranı (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('vekalet_orani', {
                  required: 'Vekalet oranı zorunludur',
                  min: { value: 0, message: 'Negatif değer girilemez' },
                  max: { value: 100, message: 'En fazla 100 olabilir' }
                })}
                placeholder="10.00"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.vekalet_orani ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.vekalet_orani && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.vekalet_orani.message}</p>
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
            placeholder="Kurum hakedişi ile ilgili notlarınızı buraya ekleyebilirsiniz..."
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-y transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

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

export default InstitutionForm;
