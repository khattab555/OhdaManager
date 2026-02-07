import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, Lock, Upload, FileText, Archive, CheckCircle } from 'lucide-react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (receipt?: string) => void;
  title: string;
  message: string;
  requiresAdminCode?: boolean;
  isArchiveMode?: boolean;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  showFileUpload?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  requiresAdminCode = false,
  isArchiveMode = false,
  variant = 'default',
  showFileUpload,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyAdminCode } = useOhdaStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const shouldShowFileUpload = showFileUpload !== undefined ? showFileUpload : !isArchiveMode;

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
      setError('');
      setReceipt(null);
      setFileName(null);
    }
  }, [isOpen]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('يرجى اختيار ملف PDF فقط');
        return;
      }
      
      // Limit file size to 5MB (now supported by Supabase)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
          setError('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.');
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
        setFileName(file.name);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (requiresAdminCode) {
      const fullCode = code.join('');
      if (fullCode.length !== 6) {
        setError('الرجاء إدخال الكود كاملاً');
        return;
      }
      
      if (!verifyAdminCode(fullCode)) {
        setError('الكود غير صحيح');
        return;
      }
    }

    if (shouldShowFileUpload && !receipt) {
        setError(t('loanDetails.receiptRequired'));
        return;
    }
    
    setIsSubmitting(true);
    try {
        await onConfirm(receipt);
        onClose();
    } catch (e) {
        console.error(e);
        setError('حدث خطأ أثناء التنفيذ');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {variant === 'success' ? (
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-50">
               <CheckCircle className="w-8 h-8 text-green-600" />
             </div>
          ) : variant === 'danger' ? (
             <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50">
               <AlertTriangle className="w-8 h-8 text-red-600" />
             </div>
          ) : isArchiveMode ? (
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-orange-50">
              <Archive className="w-8 h-8 text-orange-600" />
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${requiresAdminCode ? 'bg-red-50' : 'bg-blue-50'}`}>
              {requiresAdminCode ? (
                <Lock className="w-8 h-8 text-red-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              )}
            </div>
          )}
          <p className="text-gray-600 text-lg mb-4">{message}</p>
          
          {requiresAdminCode && (
            <div className="w-full mb-6">
              <p className="text-sm text-gray-500 mb-3">أدخل كود مدير النظام للمتابعة</p>
              <div className="flex justify-center gap-2 mb-2" dir="ltr">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                ))}
              </div>
            </div>
          )}

          {/* PDF Upload Section - Only show if enabled */}
          {shouldShowFileUpload && (
            <div className="w-full mb-2">
              <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
              />
              
              {!fileName ? (
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-400 transition-colors group"
                  >
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                      <span className="text-sm text-gray-600 font-medium group-hover:text-blue-600">
                          {t('loanDetails.uploadReceipt')}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PDF Only</span>
                  </button>
              ) : (
                  <div className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <div className="bg-white p-1.5 rounded text-red-500">
                              <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-blue-800 font-medium truncate max-w-[200px]" dir="ltr">
                              {fileName}
                          </span>
                      </div>
                      <button 
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
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          )}
          
          {!requiresAdminCode && !error && (
            <p className="text-sm text-gray-500 mt-2">لا يمكن التراجع عن هذه العملية بعد التأكيد</p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[100px]"
          >
            {t('actions.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm min-w-[100px] flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : variant === 'success' ? 'bg-green-600 hover:bg-green-700'
                : variant === 'danger' ? 'bg-red-600 hover:bg-red-700'
                : isArchiveMode 
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : requiresAdminCode 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري...</span>
              </>
            ) : (
              t('actions.confirm')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};