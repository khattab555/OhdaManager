import React, { useState } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoanForm: React.FC = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [installmentOption, setInstallmentOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [shake, setShake] = useState(false);
  const { addLoan, remainingFund } = useOhdaStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !amount || isSubmitting) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    if (amountNum > remainingFund) {
      alert('المبلغ المطلوب أكبر من الرصيد المتبقي');
      return;
    }

    if (!installmentOption) {
      setShowError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      let count = 1;
      let type: 'regular' | 'salary_advance' | 'flexible' = 'regular';

      if (installmentOption === 'custom') {
        count = 0; // Flexible loans don't have initial installments
        type = 'flexible';
      } else {
        count = parseInt(installmentOption);
        type = 'regular';
      }

      await addLoan(employeeName, amountNum, count, type);
      setEmployeeName('');
      setAmount('');
      setInstallmentOption('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-blue-600" />
        {t('loans.addLoan')}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('loans.employeeName')}</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('loans.employeeName')}
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('loans.amount')} (د.إ)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('loans.amount')}
            min="1"
            max={remainingFund}
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('loans.loanType')}</label>
          <select
            value={installmentOption}
            onChange={(e) => {
                setInstallmentOption(e.target.value);
                setShowError(false);
            }}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                showError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
            } ${shake ? 'animate-shake' : ''}`}
          >
            <option value="" disabled>_____</option>
            <option value="1">{t('loans.onePayment')}</option>
            <option value="2">{t('loans.twoPayments')}</option>
            <option value="3">{t('loans.threePayments')}</option>
            <option value="custom">{t('loans.flexiblePayments')}</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium min-w-[120px] ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الإضافة...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              {t('actions.add')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};
