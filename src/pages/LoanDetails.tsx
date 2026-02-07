import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOhdaStore } from '../store/useOhdaStore';
import { ArrowRight, Calendar, CheckCircle, Clock, User, Archive, DollarSign, FileText } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { PDFViewerModal } from '../components/PDFViewerModal';
import { FlexiblePaymentModal } from '../components/FlexiblePaymentModal';
import { DirhamSign } from '../components/icons/DirhamSign';
import { useTranslation } from 'react-i18next';
import { Payment } from '../types';

export const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromArchive = location.state?.from === 'archive';
  const { loans, archivedLoans, payInstallment, archiveLoan, currentUser } = useOhdaStore(); // Add archivedLoans
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [requiresAdminCode, setRequiresAdminCode] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isArchiveMode, setIsArchiveMode] = useState(false);
  const [flexibleModalOpen, setFlexibleModalOpen] = useState(false);
  
  // New state for PDF Viewer
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfData, setCurrentPdfData] = useState<string | null>(null);

  const { t } = useTranslation();
  const isViewer = currentUser?.role === 'viewer';
  
  // Try to find loan in active loans first, then in archive
  let loan = loans.find((l) => l.id === id);
  const isArchived = !loan && (archivedLoans || []).some((l) => l.id === id);
  
  if (!loan && isArchived) {
      loan = archivedLoans.find((l) => l.id === id);
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-600 mb-4">{t('loanDetails.notFound')}</p>
        <button 
          onClick={() => fromArchive ? navigate('/archive') : navigate('/')}
          className="text-blue-600 hover:underline"
        >
          {fromArchive ? t('loanDetails.backToArchive') : t('loanDetails.backToHome')}
        </button>
      </div>
    );
  }

  const handlePayClick = (payment: Payment) => {
    setIsArchiveMode(false); // Ensure archive mode is off for payments
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

  const handleArchiveClick = () => {
    setIsArchiveMode(true);
    setRequiresAdminCode(false); // No admin code needed for archiving
    setModalTitle(t('loans.archiveLoan'));
    setModalMessage(t('modals.archiveConfirm'));
    setConfirmModalOpen(true);
  };

  const handleConfirmPay = (receipt?: string) => {
    if (isArchiveMode) {
        archiveLoan(loan.id);
        navigate('/'); // Redirect to dashboard after archiving
    } else if (selectedPaymentId) {
      // Pass requiresAdminCode as the 'isForced' parameter
      payInstallment(loan.id, selectedPaymentId, requiresAdminCode, receipt);
      setSelectedPaymentId(null);
    }
  };

  const handleViewReceipt = (receiptUrl: string) => {
    setCurrentPdfData(receiptUrl);
    setPdfViewerOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <ConfirmModal 
        key={isArchiveMode ? 'archive' : selectedPaymentId || 'default'} // Force re-render on mode change
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmPay}
        title={modalTitle}
        message={modalMessage}
        requiresAdminCode={requiresAdminCode}
        isArchiveMode={isArchiveMode}
      />

      <PDFViewerModal
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        pdfData={currentPdfData}
        title={t('loanDetails.viewReceipt')}
      />

      <button 
        onClick={() => fromArchive ? navigate('/archive') : navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowRight className={`w-5 h-5 ${t('dir') === 'ltr' ? 'rotate-180 mr-1' : 'ml-1'}`} />
        {fromArchive ? t('loanDetails.backToArchive') : t('loanDetails.backToHome')}
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className={`p-6 text-white ${isArchived ? 'bg-orange-600' : 'bg-blue-600'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <User className="w-6 h-6" />
                {loan.employeeName}
                {isArchived && (
                  <span className="bg-orange-500/20 text-orange-100 text-xs px-2 py-1 rounded-full border border-orange-500/30 flex items-center gap-1">
                    <Archive className="w-3 h-3" />
                    {t('actions.archive')}
                  </span>
                )}
              </h1>
              <p className="opacity-80 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {t('loanDetails.dateAdded')}: {new Date(loan.createdAt).toLocaleDateString('ar-AE')}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm opacity-80">{t('loanDetails.totalAmount')}</p>
              <p className="text-3xl font-bold">{loan.amount.toLocaleString()} د.إ</p>
              
              {!isViewer && loan.remainingBalance === 0 && !isArchived && (
                <button
                  onClick={handleArchiveClick}
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm backdrop-blur-sm"
                >
                  <Archive className="w-4 h-4" />
                  {t('actions.archive')}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">{t('loanDetails.remainingBalance')}</p>
            <p className="text-2xl font-bold text-gray-800">{loan.remainingBalance.toLocaleString()} د.إ</p>
          </div>
          {loan.loanType !== 'flexible' && (
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">{t('loanDetails.monthlyPayment')}</p>
                <p className="text-2xl font-bold text-gray-800">≈ {loan.monthlyPayment.toLocaleString()} د.إ</p>
            </div>
          )}
        </div>
      </div>

      {loan.loanType === 'flexible' ? (
          <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    سجل الدفعات
                </h2>
                {!isViewer && !isArchived && loan.remainingBalance > 0 && (
                    <button
                        onClick={() => setFlexibleModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <DollarSign className="w-5 h-5" />
                        سداد دفعة
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loan.payments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        لا يوجد دفعات مسجلة حتى الآن
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-600">دفعة بتاريخ</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">المبلغ</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">السند</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loan.payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-800">
                                            {new Date(payment.paidAt!).toLocaleDateString('ar-AE')}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">
                                            {payment.amount.toLocaleString()} د.إ
                                        </td>
                                        <td className="p-4">
                                            {payment.receipt && (
                                                <button 
                                                    onClick={() => handleViewReceipt(payment.receipt!)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    عرض السند
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          </>
      ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                {t('loanDetails.paymentSchedule')}
            </h2>

            <div className="space-y-4">
                {loan.payments.map((payment, index) => {
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
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="text-xs text-green-600">
                            {t('loanDetails.paidAt')}: {new Date(payment.paidAt).toLocaleDateString('ar-AE')}
                            </p>
                        </div>
                        )}
                    </div>

                    <div className="text-xl font-bold text-gray-800">
                        {payment.amount.toLocaleString()} د.إ
                    </div>

                    {!isViewer && payment.status === 'pending' && !isArchived && (
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
                        <DirhamSign className="w-4 h-4" />
                        {t('loanDetails.payNow')}
                        </button>
                    )}
                    
                    {payment.status === 'paid' && (
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <button
                            disabled
                            className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed flex items-center gap-2 text-sm w-full justify-center"
                            >
                            <CheckCircle className="w-4 h-4" />
                            {t('loanDetails.paid')}
                            </button>
                            
                            {payment.receipt && (
                                <button 
                                    onClick={() => handleViewReceipt(payment.receipt!)}
                                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center justify-center gap-1 font-medium transition-colors"
                                >
                                    {t('loanDetails.viewReceipt')}
                                </button>
                            )}
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
          </>
      )}
      <FlexiblePaymentModal 
        isOpen={flexibleModalOpen}
        onClose={() => setFlexibleModalOpen(false)}
        loanId={loan.id}
        remainingBalance={loan.remainingBalance}
      />
    </div>
  );
};
