import { create } from 'zustand';
import { AppData, Loan, Payment, User, LogEntry, Notification, FundTransaction, AppUser } from '../types';
import i18n from '../i18n/config';
import { supabase } from '../lib/supabase';

const USERS: Record<string, string> = {
  'Najah': 'najah2022',
  'khatab': '099690',
  'admin': 'Asdzxc54321@',
  'user': 'Mbkd@2026',
  'admin_system': '099690' // Special code for sensitive actions
};

interface OhdaState extends AppData {
  currentUser: User | null;
  logs: LogEntry[];
  notifications: Notification[];
  fundHistory: FundTransaction[];
  appUsers: AppUser[];
  systemStats: { dbSize: string; storageSize: string; dbBytes: number; storageBytes: number } | null;
  maintenanceMode: boolean; // Added
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  fetchSystemStats: () => Promise<void>; // Added
  toggleMaintenanceMode: (status: boolean) => Promise<void>; // Added
  login: (username: string, password: string) => Promise<boolean>;
  verifyAdminCode: (code: string) => boolean;
  logout: () => void;
  // User Management Actions
  addAppUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteAppUser: (id: string) => Promise<boolean>;
  updateAppUser: (id: string, updates: Partial<AppUser>) => Promise<boolean>;
  updateUserAvatar: (username: string, avatarData: string) => Promise<boolean>; // Added
  // ... existing actions
  addLoan: (employeeName: string, amount: number, installmentsCount: number, loanType: 'regular' | 'salary_advance' | 'flexible') => Promise<void>;
  payInstallment: (loanId: string, paymentId: string, isForced?: boolean, receipt?: string) => Promise<void>;
  payFlexibleLoan: (loanId: string, amount: number, receipt: string) => Promise<void>;
  updateTotalFund: (newFund: number, receipt?: string) => Promise<void>;
  archiveLoan: (loanId: string) => Promise<void>;
  unarchiveLoan: (loanId: string) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<void>;
  approveDeletion: (loanId: string) => Promise<void>;
  rejectDeletion: (loanId: string) => Promise<void>;
  requestFundUpdate: (newFund: number, receipt?: string) => Promise<boolean>;
  approveFundUpdate: (requestId: string) => Promise<void>;
  rejectFundUpdate: (requestId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  resetData: () => void;
  // System Reset Actions
  deleteLoansBulk: (ids: string[]) => Promise<void>;
  deleteLogsBulk: (ids: string[]) => Promise<void>;
  deleteNotificationsBulk: (ids: string[]) => Promise<void>;
  deleteFundHistoryBulk: (ids: string[]) => Promise<void>; // Added
  clearStorage: () => Promise<void>; // Added
  resetFundToTotal: () => Promise<void>;
  // Data Correction Actions
  updateLoanDates: (loanId: string, newCreatedAt: string, payments: Payment[]) => Promise<void>;
  updateLogDate: (logId: string, newTimestamp: string) => Promise<void>;
  updateFundHistoryDates: (id: string, newCreatedAt: string, newApprovedAt?: string) => Promise<void>;
  wipeSystem: () => Promise<void>; // Added
}

export const useOhdaStore = create<OhdaState>((set, get) => {
  // Load initial user from local storage (auth state can remain local for now)
  const storedUser = localStorage.getItem('currentUser');

  return {
    // Initial state
    totalFund: 0,
    remainingFund: 0,
    loans: [],
    archivedLoans: [],
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    logs: [],
    notifications: [],
    fundHistory: [],
    appUsers: [],
    systemStats: null, // Added
    maintenanceMode: false, // Added
    loading: false,
    error: null,

    fetchData: async () => {
      set({ loading: true, error: null });
      
      const { currentUser } = get();
      let newTotalFund = 15000;
      let newRemainingFund = 15000;
      let newMaintenanceMode = false; // Added
      let newLoans: any[] = [];
      let newArchivedLoans: any[] = [];
      let newLogs: any[] = [];
      let newFundHistory: any[] = [];
      let newNotifications: any[] = [];
      let newAppUsers: any[] = [];

      // Helper for safe fetch to prevent one failure from breaking the whole app
      const safeFetch = async (promise: Promise<any>, fallback: any, name: string) => {
          try {
              const { data, error } = await promise;
              if (error) {
                  // Ignore specific errors that are not critical
                  if (error.code === 'PGRST116') return fallback; // No rows found (e.g. settings)
                  if (error.code === '42P01') {
                      console.warn(`Table for ${name} does not exist yet.`);
                      return fallback; 
                  }
                  console.warn(`Error fetching ${name}:`, error.message);
                  return fallback;
              }
              return data || fallback;
          } catch (e) {
              console.warn(`Exception fetching ${name} (possibly blocked):`, e);
              return fallback;
          }
      };

      try {
        // 1. App Settings
        const settingsData = await safeFetch(
            supabase.from('app_settings').select('*').single(),
            null,
            'settings'
        );
        if (settingsData) {
            newTotalFund = settingsData.total_fund;
            newRemainingFund = settingsData.remaining_fund;
            newMaintenanceMode = settingsData.maintenance_mode || false; // Added
        }

        // 2. Active Loans
        newLoans = await safeFetch(
            supabase.from('loans').select('*').eq('is_archived', false).order('created_at', { ascending: false }),
            [],
            'active loans'
        );

        // 3. Archived Loans
        newArchivedLoans = await safeFetch(
            supabase.from('loans').select('*').eq('is_archived', true).order('created_at', { ascending: false }),
            [],
            'archived loans'
        );

        // 4. Logs
        newLogs = await safeFetch(
            supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(100),
            [],
            'logs'
        );

        // 5. Fund History
        newFundHistory = await safeFetch(
            supabase.from('fund_history').select('*').order('created_at', { ascending: false }),
            [],
            'fund history'
        );

        // 6. Notifications
        if (currentUser) {
            newNotifications = await safeFetch(
                supabase.from('notifications').select('*').eq('recipient', currentUser.username).order('created_at', { ascending: false }),
                [],
                'notifications'
            );
        }

        // 7. App Users
        newAppUsers = await safeFetch(
            supabase.from('app_users').select('*').order('created_at', { ascending: false }),
            [],
            'app users'
        );

        set({
          totalFund: newTotalFund,
          remainingFund: newRemainingFund,
          maintenanceMode: newMaintenanceMode, // Added
          loans: newLoans.map(l => ({
              ...l,
              employeeName: l.employee_name,
              createdAt: l.created_at,
              monthlyPayment: l.monthly_payment,
              remainingBalance: l.remaining_balance,
              installmentsCount: l.installments_count,
              loanType: l.loan_type,
              deletionRequestStatus: l.deletion_request_status,
              deletionRequestedBy: l.deletion_requested_by,
              deletionRequestedAt: l.deletion_requested_at
          })),
          archivedLoans: newArchivedLoans.map(l => ({
              ...l,
              employeeName: l.employee_name,
              createdAt: l.created_at,
              monthlyPayment: l.monthly_payment,
              remainingBalance: l.remaining_balance,
              installmentsCount: l.installments_count,
              loanType: l.loan_type,
              deletionRequestStatus: l.deletion_request_status,
              deletionRequestedBy: l.deletion_requested_by,
              deletionRequestedAt: l.deletion_requested_at
          })),
          logs: newLogs.map(l => ({
              ...l,
              timestamp: l.created_at,
              createdAt: l.created_at,
              isForced: l.is_forced
          })),
          fundHistory: newFundHistory.map(f => ({
            id: f.id,
            amount: f.amount,
            receiptPath: f.receipt_path,
            requestedBy: f.requested_by,
            createdAt: f.created_at,
            status: f.status,
            approvedBy: f.approved_by,
            approvedAt: f.approved_at
          })),
          notifications: newNotifications.map(n => ({
              ...n,
              isRead: n.is_read,
              createdAt: n.created_at
          })),
          appUsers: newAppUsers.map(u => ({
              id: u.id,
              username: u.username,
              password: u.password,
              role: u.role,
              isActive: u.is_active,
              createdAt: u.created_at,
              avatarUrl: u.avatar_url // Added
          })),
          loading: false
        });

      } catch (error: any) {
        console.error('Critical error in fetchData:', error);
        set({ error: error.message, loading: false });
      }
    },

    fetchSystemStats: async () => {
        const { error, data } = await supabase.rpc('get_system_stats');
        if (error) {
            console.error('Error fetching system stats:', error);
            return;
        }
        if (data) {
            set({ systemStats: { 
                dbSize: data.db_size, 
                storageSize: data.storage_size,
                dbBytes: data.db_bytes,
                storageBytes: data.storage_bytes
            } });
        }
    },

    toggleMaintenanceMode: async (status: boolean) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') return;

        const { error } = await supabase
            .from('app_settings')
            .update({ maintenance_mode: status })
            .eq('id', 1);

        if (error) {
            console.error('Error toggling maintenance mode:', error);
            return;
        }

        const actionText = status 
            ? 'قام المدير بتفعيل وضع الصيانة (إيقاف النظام للموظفين)'
            : 'قام المدير بإيقاف وضع الصيانة (إتاحة النظام للموظفين)';

        await supabase.from('logs').insert({
            action: actionText,
            username: currentUser?.username || 'admin',
            is_forced: true
        });

        set(state => ({ 
            maintenanceMode: status,
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser?.username || 'admin', timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
        }));
    },

    login: async (username, password) => {
      // 1. Check DB Users (Direct Query)
      try {
        const { data: dbUser, error } = await supabase
          .from('app_users')
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();

        if (dbUser) {
          if (!dbUser.is_active) return false;
          const user = { username: dbUser.username, role: dbUser.role, avatarUrl: dbUser.avatar_url };
          localStorage.setItem('currentUser', JSON.stringify(user));
          set({ currentUser: user });
          return true;
        }
      } catch (e) {
        console.error('Login error:', e);
      }

      // 2. Fallback to Hardcoded Users
      // @ts-ignore
      if (USERS[username] && USERS[username] === password) {
        const role = username === 'admin' ? 'admin' : 'user';
        const user = { username, role };
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ currentUser: user });
        return true;
      }
      return false;
    },

