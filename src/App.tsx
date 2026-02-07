import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { LoanDetails } from './pages/LoanDetails';
import { Login } from './pages/Login';
import { useOhdaStore } from './store/useOhdaStore';
import { LogViewer } from './components/LogViewer';
import { ConnectionStatus } from './components/ConnectionStatus';

import { Archive } from './pages/Archive';
import { FundSettings } from './pages/FundSettings';
import { SystemReset } from './pages/SystemReset';
import { UsersManagement } from './pages/UsersManagement';
import { DataCorrection } from './pages/DataCorrection';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, fetchData, appUsers, logout } = useOhdaStore();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Check if user is disabled or deleted
  useEffect(() => {
    if (currentUser && appUsers.length > 0) {
        const userRecord = appUsers.find(u => u.username === currentUser.username);
        // Only check if user exists in DB. If not in DB (hardcoded), we skip this check.
        if (userRecord && !userRecord.isActive) {
            logout();
            // Force reload to clear state effectively
            window.location.href = '/login'; 
            alert('تم تعطيل حسابك من قبل المسؤول. (Your account has been disabled)');
        }
    }
  }, [currentUser, appUsers, logout]);

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { currentUser } = useOhdaStore();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col" dir="rtl">
      {currentUser && <LogViewer />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loan/:id" 
            element={
              <ProtectedRoute>
                <LoanDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/archive" 
            element={
              <ProtectedRoute>
                <Archive />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fund-settings" 
            element={
              <ProtectedRoute>
                <FundSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reset-system" 
            element={
              <ProtectedRoute>
                <SystemReset />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data-correction" 
            element={
              <ProtectedRoute>
                <DataCorrection />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="font-medium">
              حقوق الطباعة والنشر محفوظة لصالح مجموعة بن حريز القابضة في الامارات العربية المتحدة
            </p>
            <ConnectionStatus />
          </div>
          <p className="flex items-center gap-1">
            تم الاعداد بواسطة المهندس محمد خطاب
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
