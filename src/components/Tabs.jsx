import React from 'react';
import { Download, BarChart3, FileText, Building2, Wallet } from 'lucide-react';
import { Button } from './ui/button';

const Tabs = ({ activeTab, setActiveTab, excelIndir }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'dosyalar', label: 'Dosya Takip', icon: FileText },
    { id: 'kurum', label: 'Kurum Avukatlığı', icon: Building2 },
    { id: 'giderler', label: 'Büro Giderleri', icon: Wallet }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto border border-gray-200">
      {tabs.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          onClick={() => setActiveTab(id)}
          variant={activeTab === id ? 'default' : 'ghost'}
          size="sm"
          className={`flex items-center gap-2 ${
            activeTab === id 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon size={16} />
          {label}
        </Button>
      ))}

      <Button
        onClick={excelIndir}
        className="ml-auto bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
        size="sm"
      >
        <Download size={16} /> Excel İndir
      </Button>
    </div>
  );
};

export default Tabs;
