import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOhdaStore } from '../store/useOhdaStore';
import { ArrowRight, Calendar, CheckCircle, Clock, DollarSign, User } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useTranslation } from 'react-i18next';
import { Payment } from '../types';

export const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loans, payInstallment } = useOhdaStore();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [requiresAdminCode, setRequiresAdminCode] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const { t } = useTranslation();
  
  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600 mb-4">{t('loanDetails.notFound')}</p>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline"
        >
          {t('loanDetails.backToHome')}
        </button>
      </div>
    );
  }

  const handlePayClick = (payment: Payment) => {
    // Check if it's too early to pay (before due date)
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    
    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const isEarlyPayment = today < dueDate;

    setSelectedPaymentId(payment.id);
    
    if (isEarlyPayment) {
      setRequiresAdminCode(true);
      setModalTitle(t('loanDetails.earlyPaymentTitle'));
      setModalMessage(t('loanDetails.earlyPaymentMessage'));
    } else {
      setRequiresAdminCode(false);
      setModalTitle(t('loanDetails.confirmPaymentTitle'));
      setModalMessage(t('loanDetails.confirmPaymentMessage'));
    }
    
    setConfirmModalOpen(true);
  };

  const handleConfirmPay = () => {
    if (selectedPaymentId) {
      // Pass requiresAdminCode as the 'isForced' parameter
      payInstallment(loan.id, selectedPaymentId, requiresAdminCode);
      setSelectedPaymentId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <ConfirmModal 
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmPay}
        title={modalTitle}
        message={modalMessage}
        requiresAdminCode={requiresAdminCode}
      />

      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowRight className={`w-5 h-5 ${t('dir') === 'ltr' ? 'rotate-180 mr-1' : 'ml-1'}`} />
        {t('loanDetails.backToHome')}
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <User className="w-6 h-6" />
                {loan.employeeName}
              </h1>
              <p className="opacity-80 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {t('loanDetails.dateAdded')}: {new Date(loan.createdAt).toLocaleDateString('ar-AE')}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm opacity-80">{t('loanDetails.totalAmount')}</p>
              <p className="text-3xl font-bold">{loan.amount.toLocaleString()} د.إ</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">{t('loanDetails.remainingBalance')}</p>
            <p className="text-2xl font-bold text-gray-800">{loan.remainingBalance.toLocaleString()} د.إ</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">{t('loanDetails.monthlyPayment')}</p>
            <p className="text-2xl font-bold text-gray-800">≈ {loan.monthlyPayment.toLocaleString()} د.إ</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        {t('loanDetails.paymentSchedule')}
      </h2>

      <div className="space-y-4">
        {loan.payments.map((payment, index) => {
          // Logic to check if the button should be enabled
          // Button is enabled if:
          // 1. It is the first payment (index === 0)
          // 2. OR The previous payment is already paid (loan.payments[index - 1].status === 'paid')
          const isPreviousPaid = index === 0 || loan.payments[index - 1].status === 'paid';
          const isEnabled = payment.status === 'pending' && isPreviousPaid;

          return (
            <div 
              key={payment.id} 
              className={`bg-white p-4 rounded-lg shadow-sm border-r-4 flex flex-col md:flex-row justify-between items-center gap-4 ${
                payment.status === 'paid' ? 'border-green-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800">{t('loanDetails.payment')} {index + 1}</span>
                  {payment.status === 'paid' ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {t('loanDetails.paid')}
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t('loanDetails.pending')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {t('loanDetails.dueDate')}: {new Date(payment.dueDate).toLocaleDateString('ar-AE')}
                </p>
                {payment.paidAt && (
                  <p className="text-xs text-green-600 mt-1">
                    {t('loanDetails.paidAt')}: {new Date(payment.paidAt).toLocaleDateString('ar-AE')}
                  </p>
                )}
              </div>

              <div className="text-xl font-bold text-gray-800">
                {payment.amount.toLocaleString()} د.إ
              </div>

              {payment.status === 'pending' && (
                <button
                  onClick={() => handlePayClick(payment)}
                  disabled={!isEnabled}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm w-full md:w-auto justify-center ${
                    isEnabled 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!isEnabled ? t('loanDetails.payPreviousFirst') : ""}
                >
                  <DollarSign className="w-4 h-4" />
                  {t('loanDetails.payNow')}
                </button>
              )}
              
              {payment.status === 'paid' && (
                 <button
                  disabled
                  className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed flex items-center gap-2 text-sm w-full md:w-auto justify-center"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t('loanDetails.paid')}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
