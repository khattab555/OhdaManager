import React, { useState, useRef, useEffect } from 'react';
import { Settings, Wallet, FileBarChart, ChevronDown, Globe } from 'lucide-react';
import { ReportsModal } from './ReportsModal';
import { LanguageModal } from './LanguageModal';
import { useTranslation } from 'react-i18next';

interface ActionMenuProps {
  onOpenFundModal: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onOpenFundModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-1">
              <button
                onClick={() => {
                  onOpenFundModal();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
              >
                <div className="bg-blue-100 p-1.5 rounded-md">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{t('actions.maxFund')}</span>
                  <span className="text-[10px] text-gray-400">{t('actions.maxFundDesc')}</span>
                </div>
              </button>

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
            </div>
          </div>
        )}
      </div>
    </>
  );
};