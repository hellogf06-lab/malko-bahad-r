import React, { useState } from 'react';
import { Plus, User, Phone, Mail, Briefcase, Trash2, Edit2, Search } from 'lucide-react';
import { Button } from './ui/button';

const initialContacts = [
  // Örnek veri
  { id: 1, name: 'Ahmet Yılmaz', type: 'Müvekkil', phone: '555-123-4567', email: 'ahmet@example.com', notes: '' },
  { id: 2, name: 'Av. Ayşe Demir', type: 'Karşı Avukat', phone: '555-987-6543', email: 'ayse@example.com', notes: '' },
];

export default function Contacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Müvekkil', phone: '', email: '', notes: '' });
  const [editId, setEditId] = useState(null);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setContacts(contacts.map(c => c.id === editId ? { ...form, id: editId } : c));
    } else {
      setContacts([...contacts, { ...form, id: Date.now() }]);
    }
    setForm({ name: '', type: 'Müvekkil', phone: '', email: '', notes: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Kişi silinsin mi?')) setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><User /> Rehber</h2>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', type: 'Müvekkil', phone: '', email: '', notes: '' }); }}><Plus size={16}/> Yeni Kişi</Button>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border divide-y">
        {filtered.length === 0 && <div className="p-6 text-center text-gray-400">Kayıt yok.</div>}
        {filtered.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
            <div className="flex-1">
              <div className="font-semibold text-slate-800 flex items-center gap-2">{c.name} <span className="text-xs bg-slate-100 border px-2 py-0.5 rounded-full">{c.type}</span></div>
              <div className="text-xs text-slate-500 flex gap-4 mt-1">
                <span><Phone size={12} className="inline mr-1" />{c.phone}</span>
                <span><Mail size={12} className="inline mr-1" />{c.email}</span>
              </div>
              {c.notes && <div className="text-xs text-slate-400 mt-1">{c.notes}</div>}
            </div>
            <Button size="icon" variant="ghost" onClick={() => handleEdit(c)}><Edit2 size={16}/></Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 size={16}/></Button>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="font-bold mb-4">{editId ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}</h3>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Ad Soyad" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select className="w-full border rounded px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Müvekkil</option>
                <option>Karşı Avukat</option>
                <option>Uzman</option>
              </select>
              <input className="w-full border rounded px-3 py-2" placeholder="Telefon" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input className="w-full border rounded px-3 py-2" placeholder="E-posta" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <textarea className="w-full border rounded px-3 py-2" placeholder="Notlar" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button onClick={() => setShowForm(false)} variant="outline">Vazgeç</Button>
              <Button onClick={handleSave}>{editId ? 'Kaydet' : 'Ekle'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
