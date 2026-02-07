import React, { useState, useRef, useEffect } from 'react';
import { Settings, Wallet, FileBarChart, ChevronDown, Globe, Archive, AlertTriangle, Users, Edit } from 'lucide-react';
import { ReportsModal } from './ReportsModal';
import { LanguageModal } from './LanguageModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOhdaStore } from '../store/useOhdaStore';

interface ActionMenuProps {
  // onOpenFundModal removed as it is no longer used
}

export const ActionMenu: React.FC<ActionMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useOhdaStore();
  const isViewer = currentUser?.role === 'viewer';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.username === 'admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <ReportsModal 
        isOpen={isReportsModalOpen} 
        onClose={() => setIsReportsModalOpen(false)} 
      />
      
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
      
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium"
        >
          <Settings className="w-5 h-5 text-gray-500" />
          <span>{t('actions.action')}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/users');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors mb-1"
                >
                  <div className="bg-indigo-100 p-1.5 rounded-md">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{t('actions.users')}</span>
                    <span className="text-[10px] text-gray-400">{t('actions.usersDesc')}</span>
                  </div>
                </button>
              )}

              {!isViewer && (
              <button
                onClick={() => {
                  navigate('/fund-settings');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
              >
                <div className="bg-blue-100 p-1.5 rounded-md">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{t('actions.fundSettings')}</span>
                  <span className="text-[10px] text-gray-400">{t('fundSettings.subtitle')}</span>
                </div>
              </button>
              )}

              <button
                onClick={() => {
                  setIsReportsModalOpen(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors mt-1"
              >
                <div className="bg-green-100 p-1.5 rounded-md">
                  <FileBarChart className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{t('actions.reports')}</span>
                  <span className="text-[10px] text-gray-400">{t('actions.reportsDesc')}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  navigate('/archive');
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors mt-1"
              >
                <div className="bg-orange-100 p-1.5 rounded-md">
                  <Archive className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{t('actions.archive')}</span>
                  <span className="text-[10px] text-gray-400">{t('actions.archiveDesc')}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsLanguageModalOpen(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors mt-1"
              >
                <div className="bg-purple-100 p-1.5 rounded-md">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{t('actions.language')}</span>
                  <span className="text-[10px] text-gray-400">{t('actions.languageDesc')}</span>
                </div>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/data-correction');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 rounded-md transition-colors mt-1"
                >
                  <div className="bg-yellow-100 p-1.5 rounded-md">
                    <Edit className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{t('actions.dataCorrection')}</span>
                    <span className="text-[10px] text-gray-400">{t('actions.dataCorrectionDesc')}</span>
                  </div>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/reset-system');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors mt-1 border-t border-gray-100"
                >
                  <div className="bg-red-100 p-1.5 rounded-md">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm text-red-600">{t('actions.resetSystem')}</span>
                    <span className="text-[10px] text-gray-400">{t('resetSystem.subtitle')}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};