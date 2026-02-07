import React, { useState } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wallet, TrendingDown, Settings, CreditCard, DollarSign, Clock, CheckCircle, XCircle, FileText, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UpdateFundModal } from '../components/UpdateFundModal';
import { DirhamSign } from '../components/icons/DirhamSign';
import { PDFViewerModal } from '../components/PDFViewerModal';
import { ConfirmModal } from '../components/ConfirmModal';

export const FundSettings: React.FC = () => {
  const { totalFund, remainingFund, fundHistory, approveFundUpdate, rejectFundUpdate, currentUser } = useOhdaStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isViewer = currentUser?.role === 'viewer';
  
  // Confirm Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // PDF Viewer State
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfData, setCurrentPdfData] = useState<string | null>(null);

  const usedFund = totalFund - remainingFund;
  const usagePercentage = totalFund > 0 ? (usedFund / totalFund) * 100 : 0;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.username === 'admin';

  const pendingRequests = fundHistory.filter(f => f.status === 'pending');
  // For history, show approved/rejected. If admin, don't show pending here (shown above). If user, show all including pending.
  const historyList = fundHistory.filter(f => isAdmin ? f.status !== 'pending' : true);

  const handleViewReceipt = (path?: string) => {
      if (path) {
          setCurrentPdfData(path);
          setPdfViewerOpen(true);
      }
  };

  const handleApprove = (id: string) => {
      setSelectedRequestId(id);
      setConfirmAction('approve');
      setConfirmModalOpen(true);
  };

  const handleReject = (id: string) => {
      setSelectedRequestId(id);
      setConfirmAction('reject');
      setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
      if (!selectedRequestId || !confirmAction) return;
      
      if (confirmAction === 'approve') {
          await approveFundUpdate(selectedRequestId);
      } else {
          await rejectFundUpdate(selectedRequestId);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowRight className={`w-5 h-5 ${t('dir') === 'ltr' ? 'rotate-180 mr-1' : 'ml-1'}`} />
        {t('loanDetails.backToHome')}
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
            <Settings className="w-8 h-8 text-blue-600" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('fundSettings.title')}</h1>
            <p className="text-gray-500">{t('fundSettings.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Fund */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
                <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">{t('fundSettings.totalFund')}</p>
            <p className="text-2xl font-bold text-gray-800">{totalFund.toLocaleString()} <span className="text-sm font-normal text-gray-400">د.إ</span></p>
        </div>

        {/* Remaining */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-green-50 p-3 rounded-full mb-4">
                <DirhamSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">{t('balance.remaining')}</p>
            <p className="text-2xl font-bold text-green-600">{remainingFund.toLocaleString()} <span className="text-sm font-normal text-gray-400">د.إ</span></p>
        </div>

        {/* Used */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-red-50 p-3 rounded-full mb-4">
                <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">{t('balance.used')}</p>
            <p className="text-2xl font-bold text-red-600">{usedFund.toLocaleString()} <span className="text-sm font-normal text-gray-400">د.إ</span></p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{t('fundSettings.usageStatus')}</span>
            <span className="text-sm font-bold text-blue-600">{usagePercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-500 ${
                    usagePercentage > 90 ? 'bg-red-500' : 
                    usagePercentage > 75 ? 'bg-orange-500' : 
                    'bg-blue-600'
                }`}
                style={{ width: `${usagePercentage}%` }}
            ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
            {t('fundSettings.usageDesc')}
        </p>
      </div>

      {/* Actions Section */}
      {!isViewer && (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">{t('fundSettings.updateLimitTitle')}</h3>
                <p className="text-gray-500 text-sm">
                    {isAdmin ? 'تحديث الحد الأقصى للعهدة مباشرة.' : 'إرسال طلب لتحديث الحد الأقصى للعهدة للموافقة.'}
                </p>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
                <CreditCard className="w-5 h-5" />
                {t('fundSettings.updateLimitBtn')}
            </button>
        </div>
      </div>
      )}

      {/* Pending Requests (Admin Only) */}
      {isAdmin && pendingRequests.length > 0 && (
          <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  طلبات معلقة
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
                  {pendingRequests.map(req => (
                      <div key={req.id} className="p-4 border-b border-gray-100 last:border-0 flex flex-col md:flex-row justify-between items-center gap-4 bg-orange-50/30">
                          <div className="flex items-center gap-4">
                              <div className="bg-orange-100 p-2 rounded-full">
                                  <Wallet className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                  <p className="font-bold text-gray-800">طلب تحديث العهدة إلى: {req.amount.toLocaleString()} د.إ</p>
                                  <p className="text-sm text-gray-500">من: {req.requestedBy} • {new Date(req.createdAt).toLocaleDateString('ar-AE')}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              {req.receiptPath && (
                                  <button 
                                      onClick={() => handleViewReceipt(req.receiptPath)}
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                  >
                                      <FileText className="w-4 h-4" />
                                      عرض السند
                                  </button>
                              )}
                              <button 
                                  onClick={() => handleApprove(req.id)}
                                  className="text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
                              >
                                  <CheckCircle className="w-4 h-4" />
                                  موافقة
                              </button>
                              <button 
                                  onClick={() => handleReject(req.id)}
                                  className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
                              >
                                  <XCircle className="w-4 h-4" />
                                  رفض
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* History Table */}
      <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              سجل عمليات العهدة
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-right">
                      <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-sm font-semibold text-gray-600">التاريخ</th>
                              <th className="p-4 text-sm font-semibold text-gray-600">المبلغ الجديد</th>
                              <th className="p-4 text-sm font-semibold text-gray-600">بواسطة</th>
                              <th className="p-4 text-sm font-semibold text-gray-600">الحالة</th>
                              <th className="p-4 text-sm font-semibold text-gray-600">سند القبض</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                          {historyList.length === 0 ? (
                              <tr>
                                  <td colSpan={5} className="p-8 text-center text-gray-500">لا يوجد سجلات حتى الآن</td>
                              </tr>
                          ) : (
                              historyList.map(item => (
                                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="p-4 text-gray-600 text-sm">
                                          {new Date(item.createdAt).toLocaleDateString('ar-AE')}
                                          <br />
                                          <span className="text-xs text-gray-400" dir="ltr">
                                              {new Date(item.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                                          </span>
                                      </td>
                                      <td className="p-4 font-bold text-gray-800">{item.amount.toLocaleString()} د.إ</td>
                                      <td className="p-4 text-gray-600">
                                          {item.requestedBy}
                                          {item.approvedBy && item.approvedBy !== item.requestedBy && (
                                              <span className="text-xs text-gray-400 block">وافق عليه: {item.approvedBy}</span>
                                          )}
                                      </td>
                                      <td className="p-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                              item.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                              item.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                              'bg-orange-100 text-orange-700 border-orange-200'
                                          }`}>
                                              {item.status === 'approved' ? 'تم التحديث' :
                                               item.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                                          </span>
                                      </td>
                                      <td className="p-4">
                                          {item.receiptPath ? (
                                              <button 
                                                  onClick={() => handleViewReceipt(item.receiptPath)}
                                                  className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors"
                                                  title="عرض السند"
                                              >
                                                  <Eye className="w-4 h-4" />
                                              </button>
                                          ) : (
                                              <span className="text-gray-400 text-xs">-</span>
                                          )}
                                      </td>
                                  </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* Modal */}
      <UpdateFundModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PDFViewerModal 
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        pdfData={currentPdfData}
        title="سند قبض العهدة"
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmAction === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
        message={confirmAction === 'approve' ? 'هل أنت متأكد من الموافقة على تحديث العهدة؟' : 'هل أنت متأكد من رفض طلب تحديث العهدة؟'}
        variant={confirmAction === 'approve' ? 'success' : 'danger'}
        showFileUpload={false}
      />
    </div>
  );
};
