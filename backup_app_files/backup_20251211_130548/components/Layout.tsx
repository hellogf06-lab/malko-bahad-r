import { ReactNode, useState } from 'react';
import { 
  Home, Building2, Briefcase, Wallet, Settings, LogOut, Menu, X, Bell, Search, 
  Calendar, BarChart3, FileDown, Eye, Download, Keyboard 
} from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./ModeToggle";
import UserManagement from "./UserManagement";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: any[];
  onToggleNotifications: () => void;
  onOpenAction: (action: string) => void;
}

const Layout = ({ 
  children, activeTab, setActiveTab, 
  notifications, onToggleNotifications, onOpenAction 
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showUserManagement, setShowUserManagement] = useState(false);
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900 text-slate-300 flex flex-col shadow-xl z-30 transition-all duration-300`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950">
          {sidebarOpen ? (
            <div className="flex flex-col animate-in fade-in">
              <span className="font-bold text-lg text-white tracking-wide">M&B HUKUK</span>
              <span className="text-[10px] text-slate-500 uppercase">Yönetim Paneli v2.0</span>
            </div>
          ) : <div className="font-bold text-white mx-auto">M&B</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">
            {sidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
        {/* Menü */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={<Home size={20}/>} label="Genel Bakış" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} isOpen={sidebarOpen}/>
          {sidebarOpen && <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operasyon</div>}
          <SidebarItem icon={<Building2 size={20}/>} label="Kurum Hakedişleri" active={activeTab === 'kurum'} onClick={() => setActiveTab('kurum')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<Briefcase size={20}/>} label="Serbest Dosyalar" active={activeTab === 'dosyalar'} onClick={() => setActiveTab('dosyalar')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<Wallet size={20}/>} label="Ofis Giderleri" active={activeTab === 'giderler'} onClick={() => setActiveTab('giderler')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<User size={20}/>} label="Rehber" active={activeTab === 'rehber'} onClick={() => setActiveTab('rehber')} isOpen={sidebarOpen}/>
          {sidebarOpen && <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Araçlar</div>}
          <SidebarItem icon={<Calendar size={20}/>} label="Ajanda & Takvim" onClick={() => onOpenAction('calendar')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<BarChart3 size={20}/>} label="Gelişmiş Analizler" onClick={() => onOpenAction('analytics')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<FileDown size={20}/>} label="Yedekleme" onClick={() => onOpenAction('backup')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<Download size={20}/>} label="Veri İçe Aktar" onClick={() => onOpenAction('import')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<Eye size={20}/>} label="İşlem Geçmişi" onClick={() => onOpenAction('audit')} isOpen={sidebarOpen}/>
          <SidebarItem icon={<Keyboard size={20}/>} label="Kısayollar" onClick={() => onOpenAction('keyboard')} isOpen={sidebarOpen}/>
        </nav>
        {/* Küçük kullanıcı yönetimi butonu */}
        <div className="flex flex-col items-center p-2 gap-2 border-t border-slate-800 bg-slate-900/50">
          <button
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            title="Kullanıcı Yönetimi"
            onClick={() => setShowUserManagement(true)}
          >
            <User size={20}/>
          </button>
        </div>
        {/* User Footer */}
        <div className="p-4 flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-indigo-600 text-white">EB</AvatarFallback>
            </Avatar>
            {sidebarOpen && <div className="flex-1 overflow-hidden"><p className="text-sm text-white truncate">Evrim Bahadır</p><p className="text-xs text-slate-500">Yönetici</p></div>}
            {sidebarOpen && <LogOut size={18} className="text-slate-400 cursor-pointer hover:text-white"/>}
        </div>
        {/* Kullanıcı yönetimi modalı */}
        {showUserManagement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-700" onClick={() => setShowUserManagement(false)}><X size={20}/></button>
              <h2 className="text-lg font-bold mb-4 text-indigo-700">Kullanıcı Yönetimi</h2>
              {/* UserManagement paneli burada */}
              {/* ...import edilen UserManagement componentini burada render et... */}
              <div id="user-management-panel">
                <UserManagement />
              </div>
            </div>
          </div>
        )}
      </aside>
      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 shadow-sm z-20">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input type="text" placeholder="Dosya, işlem ara... (Ctrl+K)" className="pl-9 bg-slate-50 border-slate-200" />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button onClick={onToggleNotifications} variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </Button>
            <Button onClick={() => onOpenAction('settings')} variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100"><Settings size={20} /></Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function SidebarItem({ icon, label, active, onClick, isOpen }: any) {
  return (
    <button onClick={onClick} className={`group flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium rounded-lg transition-all ${active ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800 hover:text-white"} ${!isOpen && 'justify-center px-0'}`}>
      <span className={active ? "scale-110" : "group-hover:scale-110"}>{icon}</span>
      {isOpen && <span>{label}</span>}
    </button>
  );
}

export default Layout;
