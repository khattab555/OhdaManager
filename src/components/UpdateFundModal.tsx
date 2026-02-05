import React, { useState } from 'react';
import { Wallet, X } from 'lucide-react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useTranslation } from 'react-i18next';

interface UpdateFundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateFundModal: React.FC<UpdateFundModalProps> = ({ isOpen, onClose }) => {
  const { totalFund, remainingFund, updateTotalFund } = useOhdaStore();
  const [newTotalFund, setNewTotalFund] = useState(totalFund.toString());
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const usedAmount = totalFund - remainingFund;
  const newFundNum = parseFloat(newTotalFund);
  const newRemaining = isNaN(newFundNum) ? 0 : newFundNum - usedAmount;
  const isValid = !isNaN(newFundNum) && newRemaining >= 0 && newFundNum > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      updateTotalFund(newFundNum);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            {t('modals.updateFund.title')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">{t('modals.updateFund.currentFund')}:</span>
              <span className="font-bold text-gray-800">{totalFund.toLocaleString()} د.إ</span>
            </div>
            <div className="flex justify-between items-center text-red-600 text-sm">
              <span>{t('modals.updateFund.usedAmount')}:</span>
              <span>{usedAmount.toLocaleString()} د.إ</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('modals.updateFund.newMax')}
            </label>
            <div className="relative">
              <input
                type="number"
                value={newTotalFund}
                onChange={(e) => setNewTotalFund(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-bold text-gray-800"
                placeholder={t('modals.updateFund.placeholder')}
                min={usedAmount}
                step="100"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">د.إ</span>
            </div>
            {!isValid && (
              <p className="text-red-500 text-xs mt-2">
                {t('modals.updateFund.error', { amount: usedAmount })}
              </p>
            )}
            {isValid && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                {t('modals.updateFund.newBalance')}: <span className="font-bold">{newRemaining.toLocaleString()} د.إ</span>
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm ${
                isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};