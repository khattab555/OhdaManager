import React, { useState } from 'react';
import { useOhdaStore } from '../store/useOhdaStore';
import { LoanForm } from '../components/LoanForm';
import { LoansTable } from '../components/LoansTable';
import { Wallet, TrendingDown } from 'lucide-react';
import { ActionMenu } from '../components/ActionMenu';
import { useTranslation } from 'react-i18next';

export const Dashboard: React.FC = () => {
  const { totalFund, remainingFund, currentUser } = useOhdaStore();
  const usedFund = totalFund - remainingFund;
  const { t } = useTranslation();
  const isViewer = currentUser?.role === 'viewer';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('appTitle')}</h1>
          <p className="text-gray-600">{t('appSubtitle')}</p>
        </div>
        
        <ActionMenu />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium opacity-90">{t('balance.remaining')}</h3>
            <Wallet className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold mb-2">{remainingFund.toLocaleString()} <span className="text-xl font-normal">د.إ</span></p>
          <div className="w-full bg-blue-800 rounded-full h-2 mt-4">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${(remainingFund / totalFund) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 opacity-80 text-left ltr">{(remainingFund / totalFund * 100).toFixed(1)}% {t('status.inProgress')}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-600">{t('balance.used')}</h3>
            <TrendingDown className="w-8 h-8 text-red-500 opacity-80" />
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">{usedFund.toLocaleString()} <span className="text-xl font-normal text-gray-500">د.إ</span></p>
          <p className="text-sm text-gray-500 mt-2">{t('balance.total')}: {totalFund.toLocaleString()} د.إ</p>
        </div>
      </div>

      {!isViewer && <LoanForm />}
      <LoansTable />
    </div>
  );
};
