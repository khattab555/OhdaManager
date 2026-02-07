import React, { useState, useRef, useEffect } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { User as UserIcon, LogOut, FileText, Camera, Hash } from 'lucide-react';
import { Notifications } from './Notifications';
import { useTranslation } from 'react-i18next';

export const LogViewer: React.FC = () => {
  const { logs, currentUser, logout, updateUserAvatar } = useOhdaStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
        // Basic validation
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('Image size must be less than 2MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = async () => {
             const base64 = reader.result as string;
             await updateUserAvatar(currentUser.username, base64);
        };
        reader.readAsDataURL(file);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div 
             className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-xl cursor-pointer relative group overflow-hidden w-10 h-10 flex items-center justify-center transition-all hover:ring-2 hover:ring-blue-300 shadow-sm border border-blue-200"
             onClick={handleAvatarClick}
             title="Change Avatar"
           >
             {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <Hash className="w-6 h-6 text-blue-700" />
             )}
             <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center">
                <Camera className="w-4 h-4 text-white opacity-90" />
             </div>
           </div>
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
           />
           <span className="font-bold text-gray-700">{t('welcome')}, {currentUser.username}</span>
        </div>

        <div className="flex items-center gap-3">
          <Notifications />
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">{t('actions.logs')}</span>
              {logs.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {logs.length > 99 ? '99+' : logs.length}
                </span>
              )}
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 font-bold text-gray-700 sticky top-0 bg-white">
                  {t('actions.logs')}
                </div>
                <div className="divide-y divide-gray-50">
                  {logs.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No logs yet</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className={`p-3 hover:bg-gray-50 transition-colors ${log.isForced ? 'bg-orange-50 border-r-4 border-orange-500' : ''}`}>
                        <p className={`text-sm font-medium mb-1 ${log.isForced ? 'text-orange-800' : 'text-gray-800'}`}>
                          {log.action}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded">
                            <UserIcon className="w-3 h-3" />
                            {log.username}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleTimeString('ar-AE', { hour: '2-digit', minute:'2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 text-left" dir="ltr">
                            {new Date(log.timestamp).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-300 mx-1"></div>

          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {t('actions.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};