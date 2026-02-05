import { create } from 'zustand';
import { AppData, Loan, Payment, User, LogEntry } from '../types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import i18n from '../i18n/config';

const USERS = {
  'Najah': 'najah2022',
  'khatab': '099690',
  'admin': 'Asdzxc54321@',
  'user': 'Mbkd@2026',
  'admin_system': '099690' // Special code for sensitive actions
};

interface OhdaState extends AppData {
  currentUser: User | null;
  logs: LogEntry[];
  login: (username: string, password: string) => boolean;
  verifyAdminCode: (code: string) => boolean;
  logout: () => void;
  addLoan: (employeeName: string, amount: number, installmentsCount: number, loanType: 'regular' | 'salary_advance') => void;
  payInstallment: (loanId: string, paymentId: string, isForced?: boolean) => void;
  updateTotalFund: (newFund: number) => void;
  resetData: () => void;
}

export const useOhdaStore = create<OhdaState>((set, get) => {
  // Load initial data
  const initialData = loadFromLocalStorage();
  const storedUser = localStorage.getItem('currentUser');
  const storedLogs = localStorage.getItem('logs');

  return {
    ...initialData,
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    logs: storedLogs ? JSON.parse(storedLogs) : [],

    login: (username, password) => {
      // @ts-ignore
      if (USERS[username] && USERS[username] === password) {
        const user = { username };
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ currentUser: user });
        return true;
      }
      return false;
    },

    verifyAdminCode: (code: string) => {
      return code === USERS['admin_system'];
    },

    logout: () => {
      localStorage.removeItem('currentUser');
      set({ currentUser: null });
    },

    updateTotalFund: (newFund: number) => {
      const { loans, totalFund, remainingFund, currentUser, logs } = get();
      
      // Calculate how much was used from the old fund
      const usedAmount = totalFund - remainingFund;
      
      // Calculate new remaining fund
      const newRemainingFund = newFund - usedAmount;
      
      if (newRemainingFund < 0) {
        alert(i18n.t('modals.updateFund.error', { amount: usedAmount }));
        return;
      }

      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        action: i18n.t('logs.updateFund', { old: totalFund, new: newFund }),
        username: currentUser?.username || 'Unknown',
        timestamp: new Date().toISOString(),
        isForced: true // This is a sensitive action
      };

      const newData = {
        totalFund: newFund,
        remainingFund: newRemainingFund,
        loans,
      };

      const newLogs = [newLog, ...logs];
      localStorage.setItem('logs', JSON.stringify(newLogs));
      saveToLocalStorage(newData);
      
      set({ ...newData, logs: newLogs });
    },

    addLoan: (employeeName: string, amount: number, installmentsCount: number, loanType: 'regular' | 'salary_advance') => {
      const { remainingFund, loans, totalFund, currentUser, logs } = get();

      if (amount > remainingFund) {
        alert('المبلغ المطلوب أكبر من الرصيد المتبقي!');
        return;
      }

      const monthlyPayment = Math.round((amount / installmentsCount) * 100) / 100; // Round to 2 decimals
      const now = new Date();
      
      const payments: Payment[] = Array.from({ length: installmentsCount }).map((_, index) => {
        let dueDate: Date;

        if (loanType === 'salary_advance') {
          // For salary advance: 1st day of next month
          // We use constructor to avoid issues when current day is 31st
          dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, now.getHours(), now.getMinutes(), now.getSeconds());
        } else {
          // Regular loan: Same day of next month(s)
          dueDate = new Date(now);
          dueDate.setMonth(now.getMonth() + 1 + index);
        }

        return {
          id: crypto.randomUUID(),
          amount: index === installmentsCount - 1 ? amount - (monthlyPayment * (installmentsCount - 1)) : monthlyPayment, // Adjust last payment for rounding errors
          dueDate: dueDate.toISOString(),
          status: 'pending',
        };
      });

      const newLoan: Loan = {
        id: crypto.randomUUID(),
        employeeName,
        amount,
        monthlyPayment,
        remainingBalance: amount,
        createdAt: now.toISOString(),
        payments,
        installmentsCount,
        loanType,
      };

      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        action: i18n.t('logs.addLoan', { employee: employeeName, amount: amount }),
        username: currentUser?.username || 'Unknown',
        timestamp: new Date().toISOString(),
        isForced: false
      };

      const newData = {
        totalFund,
        remainingFund: remainingFund - amount,
        loans: [newLoan, ...loans],
      };

      const newLogs = [newLog, ...logs];
      localStorage.setItem('logs', JSON.stringify(newLogs));
      saveToLocalStorage(newData);
      
      set({ ...newData, logs: newLogs });
    },

    payInstallment: (loanId: string, paymentId: string, isForced: boolean = false) => {
      const { loans, remainingFund, totalFund, currentUser, logs } = get();

      let paidAmount = 0;
      let employeeName = '';

      const updatedLoans = loans.map((loan) => {
        if (loan.id !== loanId) return loan;
        employeeName = loan.employeeName;

        const updatedPayments = loan.payments.map((payment) => {
          if (payment.id !== paymentId || payment.status === 'paid') return payment;
          paidAmount = payment.amount;

          return {
            ...payment,
            status: 'paid' as const,
            paidAt: new Date().toISOString(),
          };
        });

        // Calculate if payment was actually made to update remaining balance
        const payment = loan.payments.find(p => p.id === paymentId);
        const isPaymentChanged = payment && payment.status === 'pending';
        const newRemainingBalance = isPaymentChanged 
          ? loan.remainingBalance - payment.amount 
          : loan.remainingBalance;

        return {
          ...loan,
          remainingBalance: newRemainingBalance,
          payments: updatedPayments,
        };
      });

      // Calculate amount added back to fund
      const loan = loans.find(l => l.id === loanId);
      const payment = loan?.payments.find(p => p.id === paymentId);
      
      let newRemainingFund = remainingFund;
      if (loan && payment && payment.status === 'pending') {
          newRemainingFund += payment.amount;
      }

      const actionText = isForced 
        ? i18n.t('logs.earlyPayment', { amount: paidAmount, employee: employeeName })
        : i18n.t('logs.regularPayment', { amount: paidAmount, employee: employeeName });

      const newLog: LogEntry = {
        id: crypto.randomUUID(),
        action: actionText,
        username: currentUser?.username || 'Unknown',
        timestamp: new Date().toISOString(),
        isForced: isForced
      };

      const newData = {
        totalFund,
        remainingFund: newRemainingFund,
        loans: updatedLoans,
      };

      const newLogs = [newLog, ...logs];
      localStorage.setItem('logs', JSON.stringify(newLogs));
      saveToLocalStorage(newData);
      
      set({ ...newData, logs: newLogs });
    },
    
    resetData: () => {
        const defaultData = {
            totalFund: 15000,
            remainingFund: 15000,
            loans: []
        };
        saveToLocalStorage(defaultData);
        set(defaultData);
    }
  };
});
