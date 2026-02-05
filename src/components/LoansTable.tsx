import React, { useState } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronLeft, ChevronDown } from 'lucide-react';
import { Loan } from '../types';
import { useTranslation } from 'react-i18next';

export const LoansTable: React.FC = () => {
  const { loans } = useOhdaStore();
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { t } = useTranslation();

  const getLoanStatus = (loan: Loan) => {
    const paidCount = loan.payments.filter(p => p.status === 'paid').length;
    const totalInstallments = loan.installmentsCount || 3; // Fallback to 3 for old data

    if (paidCount === totalInstallments) {
      return { text: t('status.paid'), className: 'bg-green-100 text-green-800' };
    }
    
    // For loans with less than 3 installments, logic needs to be dynamic
    const remaining = totalInstallments - paidCount;
    
    if (paidCount === 0) {
      return { text: t('status.waitingPayment'), className: 'bg-red-100 text-red-800' };
    }

    // Logic for intermediate states
    if (remaining === 1) {
       // e.g. 2/3 paid -> waiting for 3rd (last)
       // e.g. 1/2 paid -> waiting for 2nd (last)
       const nextInstallmentNumber = paidCount + 1;
       
       let statusText = t('status.waitingLast');
       if (nextInstallmentNumber === 2) statusText = t('status.waitingSecond');
       if (nextInstallmentNumber === 3) statusText = t('status.waitingThird');

       return { 
         text: statusText, 
         className: 'bg-yellow-100 text-yellow-800' 
       };
    }
    
    if (remaining === 2) {
      return { text: t('status.waitingSecond'), className: 'bg-orange-100 text-orange-800' };
    }

    return { text: t('status.inProgress'), className: 'bg-blue-100 text-blue-800' };
  };

  if (loans.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
        <p>{t('loans.noActiveLoans')}</p>
      </div>
    );
  }

  // Get displayed loans based on limit
  const displayedLoans = loans.slice(0, itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          {t('loans.activeLoans')}
        </h2>
        <div className="text-sm text-gray-500">
          {displayedLoans.length} / {loans.length}
        </div>
      </div>
      
      {/* Table Container with fixed height if needed for large lists */}
      <div className={`overflow-x-auto ${itemsPerPage > 10 ? 'max-h-[600px] overflow-y-auto' : ''}`}>
        <table className="w-full text-right relative">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.employeeName')}</th>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.amount')}</th>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.remaining')}</th>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.date')}</th>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.status')}</th>
              <th className="p-4 text-sm font-semibold text-gray-600">{t('loans.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedLoans.map((loan) => {
              const status = getLoanStatus(loan);
              return (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">{loan.employeeName}</td>
                  <td className="p-4 text-gray-600">{loan.amount.toLocaleString()} د.إ</td>
                  <td className="p-4 text-gray-600 font-medium">{loan.remainingBalance.toLocaleString()} د.إ</td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(loan.createdAt).toLocaleDateString('ar-AE')}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/loan/${loan.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm"
                    >
                      {t('actions.details')}
                      <ChevronLeft className={`w-4 h-4 ${t('dir') === 'ltr' ? 'rotate-180' : ''}`} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination / View More Controls */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-2">
        <span className="text-sm text-gray-600 ml-2">Rows per page:</span>
        <div className="relative inline-block">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-medium"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
