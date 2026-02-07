import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import { useOhdaStore } from '../store/useOhdaStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Notifications: React.FC = () => {
  const { loans, notifications: dbNotifications, markNotificationAsRead, currentUser } = useOhdaStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Existing Logic: Payment Due Notifications
  const getDueNotifications = () => {
    const notifs: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    loans.forEach(loan => {
      loan.payments.forEach((payment, index) => {
        if (payment.status === 'paid') return;

        const dueDate = new Date(payment.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
          let message = '';
          let type: 'warning' | 'urgent' | 'info' = 'info';

          if (diffDays === 0) {
            message = t('notifications.dueToday', { payment: index + 1, employee: loan.employeeName });
            type = 'urgent';
          } else if (diffDays === 1) {
            message = t('notifications.dueTomorrow', { payment: index + 1, employee: loan.employeeName });
            type = 'warning';
          } else {
            message = t('notifications.dueInDays', { days: diffDays, payment: index + 1, employee: loan.employeeName });
            type = 'info';
          }

          notifs.push({
            id: `due-${payment.id}`,
            loanId: loan.id,
            message,
            type,
            date: payment.dueDate,
            isSystem: true
          });
        }
      });
    });
    return notifs;
  };

  const dueNotifications = getDueNotifications();
  
  // 2. New Logic: DB Notifications (Delete Requests)
  const unreadDbNotifications = (dbNotifications || []).filter(n => !n.isRead);

  const allNotifications = [
      ...unreadDbNotifications.map(n => ({
          id: n.id,
          message: n.message,
          type: n.type === 'delete_request' ? 'urgent' : (n.type === 'request_approved' || n.type === 'fund_approved' ? 'success' : 'warning'),
          date: n.createdAt,
          isSystem: false,
          data: n.data,
          originalType: n.type
      })),
      ...dueNotifications
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleNotificationClick = (notif: any) => {
      if (!notif.isSystem) {
          markNotificationAsRead(notif.id);
          if (notif.originalType === 'delete_request' && currentUser?.username === 'admin') {
              navigate('/archive');
          }
      } else {
          navigate(`/loan/${notif.loanId}`);
      }
      setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {allNotifications.length > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {allNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-100 font-bold text-gray-700 bg-gray-50 flex justify-between items-center">
            <span>{t('notifications.title')}</span>
            <span className="text-xs font-normal text-gray-500">{allNotifications.length} {t('notifications.new')}</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {allNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">{t('notifications.empty')}</p>
              </div>
            ) : (
              allNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer border-r-4 ${
                    notif.type === 'urgent' ? 'border-red-500 bg-red-50/30' :
                    notif.type === 'warning' ? 'border-orange-500 bg-orange-50/30' :
                    notif.type === 'success' ? 'border-green-500 bg-green-50/30' :
                    'border-blue-500 bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                      <div className="mt-1">
                          {notif.type === 'urgent' && <Bell className="w-4 h-4 text-red-600" />}
                          {notif.type === 'warning' && <Info className="w-4 h-4 text-orange-600" />}
                          {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {notif.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium leading-relaxed">
                            {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 text-left ltr">
                            {new Date(notif.date).toLocaleDateString('en-GB')} {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};