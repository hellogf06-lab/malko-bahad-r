import React from 'react';
import { LogOut, User, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hukuk Bürosu Mali Takip Sistemi</h1>
          <p className="text-blue-100">Profesyonel Muhasebe ve İcra Takip Yönetimi</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
            {isAdmin ? <Shield size={18} /> : <UserCircle size={18} />}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
              <span className="text-xs text-blue-300">
                {isAdmin ? 'Yönetici' : 'Personel'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            title="Çıkış Yap"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Çıkış</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
