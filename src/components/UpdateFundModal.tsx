import React, { useState, useRef, useEffect } from 'react';
import { Wallet, X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useTranslation } from 'react-i18next';

interface UpdateFundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateFundModal: React.FC<UpdateFundModalProps> = ({ isOpen, onClose }) => {
  const { totalFund, remainingFund, updateTotalFund, requestFundUpdate, currentUser, loading } = useOhdaStore();
  const [newTotalFund, setNewTotalFund] = useState(totalFund.toString());
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // File Upload State
  const [receipt, setReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setIsSuccess(false);
        setNewTotalFund(totalFund.toString());
        setReceipt(null);
        setFileName(null);
    }
  }, [isOpen, totalFund]);

  if (!isOpen) return null;

  const usedAmount = totalFund - remainingFund;
  const newFundNum = parseFloat(newTotalFund);
  const newRemaining = isNaN(newFundNum) ? 0 : newFundNum - usedAmount;
  const isValid = !isNaN(newFundNum) && newRemaining >= 0 && newFundNum > 0 && !!receipt;
  const isAdmin = currentUser?.username === 'admin';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large (max 5MB)');
        return;
      }
      
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      if (isAdmin) {
          await updateTotalFund(newFundNum, receipt || undefined);
          onClose();
      } else {
          const success = await requestFundUpdate(newFundNum, receipt || undefined);
          if (success) {
              setIsSuccess(true);
          } else {
              alert('حدث خطأ أثناء إرسال الطلب. يرجى التأكد من تشغيل كود SQL المطلوب في قاعدة البيانات.');
          }
      }
    }
  };

  if (isSuccess) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-600 mb-6">
                    تم إرسال طلب تحديث العهدة إلى مدير النظام للموافقة.
                </p>
                <button 
                    onClick={onClose}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    حسناً
                </button>
            </div>
        </div>
    );
  }

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
                {(isNaN(newFundNum) || newRemaining < 0 || newFundNum <= 0) 
                    ? t('modals.updateFund.error', { amount: usedAmount })
                    : !receipt 
                        ? t('modals.updateFund.receiptRequired')
                        : ''
                }
              </p>
            )}
            {isValid && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                {t('modals.updateFund.newBalance')}: <span className="font-bold">{newRemaining.toLocaleString()} د.إ</span>
              </p>
            )}
          </div>

          {/* PDF Upload Section - Bond Receipt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سند القبض (إجباري) <span className="text-red-500">*</span>
            </label>
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            
            {!fileName ? (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors group"
                >
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-500 mb-1 transition-colors" />
                    <span className="text-xs text-gray-600 font-medium group-hover:text-blue-600">
                        رفع سند القبض (PDF)
                    </span>
                </button>
            ) : (
                <div className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="bg-white p-1.5 rounded text-red-500">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-blue-800 font-medium truncate max-w-[200px]" dir="ltr">
                            {fileName}
                        </span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => {
                            setReceipt(null);
                            setFileName(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
          </div>

          {!isAdmin && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                      تحتاج لموافقة مدير النظام لتحديث العهدة. سيتم إرسال طلب للمراجعة.
                  </p>
              </div>
          )}

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
              disabled={!isValid || loading}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                isValid 
                  ? (isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700') 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  isAdmin ? t('actions.save') : 'إرسال طلب التحديث'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};