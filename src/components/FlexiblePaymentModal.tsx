import React, { useState, useRef, useEffect } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useTranslation } from 'react-i18next';
import { X, Upload, FileText, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface FlexiblePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  remainingBalance: number;
}

export const FlexiblePaymentModal: React.FC<FlexiblePaymentModalProps> = ({ isOpen, onClose, loanId, remainingBalance }) => {
  const { payFlexibleLoan } = useOhdaStore();
  const { t } = useTranslation();
  
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setIsSubmitting(false);
        setIsSuccess(false);
        setReceipt(null);
        setFileName(null);
        setAmount('');
        setPaymentType('full');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    
    if (!receipt) return;

    let paymentAmount = 0;
    if (paymentType === 'full') {
        paymentAmount = remainingBalance;
    } else {
        paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0 || paymentAmount > remainingBalance) {
            alert('الرجاء إدخال مبلغ صحيح');
            return;
        }
    }

    setIsSubmitting(true);
    try {
        await payFlexibleLoan(loanId, paymentAmount, receipt);
        setIsSuccess(true);
    } catch (error) {
        console.error(error);
        alert('Failed to process payment');
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">تم السداد بنجاح!</h3>
                <p className="text-gray-600 mb-6">
                    تم تسجيل الدفعة وتحديث الرصيد المتبقي.
                </p>
                <button 
                    onClick={() => {
                        setIsSuccess(false);
                        setReceipt(null);
                        setFileName(null);
                        setAmount('');
                        setPaymentType('full');
                        onClose();
                    }}
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
            <DollarSign className="w-5 h-5 text-blue-600" />
            سداد دفعة مرنة
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Date (Read Only) */}
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ السداد</label>
              <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{new Date().toLocaleDateString('ar-AE')}</span>
              </div>
          </div>

          {/* Payment Type */}
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">خيار السداد</label>
              <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${paymentType === 'full' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                          type="radio" 
                          name="paymentType" 
                          value="full" 
                          checked={paymentType === 'full'} 
                          onChange={() => setPaymentType('full')}
                          className="hidden" 
                      />
                      <span className="font-medium">سداد كامل</span>
                  </label>
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${paymentType === 'partial' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                          type="radio" 
                          name="paymentType" 
                          value="partial" 
                          checked={paymentType === 'partial'} 
                          onChange={() => setPaymentType('partial')}
                          className="hidden" 
                      />
                      <span className="font-medium">مبلغ محدد</span>
                  </label>
              </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المراد دفعه</label>
              <div className="relative">
                  <input
                      type="number"
                      value={paymentType === 'full' ? remainingBalance : amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={paymentType === 'full'}
                      className={`block w-full px-4 py-3 border rounded-lg transition-colors text-lg font-bold text-gray-800 ${paymentType === 'full' ? 'bg-gray-100 border-gray-200' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                      placeholder="أدخل المبلغ"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">د.إ</span>
              </div>
              {paymentType === 'full' && (
                  <p className="text-xs text-gray-500 mt-1">سيتم سداد كامل المتبقي ({remainingBalance.toLocaleString()} د.إ)</p>
              )}
          </div>

          {/* Receipt Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سند الدفع (إجباري) <span className="text-red-500">*</span>
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
                        رفع سند الدفع (PDF)
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!receipt || isSubmitting || (paymentType === 'partial' && (!amount || parseFloat(amount) <= 0))}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
                !receipt || isSubmitting || (paymentType === 'partial' && (!amount || parseFloat(amount) <= 0))
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'جاري السداد...' : 'تأكيد السداد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
