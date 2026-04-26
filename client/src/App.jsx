import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initAuthListener } from './services/authService';
import { useAuthStore } from './store/useAuthStore';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/auth/Login';

// Placeholder Pages
const AdminDashboard = () => <div className="card"><h1>Admin Dashboard</h1><p>Welcome to the admin panel.</p></div>;
const OperationsPanel = () => <div className="card"><h1>Operations Panel</h1><p>Live Job Queue will go here.</p></div>;
const FinanceDashboard = () => <div className="card"><h1>Finance Dashboard</h1><p>Revenue and transactions will go here.</p></div>;
const NotFound = () => <div className="card"><h1>404 Not Found</h1></div>;

function App() {
  const { isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark">
        <div className="w-12 h-12 border-4 border-spillway-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped with Layout */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']} />}>
            <Route path="/operations/*" element={<OperationsPanel />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FINANCE']} />}>
            <Route path="/finance/*" element={<FinanceDashboard />} />
          </Route>
          
          <Route path="/404" element={<NotFound />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
