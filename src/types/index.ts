export interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  paidAt?: string;
  receipt?: string; // Base64 string or URL of the uploaded receipt
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
  loanType: 'regular' | 'salary_advance' | 'flexible';
  deletionRequestStatus?: 'pending' | 'rejected' | null;
  deletionRequestedBy?: string;
  deletionRequestedAt?: string;
}

export interface AppUser {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string; // Added
}

export interface FundTransaction {
  id: string;
  amount: number;
  receiptPath?: string;
  requestedBy: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface Notification {
  id: string;
  type: 'delete_request' | 'request_approved' | 'request_rejected' | 'fund_request' | 'fund_approved' | 'fund_rejected';
  message: string;
  recipient: string;
  sender: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  username: string;
  role?: 'admin' | 'user' | 'viewer';
  avatarUrl?: string; // Added
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
  archivedLoans: Loan[];
}
