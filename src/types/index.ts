export interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface Loan {
  id: string;
  employeeName: string;
  amount: number;
  monthlyPayment: number;
  remainingBalance: number;
  createdAt: string;
  payments: Payment[];
  installmentsCount: number;
  loanType: 'regular' | 'salary_advance';
}

export interface User {
  username: string;
}

export interface LogEntry {
  id: string;
  action: string;
  username: string;
  timestamp: string;
  isForced?: boolean;
}

export interface AppData {
  totalFund: number;
  remainingFund: number;
  loans: Loan[];
}
