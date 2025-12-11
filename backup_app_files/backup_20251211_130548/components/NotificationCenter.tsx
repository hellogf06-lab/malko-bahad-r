import { X, CheckCircle, AlertTriangle, Info, Bell, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationCenterProps {
  notifications: any[];
  onClose: () => void;
  onClear: () => void;
}

export function NotificationCenter({ notifications, onClose, onClear }: NotificationCenterProps) {
  return (
    <div className="absolute top-16 right-4 w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Başlık */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Bell size={18} className="text-indigo-600" />
          Bildirimler
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X size={16} />
        </Button>
      </div>
      {/* Liste */}
      <ScrollArea className="h-[400px] p-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
            <Bell size={40} className="mb-2 opacity-20" />
            <p className="text-sm">Okunmamış bildirim yok</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => (
              <div key={i} className={`p-3 rounded-lg border flex gap-3 items-start transition-all hover:bg-slate-50 ${
                notif.type === 'error' ? 'bg-red-50/50 border-red-100' :
                notif.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                notif.type === 'success' ? 'bg-emerald-50/50 border-emerald-100' :
                'bg-white border-slate-100'
              }`}>
                <div className="mt-0.5">
                  {notif.type === 'error' && <AlertTriangle size={18} className="text-red-500" />}
                  {notif.type === 'warning' && <Clock size={18} className="text-amber-500" />}
                  {notif.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                  {notif.type === 'info' && <Info size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 leading-snug">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                    {notif.priority === 1 ? 'Kritik' : notif.priority === 2 ? 'Yüksek' : 'Bilgi'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={onClear}>
            Tümünü Temizle
          </Button>
        </div>
      )}
    </div>
  );
}
