import { useState, useEffect, Suspense, lazy } from 'react';
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const EmployeeLogin = lazy(() => import('./components/EmployeeLogin'));
const EmployeePortal = lazy(() => import('./components/EmployeePortal'));
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { Toaster } from './components/ui/sonner';

type UserType = 'admin' | 'employee' | null;

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount to restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Determine user type based on role
        if (user.role === 'admin') {
          setUserType('admin');
        } else {
          setUserType('employee');
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAdminLogin = () => {
    setUserType('admin');
  };

  const handleEmployeeLogin = () => {
    setUserType('employee');
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    setUserType(null);
    setShowAdminLogin(true); // Always return to admin login page after logout
  };

  const toggleLoginType = () => {
    setShowAdminLogin(!showAdminLogin);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <div className="min-h-screen bg-gray-50">
          {!userType ? (
            showAdminLogin ? (
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <Login onLogin={handleAdminLogin} onSwitchToEmployee={toggleLoginType} />
              </Suspense>
            ) : (
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <EmployeeLogin onLogin={handleEmployeeLogin} onBack={toggleLoginType} />
              </Suspense>
            )
          ) : userType === 'admin' ? (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <Dashboard onLogout={handleLogout} />
            </Suspense>
          ) : (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              <EmployeePortal onLogout={handleLogout} />
            </Suspense>
          )}
        </div>
        <Toaster position="top-right" richColors />
      </CurrencyProvider>
    </LanguageProvider>
  );
}