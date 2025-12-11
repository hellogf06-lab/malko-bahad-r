import React, { useState } from 'react';
import InstitutionForm from './forms/InstitutionForm';

const KurumHakedişTest = () => {
  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data) => {
    setFormData(data);
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#f9f9f9', borderRadius: 12 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>Kurum Hakedişi Test Alanı</h2>
      <InstitutionForm onSubmit={handleSubmit} onCancel={() => setSubmitted(false)} />
      {submitted && (
        <div style={{ marginTop: 32, background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
          <h3 style={{ fontWeight: 'bold', fontSize: 18 }}>Formdan Gelen Veri</h3>
          <pre style={{ fontSize: 14, background: '#f4f4f4', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default KurumHakedişTest;
