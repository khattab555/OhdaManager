import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOhdaStore } from '../store/useOhdaStore';
import { 
  Calendar, 
  Edit, 
  Save, 
  X, 
  ChevronRight, 
  FileText, 
  Archive, 
  History, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Loan, LogEntry, FundTransaction, Payment } from '../types';

type Category = 'loans' | 'archive' | 'logs' | 'fundHistory';

export const DataCorrection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { 
    loans, 
    archivedLoans, 
    logs, 
    fundHistory, 
    currentUser,
    updateLoanDates,
    updateLogDate,
    updateFundHistoryDates
  } = useOhdaStore();

  const [selectedCategory, setSelectedCategory] = useState<Category>('loans');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [createdAt, setCreatedAt] = useState('');
  const [approvedAt, setApprovedAt] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);

  // Security check
  if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('common.accessDenied')}</h2>
        <p className="text-gray-500">{t('common.adminOnly')}</p>
      </div>
    );
  }

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    
    // Initialize form based on type
    if (selectedCategory === 'loans' || selectedCategory === 'archive') {
        const loan = item as Loan;
        setCreatedAt(formatDateForInput(loan.createdAt));
        setPayments(JSON.parse(JSON.stringify(loan.payments))); // Deep copy
    } else if (selectedCategory === 'logs') {
        const log = item as LogEntry;
        setCreatedAt(formatDateForInput(log.timestamp));
    } else if (selectedCategory === 'fundHistory') {
        const fund = item as FundTransaction;
        setCreatedAt(formatDateForInput(fund.createdAt));
        setApprovedAt(fund.approvedAt ? formatDateForInput(fund.approvedAt) : '');
    }
    
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
        if (selectedCategory === 'loans' || selectedCategory === 'archive') {
            await updateLoanDates(editingItem.id, new Date(createdAt).toISOString(), payments);
        } else if (selectedCategory === 'logs') {
            await updateLogDate(editingItem.id, new Date(createdAt).toISOString());
        } else if (selectedCategory === 'fundHistory') {
            await updateFundHistoryDates(
                editingItem.id, 
                new Date(createdAt).toISOString(), 
                approvedAt ? new Date(approvedAt).toISOString() : undefined
            );
        }
        
        // Show success indicator if needed, or just close
        setIsModalOpen(false);
        setEditingItem(null);
    } catch (e: any) {
        alert(t('common.error') || 'Failed to update data. Please check console for details.');
        console.error(e);
    }
  };

  const formatDateForInput = (isoString: string) => {
    if (!isoString) return '';
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().slice(0, 16);
  };

  const updatePayment = (index: number, field: keyof Payment, value: string) => {
    const newPayments = [...payments];
    // @ts-ignore
    newPayments[index][field] = value === '' ? undefined : value;
    setPayments(newPayments);
  };

  const getData = () => {
    switch (selectedCategory) {
      case 'loans': return loans;
      case 'archive': return archivedLoans;
      case 'logs': return logs;
      case 'fundHistory': return fundHistory;
      default: return [];
    }
  };

  const renderModalContent = () => {
    if (selectedCategory === 'loans' || selectedCategory === 'archive') {
        return (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('common.date')} (Created At)
                    </label>
                    <input
                        type="datetime-local"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {t('loanDetails.paymentHistory')}
                    </h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {payments.map((payment, index) => (
                            <div key={payment.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                                        <input
                                            type="datetime-local"
                                            value={formatDateForInput(payment.dueDate)}
                                            onChange={(e) => updatePayment(index, 'dueDate', new Date(e.target.value).toISOString())}
                                            className="w-full p-1 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Paid At</label>
                                        <input
                                            type="datetime-local"
                                            value={payment.paidAt ? formatDateForInput(payment.paidAt) : ''}
                                            onChange={(e) => updatePayment(index, 'paidAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
                                            className="w-full p-1 text-sm border border-gray-300 rounded"
                                            disabled={payment.status !== 'paid'}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory === 'logs') {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.date')} (Timestamp)
                </label>
                <input
                    type="datetime-local"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
        );
    }

    if (selectedCategory === 'fundHistory') {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('common.date')} (Requested At)
                    </label>
                    <input
                        type="datetime-local"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                {approvedAt && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Approved At
                        </label>
                        <input
                            type="datetime-local"
                            value={approvedAt}
                            onChange={(e) => setApprovedAt(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}
            </div>
        );
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium gap-2 mb-4"
            >
                <ArrowRight className={`w-4 h-4 ${i18n.dir() === 'ltr' ? 'rotate-180' : ''}`} />
                {t('loanDetails.backToHome')}
            </button>
            
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            {t('dataCorrection.title')}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
                onClick={() => setSelectedCategory('loans')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'loans' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <FileText className="w-5 h-5" />
                {t('loans.activeLoans')}
            </button>
            <button
                onClick={() => setSelectedCategory('archive')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'archive' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <Archive className="w-5 h-5" />
                {t('archive.title')}
            </button>
            <button
                onClick={() => setSelectedCategory('logs')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'logs' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <History className="w-5 h-5" />
                {t('actions.logs')}
            </button>
            <button
                onClick={() => setSelectedCategory('fundHistory')}
                className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${selectedCategory === 'fundHistory' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <DollarSign className="w-5 h-5" />
                {t('resetSystem.fundHistory')}
            </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">
                        {selectedCategory === 'loans' && t('loans.activeLoans')}
                        {selectedCategory === 'archive' && t('archive.title')}
                        {selectedCategory === 'logs' && t('actions.logs')}
                        {selectedCategory === 'fundHistory' && t('resetSystem.fundHistory')}
                    </h3>
                    <span className="text-sm text-gray-500">{getData().length} {t('common.items')}</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {getData().map((item: any) => (
                        <div key={item.id} className="p-4 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-medium text-gray-900">
                                        {item.employeeName || item.username || item.requestedBy || item.action}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                        {new Date(item.createdAt || item.timestamp).toLocaleString('en-US')}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                    {item.amount && `${item.amount.toLocaleString()} AED`}
                                    {item.action && item.action}
                                    {item.message && item.message}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => handleEditClick(item)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-md flex items-center gap-2 text-sm font-medium"
                            >
                                <Edit className="w-4 h-4" />
                                {t('actions.edit')}
                            </button>
                        </div>
                    ))}
                    
                    {getData().length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            {t('common.noData')}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        {t('dataCorrection.editDates')}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {renderModalContent()}
                    
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs text-yellow-800 flex items-start gap-2">
                        <div className="mt-0.5">⚠️</div>
                        <p>{t('dataCorrection.warning')}</p>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Save className="w-4 h-4" />
                        {t('common.save')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
