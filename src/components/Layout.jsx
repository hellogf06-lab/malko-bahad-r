import React, { useState } from 'react';
import { 
  Home, 
  Building2, 
  Briefcase, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Calendar,
  BarChart3,
  FileDown,
  Eye,
  Download
} from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      
      {/* --- SOL SIDEBAR --- */}
      <aside 
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-slate-300 flex flex-col shadow-xl z-30 transition-all duration-300 ease-in-out`}
      >
        {/* Logo Alanı */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950">
          {sidebarOpen ? (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="font-bold text-lg text-white tracking-wide truncate">M&B HUKUK</span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Yönetim Paneli</span>
            </div>
          ) : (
            <div className="font-bold text-white mx-auto">M&B</div>
          )}
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Genel Bakış" 
            id="dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            isOpen={sidebarOpen}
          />
          
          {sidebarOpen && <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operasyon</div>}
          
          <SidebarItem 
            icon={<Building2 size={20} />} 
            label="Kurum Hakedişleri" 
            id="kurum" 
            isActive={activeTab === 'kurum'} 
            onClick={() => setActiveTab('kurum')}
            isOpen={sidebarOpen}
          />
          <SidebarItem 
            icon={<Briefcase size={20} />} 
            label="Serbest Dosyalar" 
            id="dosyalar" 
            isActive={activeTab === 'dosyalar'} 
            onClick={() => setActiveTab('dosyalar')}
            isOpen={sidebarOpen}
          />
          
          {sidebarOpen && <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Finans</div>}
          
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Ofis Giderleri" 
            id="giderler" 
            isActive={activeTab === 'giderler'} 
            onClick={() => setActiveTab('giderler')}
            isOpen={sidebarOpen}
          />

          {/* Gelişmiş Özellikler */}
          {sidebarOpen && <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Araçlar</div>}
          
          <SidebarItem 
            icon={<Calendar size={20} />} 
            label="Ajanda & Takvim" 
            id="ajanda" 
            isActive={activeTab === 'ajanda'} 
            onClick={() => setActiveTab('ajanda')} 
            isOpen={sidebarOpen} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Raporlar" 
            id="analitik" 
            isActive={activeTab === 'analitik'} 
            onClick={() => setActiveTab('analitik')} 
            isOpen={sidebarOpen} 
          />
        </nav>

        {/* Alt Kullanıcı Alanı */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <Avatar className="h-9 w-9 border border-slate-700">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white">EB</AvatarFallback>
            </Avatar>
            
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                <p className="text-sm font-medium text-white truncate">Evrim Bahadır</p>
                <p className="text-xs text-slate-500 truncate">Yönetici Avukat</p>
              </div>
            )}
            
            {sidebarOpen && (
              <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-md">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* --- SAĞ ANA İÇERİK ALANI --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
        
        {/* Üst Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 shadow-sm z-20">
          
          {/* Arama Çubuğu */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              type="text" 
              placeholder="Dosya, müvekkil veya işlem ara... (Ctrl+K)" 
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all"
            />
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100">
              <Settings size={20} />
            </Button>
          </div>
        </header>

        {/* Kaydırılabilir İçerik */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Yardımcı Bileşen: Menü Elemanı
function SidebarItem({ icon, label, id, isActive, onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium rounded-lg transition-all duration-200 border border-transparent ${
        isActive
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700/50"
      } ${!isOpen && 'justify-center px-0'}`}
      title={!isOpen ? label : undefined}
    >
      <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
        {icon}
      </span>
      {isOpen && <span className="truncate">{label}</span>}
      {isActive && isOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
    </button>
  );
}

export default Layout;
