import React, { useState } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useNavigate } from 'react-router-dom';
import { Archive as ArchiveIcon, Search, RotateCcw, ChevronLeft, ArrowRight, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../components/ConfirmModal';

export const Archive: React.FC = () => {
  const { archivedLoans = [], unarchiveLoan, deleteLoan, approveDeletion, rejectDeletion, currentUser } = useOhdaStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const isViewer = currentUser?.role === 'viewer';
  const isAdmin = currentUser?.role === 'admin' || currentUser?.username === 'admin';
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'restore' | 'delete' | 'approve' | 'reject' | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const filteredLoans = (archivedLoans || []).filter(loan => 
    loan.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (e: React.MouseEvent, loanId: string, type: 'restore' | 'delete' | 'approve' | 'reject') => {
    e.stopPropagation();
    setSelectedLoanId(loanId);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedLoanId || !actionType) return;

    if (actionType === 'restore') {
      unarchiveLoan(selectedLoanId);
    } else if (actionType === 'delete') {
      deleteLoan(selectedLoanId);
    } else if (actionType === 'approve') {
      approveDeletion(selectedLoanId);
    } else if (actionType === 'reject') {
      rejectDeletion(selectedLoanId);
    }
    
    setModalOpen(false);
    setSelectedLoanId(null);
    setActionType(null);
  };

  const handleApprove = (e: React.MouseEvent, loanId: string) => {
      handleActionClick(e, loanId, 'approve');
  }

  const handleReject = (e: React.MouseEvent, loanId: string) => {
      handleActionClick(e, loanId, 'reject');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowRight className={`w-5 h-5 ${t('dir') === 'ltr' ? 'rotate-180 mr-1' : 'ml-1'}`} />
        {t('loanDetails.backToHome')}
      </button>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ArchiveIcon className="w-6 h-6 text-orange-600" />
            {t('archive.title')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t('archive.subtitle')}</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={t('archive.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <Search className={`absolute top-2.5 w-4 h-4 text-gray-400 ${t('dir') === 'ltr' ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      {filteredLoans.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <ArchiveIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('archive.empty')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.employeeName')}</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.amount')}</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.date')}</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.completedDate')}</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.installments')}</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => {
                  const lastPayment = [...loan.payments]
                    .filter(p => p.status === 'paid')
                    .sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())[0];
                  
                  const completionDate = lastPayment?.paidAt 
                    ? new Date(lastPayment.paidAt).toLocaleDateString('ar-AE')
                    : '-';

                  const isPendingDeletion = loan.deletionRequestStatus === 'pending';

                  return (
                    <tr key={loan.id} className={`hover:bg-gray-50 transition-colors ${isPendingDeletion && isAdmin ? 'bg-red-50' : ''}`}>
                      <td className="p-4 font-medium text-gray-800">
                          {loan.employeeName}
                          {isPendingDeletion && (
                              <span className="mr-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                                  {isAdmin ? `طلب حذف من ${loan.deletionRequestedBy}` : 'بانتظار الموافقة'}
                              </span>
                          )}
                      </td>
                      <td className="p-4 text-gray-600">{loan.amount.toLocaleString()} د.إ</td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(loan.createdAt).toLocaleDateString('ar-AE')}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{completionDate}</td>
                      <td className="p-4 text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                          {loan.installmentsCount || loan.payments.length}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/loan/${loan.id}`, { state: { from: 'archive' } })}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                          >
                            {t('actions.details')}
                            <ChevronLeft className={`w-4 h-4 ${t('dir') === 'ltr' ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {!isPendingDeletion && !isViewer && (
                            <button
                                onClick={(e) => handleActionClick(e, loan.id, 'restore')}
                                className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1 text-sm bg-orange-50 px-3 py-1.5 rounded-md transition-colors"
                                title={t('archive.restoreDesc')}
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                          )}

                          {isAdmin && isPendingDeletion ? (
                              <>
                                <button
                                    onClick={(e) => handleApprove(e, loan.id)}
                                    className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1 text-sm bg-green-50 px-3 py-1.5 rounded-md transition-colors"
                                    title="موافقة على الحذف"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => handleReject(e, loan.id)}
                                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 text-sm bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                                    title="رفض الحذف"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                              </>
                          ) : !isViewer && (
                              <button
                                onClick={(e) => !isPendingDeletion && handleActionClick(e, loan.id, 'delete')}
                                disabled={isPendingDeletion}
                                className={`font-medium flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
                                    isPendingDeletion 
                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                                    : 'text-red-600 hover:text-red-800 bg-red-50'
                                }`}
                                title={t('actions.delete')}
                              >
                                {isPendingDeletion ? <Clock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        key={modalOpen ? 'archive-modal' : 'closed'}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={
            actionType === 'restore' ? t('archive.restore') : 
            actionType === 'approve' ? 'تأكيد الموافقة' :
            actionType === 'reject' ? 'تأكيد الرفض' :
            (isAdmin ? 'تأكيد الحذف النهائي' : 'طلب حذف سلفة')
        }
        message={
            actionType === 'restore' ? t('confirm.restore') : 
            actionType === 'approve' ? 'هل أنت متأكد من الموافقة على حذف هذه السلفة نهائياً؟' :
            actionType === 'reject' ? 'هل أنت متأكد من رفض طلب حذف هذه السلفة؟' :
            (isAdmin ? t('confirm.deleteLoan') : 'سيتم إرسال طلب إلى مدير النظام للموافقة على حذف هذه السلفة نهائياً.')
        }
        variant={
            actionType === 'approve' ? 'success' : 
            actionType === 'reject' || actionType === 'delete' ? 'danger' : 
            'default'
        }
        showFileUpload={false}
        isArchiveMode={true}
        requiresAdminCode={false}
      />
    </div>
  );
};