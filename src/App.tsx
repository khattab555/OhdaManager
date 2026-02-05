import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { LoanDetails } from './pages/LoanDetails';
import { Login } from './pages/Login';
import { useOhdaStore } from './store/useOhdaStore';
import { LogViewer } from './components/LogViewer';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useOhdaStore();
  const location = useLocation();

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
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-4">
          <p className="font-medium">
            حقوق الطباعة والنشر محفوظة لصالح مجموعة بن حريز القابضة في الامارات العربية المتحدة
          </p>
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
