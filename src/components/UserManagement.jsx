import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Shield, User, Mail, Plus, Edit2 } from 'lucide-react';

// Mock: Kullanıcı listesi
const mockUsers = [
  { id: '1', email: 'admin@site.com', full_name: 'Admin Kullanıcı', role: 'admin' },
  { id: '2', email: 'personel@site.com', full_name: 'Personel Kullanıcı', role: 'user' }
];

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  // Kullanıcı ekle
  const handleAddUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...users, { id: Date.now().toString(), email, full_name: fullName, role }]);
      setEmail('');
      setFullName('');
      setRole('user');
      setLoading(false);
    }, 1000);
  };

  // Rol değiştir
  const handleChangeRole = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  if (!isAdmin) {
    return <div className="p-6 text-center text-gray-500">Sadece admin kullanıcılar erişebilir.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shield size={20}/> Kullanıcı Yönetimi</h2>
      <div className="mb-6 flex gap-2">
        <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" />
        <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ad Soyad" />
        <select value={role} onChange={e => setRole(e.target.value)} className="border rounded-lg px-2 py-1">
          <option value="user">Personel</option>
          <option value="admin">Yönetici</option>
        </select>
        <Button onClick={handleAddUser} disabled={loading || !email || !fullName} className="flex items-center gap-1">
          <Plus size={16}/> Ekle
        </Button>
      </div>
      <table className="w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Ad Soyad</th>
            <th className="p-2 text-left">E-posta</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.full_name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select value={u.role} onChange={e => handleChangeRole(u.id, e.target.value)} className="border rounded-lg px-2 py-1">
                  <option value="user">Personel</option>
                  <option value="admin">Yönetici</option>
                </select>
              </td>
              <td className="p-2 text-center">
                <Button size="sm" variant="outline" className="flex items-center gap-1"><Edit2 size={14}/> Düzenle</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