    addAppUser: async (user) => {
        const { maintenanceMode, currentUser } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return false;
        }

        const { error } = await supabase.from('app_users').insert({
            username: user.username,
            password: user.password,
            role: user.role,
            is_active: user.isActive
        });
        
        if (error) {
            console.error('Error adding user:', error);
            return false;
        }
        
        await get().fetchData(); 
        return true;
    },

    deleteAppUser: async (id) => {
        const { maintenanceMode, currentUser } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return false;
        }
        
        const { error } = await supabase.from('app_users').delete().eq('id', id);
        if (error) return false;
        set(state => ({ appUsers: state.appUsers.filter(u => u.id !== id) }));
        return true;
    },

    updateAppUser: async (id, updates) => {
        const { maintenanceMode, currentUser } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return false;
        }

        const dbUpdates: any = {};
        if (updates.username) dbUpdates.username = updates.username;
        if (updates.password) dbUpdates.password = updates.password;
        if (updates.role) dbUpdates.role = updates.role;
        if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
        if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl; // Added

        const { error } = await supabase.from('app_users').update(dbUpdates).eq('id', id);
        if (error) return false;
        
        await get().fetchData();
        return true;
    },

    updateUserAvatar: async (username: string, avatarData: string) => {
        const { maintenanceMode, currentUser } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return false;
        }

        let avatarUrl = avatarData;

        if (avatarData.startsWith('data:')) {
             try {
                 const fileExt = 'png'; // Assume png for now or detect from header
                 const fileName = `avatars/${username}_${Date.now()}.${fileExt}`;
                 const base64Data = avatarData.split(',')[1];
                 const binaryData = atob(base64Data);
                 const arrayBuffer = new ArrayBuffer(binaryData.length);
                 const uint8Array = new Uint8Array(arrayBuffer);
                 for (let i = 0; i < binaryData.length; i++) { uint8Array[i] = binaryData.charCodeAt(i); }
                 const blob = new Blob([uint8Array], { type: 'image/png' });
                 
                 const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, blob, { upsert: true });
                 if (uploadError) {
                     // If bucket doesn't exist, try to create it? No, can't create from client usually without policy.
                     // Fallback to not uploading? Or maybe user meant URL.
                     console.error('Upload error:', uploadError);
                     // If bucket not found error, maybe we can't do much.
                     if (uploadError.message.includes('Bucket not found')) {
                         alert('Storage bucket "avatars" not found. Please contact admin.');
                         return false;
                     }
                     throw uploadError;
                 }
                 const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                 avatarUrl = publicUrl;
             } catch(e) { 
                 console.error('Error uploading avatar:', e);
                 return false;
             }
        }

        const { error } = await supabase
            .from('app_users')
            .update({ avatar_url: avatarUrl })
            .eq('username', username);

        if (error) {
            console.error('Error updating avatar in DB:', error);
            return false;
        }

        // Update local state if it's the current user
        if (currentUser?.username === username) {
            const updatedUser = { ...currentUser, avatarUrl };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            set({ currentUser: updatedUser });
        }

        return true;
    },

    verifyAdminCode: (code: string) => {
      return code === USERS['admin_system'];
    },

    logout: () => {
      localStorage.removeItem('currentUser');
      set({ currentUser: null });
    },

    updateTotalFund: async (newFund: number, receipt?: string) => {
      const { totalFund, remainingFund, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }
      
      const usedAmount = totalFund - remainingFund;
      const newRemainingFund = newFund - usedAmount;
      
      if (newRemainingFund < 0) {
        alert(i18n.t('modals.updateFund.error', { amount: usedAmount }));
        return;
      }

      let receiptPath = null;
      if (receipt && receipt.startsWith('data:')) {
          try {
             const fileExt = 'pdf';
             const fileName = `fund_update_${Date.now()}.${fileExt}`;
             const base64Data = receipt.split(',')[1];
             const binaryData = atob(base64Data);
             const arrayBuffer = new ArrayBuffer(binaryData.length);
             const uint8Array = new Uint8Array(arrayBuffer);
             for (let i = 0; i < binaryData.length; i++) {
                 uint8Array[i] = binaryData.charCodeAt(i);
             }
             const blob = new Blob([uint8Array], { type: 'application/pdf' });

             const { error: uploadError } = await supabase.storage.from('fund-receipts').upload(fileName, blob);
             if (uploadError) throw uploadError;
             
             const { data: { publicUrl } } = supabase.storage.from('fund-receipts').getPublicUrl(fileName);
             receiptPath = publicUrl;
          } catch(e) { console.error(e); }
      }

      const { error } = await supabase
        .from('app_settings')
        .update({ total_fund: newFund, remaining_fund: newRemainingFund })
        .eq('id', 1);

      if (error) { console.error(error); return; }

      const { data: historyEntry } = await supabase.from('fund_history').insert({
          amount: newFund,
          requested_by: currentUser?.username || 'admin',
          status: 'approved',
          approved_by: currentUser?.username || 'admin',
          approved_at: new Date().toISOString(),
          receipt_path: receiptPath
      }).select().single();

      const actionText = i18n.t('logs.updateFund', { old: totalFund, new: newFund });
      await supabase.from('logs').insert({
          action: actionText,
          username: currentUser?.username || 'Unknown',
          is_forced: true
      });

      set(state => ({
          totalFund: newFund,
          remainingFund: newRemainingFund,
          fundHistory: [
              {
                  id: historyEntry?.id || crypto.randomUUID(),
                  amount: newFund,
                  requestedBy: currentUser?.username || 'admin',
                  createdAt: new Date().toISOString(),
                  status: 'approved',
                  approvedBy: currentUser?.username || 'admin',
                  approvedAt: new Date().toISOString(),
                  receiptPath: receiptPath || undefined
              },
              ...state.fundHistory
          ],
          logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser?.username || 'Unknown', timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
      }));
    },

    requestFundUpdate: async (newFund: number, receipt?: string) => {
        const { currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return false;
        }
        
        let receiptPath = null;
        if (receipt && receipt.startsWith('data:')) {
            try {
               const fileExt = 'pdf';
               const fileName = `fund_request_${Date.now()}.${fileExt}`;
               const base64Data = receipt.split(',')[1];
               const binaryData = atob(base64Data);
               const arrayBuffer = new ArrayBuffer(binaryData.length);
               const uint8Array = new Uint8Array(arrayBuffer);
               for (let i = 0; i < binaryData.length; i++) { uint8Array[i] = binaryData.charCodeAt(i); }
               const blob = new Blob([uint8Array], { type: 'application/pdf' });
               const { error: uploadError } = await supabase.storage.from('fund-receipts').upload(fileName, blob);
               if (uploadError) throw uploadError;
               const { data: { publicUrl } } = supabase.storage.from('fund-receipts').getPublicUrl(fileName);
               receiptPath = publicUrl;
            } catch(e) { 
                console.error('Error uploading receipt:', e);
                // We might want to stop here or continue without receipt?
                // Let's log but continue, but if bucket is missing, insert will likely fail too.
            }
        }

        const { data: historyEntry, error } = await supabase.from('fund_history').insert({
            amount: newFund,
            requested_by: currentUser?.username || 'user',
            status: 'pending',
            receipt_path: receiptPath
        }).select().single();

        if (error) { 
            console.error('Error requesting fund update:', error); 
            return false; 
        }

        await supabase.from('notifications').insert({
            type: 'fund_request',
            message: `طلب تحديث العهدة إلى ${newFund} من ${currentUser?.username}`,
            recipient: 'admin',
            sender: currentUser?.username || 'user',
            data: { requestId: historyEntry.id, amount: newFund }
        });

        set(state => ({
            fundHistory: [
                {
                    id: historyEntry.id,
                    amount: newFund,
                    requestedBy: currentUser?.username || 'user',
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                    receiptPath: receiptPath || undefined
                },
                ...state.fundHistory
            ]
        }));
        return true;
    },

    approveFundUpdate: async (requestId: string) => {
        const { fundHistory, totalFund, remainingFund, currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return;
        }

        const request = fundHistory.find(f => f.id === requestId);
        if (!request) return;

        const newFund = request.amount;
        const usedAmount = totalFund - remainingFund;
        const newRemainingFund = newFund - usedAmount; 
        
        await supabase.from('app_settings').update({ total_fund: newFund, remaining_fund: newRemainingFund }).eq('id', 1);
        
        await supabase.from('fund_history').update({
            status: 'approved',
            approved_by: currentUser?.username || 'admin',
            approved_at: new Date().toISOString()
        }).eq('id', requestId);

        await supabase.from('notifications').insert({
            type: 'fund_approved',
            message: `تمت الموافقة على طلب تحديث العهدة`,
            recipient: request.requestedBy,
            sender: 'admin',
            data: { requestId, amount: newFund }
        });

        const actionText = `الموافقة على تحديث العهدة إلى ${newFund} (بطلب من ${request.requestedBy})`;
        await supabase.from('logs').insert({ action: actionText, username: currentUser?.username || 'admin', is_forced: true });

        set(state => ({
            totalFund: newFund,
            remainingFund: newRemainingFund,
            fundHistory: state.fundHistory.map(f => f.id === requestId ? { ...f, status: 'approved', approvedBy: currentUser?.username, approvedAt: new Date().toISOString() } : f),
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser?.username, timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
        }));
    },

    rejectFundUpdate: async (requestId: string) => {
        const { fundHistory, currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return;
        }

        const request = fundHistory.find(f => f.id === requestId);
        if (!request) return;

        await supabase.from('fund_history').update({ status: 'rejected' }).eq('id', requestId);

        await supabase.from('notifications').insert({
            type: 'fund_rejected',
            message: `تم رفض طلب تحديث العهدة`,
            recipient: request.requestedBy,
            sender: 'admin',
            data: { requestId }
        });

        set(state => ({
            fundHistory: state.fundHistory.map(f => f.id === requestId ? { ...f, status: 'rejected' } : f)
        }));
    },

    addLoan: async (employeeName, amount, installmentsCount, loanType) => {
      const { remainingFund, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }

      if (amount > remainingFund) {
        alert('المبلغ المطلوب أكبر من الرصيد المتبقي!');
        return;
      }

      const monthlyPayment = loanType === 'flexible' ? 0 : Math.round((amount / installmentsCount) * 100) / 100;
      const now = new Date();
      
      let payments: Payment[] = [];
      
      if (loanType !== 'flexible') {
          payments = Array.from({ length: installmentsCount }).map((_, index) => {
            let dueDate: Date;

            if (loanType === 'salary_advance') {
              dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 12, 0, 0);
            } else {
              dueDate = new Date(now);
              dueDate.setMonth(now.getMonth() + 1 + index);
            }

            return {
              id: crypto.randomUUID(),
              amount: index === installmentsCount - 1 ? amount - (monthlyPayment * (installmentsCount - 1)) : monthlyPayment,
              dueDate: dueDate.toISOString(),
              status: 'pending',
            };
          });
      }

      const newLoan = {
        employee_name: employeeName,
        amount,
        monthly_payment: monthlyPayment,
        remaining_balance: amount,
        installments_count: installmentsCount,
        loan_type: loanType,
        payments: payments,
        is_archived: false
      };

      const { data: insertedLoan, error: loanError } = await supabase
        .from('loans')
        .insert(newLoan)
        .select()
        .single();

      if (loanError) {
          console.error('Error adding loan:', loanError);
          alert(`Failed to add loan: ${loanError.message}`);
          return;
      }

      const newRemainingFund = remainingFund - amount;
      await supabase
        .from('app_settings')
        .update({ remaining_fund: newRemainingFund })
        .eq('id', 1);

      const actionText = i18n.t('logs.addLoan', { employee: employeeName, amount: amount });
      await supabase.from('logs').insert({
          action: actionText,
          username: currentUser?.username || 'Unknown',
          is_forced: false
      });

      set(state => ({
          remainingFund: newRemainingFund,
          loans: [{
              ...insertedLoan,
              employeeName: insertedLoan.employee_name,
              createdAt: insertedLoan.created_at,
              monthlyPayment: insertedLoan.monthly_payment,
              remainingBalance: insertedLoan.remaining_balance,
              installmentsCount: insertedLoan.installments_count,
              loanType: insertedLoan.loan_type,
              id: insertedLoan.id
          }, ...state.loans],
          logs: [{
              id: crypto.randomUUID(),
              action: actionText,
              username: currentUser?.username || 'Unknown',
              timestamp: new Date().toISOString(),
              isForced: false
          }, ...state.logs]
      }));
    },

    payInstallment: async (loanId, paymentId, isForced = false, receipt) => {
      const { loans, remainingFund, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }

      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      let receiptUrl = receipt;

      if (receipt && receipt.startsWith('data:')) {
          try {
              const fileExt = 'pdf';
              const fileName = `${loanId}/${paymentId}_${Date.now()}.${fileExt}`;
              const base64Data = receipt.split(',')[1];
              const binaryData = atob(base64Data);
              const arrayBuffer = new ArrayBuffer(binaryData.length);
              const uint8Array = new Uint8Array(arrayBuffer);
              for (let i = 0; i < binaryData.length; i++) {
                  uint8Array[i] = binaryData.charCodeAt(i);
              }
              const blob = new Blob([uint8Array], { type: 'application/pdf' });

              const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, blob);
              if (uploadError) throw uploadError;

              const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
              receiptUrl = publicUrl;

          } catch (e) {
              console.error('Error uploading receipt:', e);
              alert('Failed to upload receipt, but payment will proceed.');
          }
      }

      let paidAmount = 0;
      const updatedPayments = loan.payments.map((payment) => {
        if (payment.id !== paymentId || payment.status === 'paid') return payment;
        paidAmount = payment.amount;
        return {
          ...payment,
          status: 'paid' as const,
          paidAt: new Date().toISOString(),
          receipt: receiptUrl,
        };
      });

      const newRemainingBalance = loan.remainingBalance - paidAmount;
      const newRemainingFund = remainingFund + paidAmount;

      const { error: loanError } = await supabase
        .from('loans')
        .update({ 
            payments: updatedPayments,
            remaining_balance: newRemainingBalance
        })
        .eq('id', loanId);

      if (loanError) {
          console.error('Error updating loan:', loanError);
          return;
      }

      await supabase
        .from('app_settings')
        .update({ remaining_fund: newRemainingFund })
        .eq('id', 1);

      const actionText = isForced 
        ? i18n.t('logs.earlyPayment', { amount: paidAmount, employee: loan.employeeName })
        : i18n.t('logs.regularPayment', { amount: paidAmount, employee: loan.employeeName });

      await supabase.from('logs').insert({
          action: actionText,
          username: currentUser?.username || 'Unknown',
          is_forced: isForced
      });

      set(state => ({
          remainingFund: newRemainingFund,
          loans: state.loans.map(l => l.id === loanId ? {
              ...l,
              remainingBalance: newRemainingBalance,
              payments: updatedPayments
          } : l),
          logs: [{
              id: crypto.randomUUID(),
              action: actionText,
              username: currentUser?.username || 'Unknown',
              timestamp: new Date().toISOString(),
              isForced: isForced
          }, ...state.logs]
      }));
    },

    payFlexibleLoan: async (loanId, amount, receipt) => {
        const { loans, remainingFund, currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return;
        }

        const loan = loans.find(l => l.id === loanId);
        if (!loan) return;

        let receiptUrl = null;
        if (receipt && receipt.startsWith('data:')) {
             try {
                 const fileExt = 'pdf';
                 const fileName = `${loanId}/flex_${Date.now()}.${fileExt}`;
                 const base64Data = receipt.split(',')[1];
                 const binaryData = atob(base64Data);
                 const arrayBuffer = new ArrayBuffer(binaryData.length);
                 const uint8Array = new Uint8Array(arrayBuffer);
                 for (let i = 0; i < binaryData.length; i++) { uint8Array[i] = binaryData.charCodeAt(i); }
                 const blob = new Blob([uint8Array], { type: 'application/pdf' });
                 
                 const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, blob);
                 if (uploadError) throw uploadError;
                 const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
                 receiptUrl = publicUrl;
             } catch(e) { console.error(e); }
        }

        const newPayment: Payment = {
            id: crypto.randomUUID(),
            amount: amount,
            dueDate: new Date().toISOString(),
            status: 'paid',
            paidAt: new Date().toISOString(),
            receipt: receiptUrl || undefined
        };

        const updatedPayments = [...loan.payments, newPayment];
        const newRemainingBalance = loan.remainingBalance - amount;
        const newRemainingFund = remainingFund + amount;

        const { error } = await supabase.from('loans').update({
            payments: updatedPayments,
            remaining_balance: newRemainingBalance
        }).eq('id', loanId);

        if (error) { console.error(error); return; }

        await supabase.from('app_settings').update({ remaining_fund: newRemainingFund }).eq('id', 1);

        const actionText = `سداد دفعة مرنة بقيمة ${amount} للموظف ${loan.employeeName}`;
        await supabase.from('logs').insert({ action: actionText, username: currentUser?.username || 'Unknown', is_forced: false });

        set(state => ({
            remainingFund: newRemainingFund,
            loans: state.loans.map(l => l.id === loanId ? { ...l, payments: updatedPayments, remainingBalance: newRemainingBalance } : l),
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser?.username, timestamp: new Date().toISOString(), isForced: false }, ...state.logs]
        }));
    },

    archiveLoan: async (loanId) => {
      const { loans, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }

      const loan = loans.find(l => l.id === loanId);
      if (!loan) return;

      const { error } = await supabase
        .from('loans')
        .update({ is_archived: true })
        .eq('id', loanId);

      if (error) {
          console.error('Error archiving loan:', error);
          return;
      }

      const actionText = i18n.t('logs.archiveLoan', { employee: loan.employeeName });
      await supabase.from('logs').insert({
          action: actionText,
          username: currentUser?.username || 'Unknown',
          is_forced: false
      });

      set(state => ({
          loans: state.loans.filter(l => l.id !== loanId),
          archivedLoans: [loan, ...state.archivedLoans],
          logs: [{
              id: crypto.randomUUID(),
              action: actionText,
              username: currentUser?.username || 'Unknown',
              timestamp: new Date().toISOString(),
              isForced: false
          }, ...state.logs]
      }));
    },

    unarchiveLoan: async (loanId) => {
      const { archivedLoans, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }

      const loan = archivedLoans.find(l => l.id === loanId);
      if (!loan) return;

      const { error } = await supabase
        .from('loans')
        .update({ is_archived: false })
        .eq('id', loanId);

      if (error) {
          console.error('Error unarchiving loan:', error);
          return;
      }

      const actionText = i18n.t('logs.unarchiveLoan', { employee: loan.employeeName });
      await supabase.from('logs').insert({
          action: actionText,
          username: currentUser?.username || 'Unknown',
          is_forced: false
      });

      set(state => ({
          archivedLoans: state.archivedLoans.filter(l => l.id !== loanId),
          loans: [loan, ...state.loans],
          logs: [{
              id: crypto.randomUUID(),
              action: actionText,
              username: currentUser?.username || 'Unknown',
              timestamp: new Date().toISOString(),
              isForced: false
          }, ...state.logs]
      }));
    },

    deleteLoan: async (loanId) => {
      const { archivedLoans, currentUser, maintenanceMode } = get();
      if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
          alert(i18n.t('common.maintenanceMode'));
          return;
      }

      const loan = archivedLoans.find(l => l.id === loanId);
      if (!loan || !currentUser) return;

      if (currentUser.role === 'admin') {
          const { error } = await supabase
            .from('loans')
            .delete()
            .eq('id', loanId);

          if (error) {
              console.error('Error deleting loan:', error);
              return;
          }

          const actionText = `تم حذف سلفة ${loan.employeeName} نهائياً بواسطة المدير`;
          await supabase.from('logs').insert({
              action: actionText,
              username: currentUser.username,
              is_forced: true
          });

          set(state => ({
              archivedLoans: state.archivedLoans.filter(l => l.id !== loanId),
              logs: [{
                  id: crypto.randomUUID(),
                  action: actionText,
                  username: currentUser.username,
                  timestamp: new Date().toISOString(),
                  isForced: true
              }, ...state.logs]
          }));
      } else {
          const { error } = await supabase
            .from('loans')
            .update({ 
                deletion_request_status: 'pending',
                deletion_requested_by: currentUser.username,
                deletion_requested_at: new Date().toISOString()
            })
            .eq('id', loanId);

          if (error) {
              console.error('Error requesting deletion:', error);
              return;
          }

          await supabase.from('notifications').insert({
              type: 'delete_request',
              message: `طلب حذف سلفة للموظف ${loan.employeeName} من ${currentUser.username}`,
              recipient: 'admin',
              sender: currentUser.username,
              data: { loanId, loanAmount: loan.amount, employeeName: loan.employeeName }
          });

          set(state => ({
              archivedLoans: state.archivedLoans.map(l => l.id === loanId ? {
                  ...l,
                  deletionRequestStatus: 'pending',
                  deletionRequestedBy: currentUser.username,
                  deletionRequestedAt: new Date().toISOString()
              } : l)
          }));
      }
    },

    approveDeletion: async (loanId) => {
        const { archivedLoans, currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return;
        }

        const loan = archivedLoans.find(l => l.id === loanId);
        if (!loan) return;

        await supabase.from('loans').delete().eq('id', loanId);

        const actionText = `الموافقة على حذف سلفة ${loan.employeeName} (بطلب من ${loan.deletionRequestedBy || 'غير معروف'})`;

        await supabase.from('logs').insert({
            action: actionText,
            username: currentUser?.username || 'admin',
            is_forced: true
        });

        if (loan.deletionRequestedBy) {
            await supabase.from('notifications').insert({
                type: 'request_approved',
                message: `تمت الموافقة على طلب حذف سلفة ${loan.employeeName}`,
                recipient: loan.deletionRequestedBy,
                sender: 'admin',
                data: { loanId, employeeName: loan.employeeName }
            });
        }

        set(state => ({
            archivedLoans: state.archivedLoans.filter(l => l.id !== loanId),
            logs: [{
                id: crypto.randomUUID(),
                action: actionText,
                username: currentUser?.username || 'admin',
                timestamp: new Date().toISOString(),
                isForced: true
            }, ...state.logs]
        }));
    },

    rejectDeletion: async (loanId) => {
        const { archivedLoans, currentUser, maintenanceMode } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            alert(i18n.t('common.maintenanceMode'));
            return;
        }

        const loan = archivedLoans.find(l => l.id === loanId);
        if (!loan) return;

        await supabase.from('loans').update({
            deletion_request_status: 'rejected',
            deletion_requested_by: null,
            deletion_requested_at: null
        }).eq('id', loanId);

        if (loan.deletionRequestedBy) {
            await supabase.from('notifications').insert({
                type: 'request_rejected',
                message: `تم رفض طلب حذف سلفة ${loan.employeeName}`,
                recipient: loan.deletionRequestedBy,
                sender: 'admin',
                data: { loanId, employeeName: loan.employeeName }
            });
        }

        set(state => ({
            archivedLoans: state.archivedLoans.map(l => l.id === loanId ? {
                ...l,
                deletionRequestStatus: 'rejected',
                deletionRequestedBy: undefined,
                deletionRequestedAt: undefined
            } : l)
        }));
    },

    markNotificationAsRead: async (notificationId) => {
        const { maintenanceMode, currentUser } = get();
        if (maintenanceMode && currentUser?.role !== 'admin' && currentUser?.username !== 'admin') {
            // Silently fail or alert? Alert is better to explain why it's not clearing.
            // But for notifications, maybe just return.
            return; 
        }

        await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
        set(state => ({
            notifications: state.notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        }));
    },
    
    resetData: () => {
        get().fetchData();
    },

    deleteLoansBulk: async (ids: string[]) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin') return;

        const { error } = await supabase.from('loans').delete().in('id', ids);
        if (error) {
            console.error('Error deleting loans:', error);
            return;
        }

        const actionText = `قام المدير بحذف ${ids.length} سجلات من القروض`;
        await supabase.from('logs').insert({
            action: actionText,
            username: currentUser.username,
            is_forced: true
        });

        set(state => ({
            loans: state.loans.filter(l => !ids.includes(l.id)),
            archivedLoans: state.archivedLoans.filter(l => !ids.includes(l.id)),
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser.username, timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
        }));
    },

    deleteLogsBulk: async (ids: string[]) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin') return;

        const { error } = await supabase.from('logs').delete().in('id', ids);
        if (error) {
            console.error('Error deleting logs:', error);
            return;
        }

        // We don't log log deletion to avoid recursion/irony, or we can log it but it will be the only one left if we deleted all.
        set(state => ({
            logs: state.logs.filter(l => !ids.includes(l.id))
        }));
    },

    deleteNotificationsBulk: async (ids: string[]) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin') return;

        const { error } = await supabase.from('notifications').delete().in('id', ids);
        if (error) {
            console.error('Error deleting notifications:', error);
            return;
        }

        set(state => ({
            notifications: state.notifications.filter(n => !ids.includes(n.id))
        }));
    },

    deleteFundHistoryBulk: async (ids: string[]) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin') return;

        const { error } = await supabase.from('fund_history').delete().in('id', ids);
        if (error) {
            console.error('Error deleting fund history:', error);
            return;
        }

        set(state => ({
            fundHistory: state.fundHistory.filter(f => !ids.includes(f.id))
        }));
    },

    clearStorage: async () => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin') return;

        const buckets = ['receipts', 'fund-receipts'];
        let totalDeleted = 0;

        for (const bucket of buckets) {
            try {
                // List files in the bucket
                const { data: files, error } = await supabase.storage.from(bucket).list('', { limit: 1000 });
                if (error) {
                    console.error(`Error listing files in ${bucket}:`, error);
                    continue;
                }

                if (files && files.length > 0) {
                    const paths = files.map(f => f.name);
                    // Supabase remove expects array of file names/paths
                    const { error: deleteError } = await supabase.storage.from(bucket).remove(paths);
                    
                    if (deleteError) {
                         console.error(`Error deleting files in ${bucket}:`, deleteError);
                    } else {
                        totalDeleted += files.length;
                    }
                }
            } catch (e) {
                console.error(`Exception clearing bucket ${bucket}:`, e);
            }
        }

        if (totalDeleted > 0) {
            const actionText = `قام المدير بحذف الملفات المؤقتة (${totalDeleted} ملف) لتفريغ المساحة`;
            await supabase.from('logs').insert({
                action: actionText,
                username: currentUser.username,
                is_forced: true
            });

            set(state => ({
                logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser.username, timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
            }));
        }
    },

    resetFundToTotal: async () => {
        const { currentUser, totalFund } = get();
        if (currentUser?.role !== 'admin') return;

        // Reset remaining fund to equal total fund
        const { error } = await supabase.from('app_settings').update({ remaining_fund: totalFund }).eq('id', 1);
        if (error) {
            console.error('Error resetting fund:', error);
            return;
        }

        // Clear fund history? The user said "Zeroing current balance". 
        // Context: "Initialization". Maybe we should also clear fund_history?
        // User asked for "Active Loans, Zeroing Balance, Archive, Logs, Notifications".
        // Fund History wasn't explicitly mentioned as a category to wipe, but usually resetting balance implies starting fresh.
        // However, I will stick to just resetting the number as requested "Zeroing current balance".
        
        const actionText = `قام المدير بتصفير الرصيد (إعادة تعيين الرصيد المتبقي إلى ${totalFund})`;
        await supabase.from('logs').insert({
            action: actionText,
            username: currentUser.username,
            is_forced: true
        });

        set(state => ({
            remainingFund: totalFund,
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser.username, timestamp: new Date().toISOString(), isForced: true }, ...state.logs]
        }));
    },

    updateLoanDates: async (loanId, newCreatedAt, payments) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') return;

        const { error } = await supabase.from('loans').update({
            created_at: newCreatedAt,
            payments: payments
        }).eq('id', loanId);

        if (error) {
            console.error('Error updating loan dates:', error);
            throw error; // Throw error to be caught by UI
        }

        set(state => ({
            loans: state.loans.map(l => l.id === loanId ? { ...l, createdAt: newCreatedAt, payments } : l),
            archivedLoans: state.archivedLoans.map(l => l.id === loanId ? { ...l, createdAt: newCreatedAt, payments } : l)
        }));
    },

    updateLogDate: async (logId, newTimestamp) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') return;

        const { error } = await supabase.from('logs').update({
            created_at: newTimestamp
        }).eq('id', logId);

        if (error) {
            console.error('Error updating log date:', error);
            throw error;
        }

        set(state => ({
            logs: state.logs.map(l => l.id === logId ? { ...l, timestamp: newTimestamp, createdAt: newTimestamp } : l)
        }));
    },

    updateFundHistoryDates: async (id, newCreatedAt, newApprovedAt) => {
        const { currentUser } = get();
        if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') return;

        const updates: any = { created_at: newCreatedAt };
        if (newApprovedAt) updates.approved_at = newApprovedAt;

        const { error } = await supabase.from('fund_history').update(updates).eq('id', id);

        if (error) {
            console.error('Error updating fund history dates:', error);
            throw error;
        }

        set(state => ({
            fundHistory: state.fundHistory.map(f => f.id === id ? { 
                ...f, 
                createdAt: newCreatedAt,
                approvedAt: newApprovedAt || f.approvedAt
            } : f)
        }));
    },

    wipeSystem: async () => {
        const { currentUser, totalFund, loans, archivedLoans, logs, notifications, fundHistory } = get();
        if (currentUser?.role !== 'admin' && currentUser?.username !== 'admin') return;

        // 1. Clear Storage first
        await get().clearStorage();

        // 2. Collect all IDs to delete from DB
        const loanIds = [...loans, ...archivedLoans].map(l => l.id);
        const logIds = logs.map(l => l.id);
        const notifIds = notifications.map(n => n.id);
        const historyIds = fundHistory.map(f => f.id);

        // 3. Delete from DB
        const promises = [];
        if (loanIds.length > 0) promises.push(supabase.from('loans').delete().in('id', loanIds));
        // Note: We might be deleting the log created by clearStorage here, which is fine/expected for a full wipe
        if (logIds.length > 0) promises.push(supabase.from('logs').delete().in('id', logIds)); 
        if (notifIds.length > 0) promises.push(supabase.from('notifications').delete().in('id', notifIds));
        if (historyIds.length > 0) promises.push(supabase.from('fund_history').delete().in('id', historyIds));

        await Promise.all(promises);

        // 4. Reset Fund Balance
        await supabase.from('app_settings').update({ remaining_fund: totalFund }).eq('id', 1);

        // 5. Add "System Wiped" Log
        const actionText = `قام المدير بتهيئة النظام بالكامل (حذف جميع البيانات والملفات)`;
        await supabase.from('logs').insert({
            action: actionText,
            username: currentUser?.username || 'admin',
            is_forced: true
        });

        // 6. Reset State
        set({
            loans: [],
            archivedLoans: [],
            logs: [{ id: crypto.randomUUID(), action: actionText, username: currentUser?.username || 'admin', timestamp: new Date().toISOString(), isForced: true }],
            notifications: [],
            fundHistory: [],
            remainingFund: totalFund
        });

        await get().fetchSystemStats();
    }
  };
});
