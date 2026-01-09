import { useState, useEffect, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Lock, Loader2 } from 'lucide-react';
import logoLogin from '../logo_login.png';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { authService } from '../services/api';
import toast from '../utils/toast';

interface EmployeeLoginProps {
  onLogin: () => void;
  onBack?: () => void;
}

export default function EmployeeLogin({ onLogin, onBack }: EmployeeLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(3);
  const { t } = useLanguage();

  // Auto-fill credentials on mount
  useEffect(() => {
    setEmail('john.smith@company.com');
    setPassword('employee123');
  }, []);

  // Auto-submit countdown
  useEffect(() => {
    if (autoSubmitCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoSubmitCountdown(autoSubmitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Call handleLogin without an event object for auto-submit
      handleLogin({ preventDefault: () => { } } as FormEvent);
    }
  }, [autoSubmitCountdown]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      localStorage.clear(); // Clear all previous authentication data
      const response = await authService.login({ email, password });

      // Ensure the user object has a role field, default to 'employee'
      const userData = response.data.user;
      if (!userData.role) {
        userData.role = 'employee';
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful');
      onLogin();
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
              <img src={logoLogin} alt="HR System Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            {t('employee.portal')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('employee.loginDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={t('common.enterEmail')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('common.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder={t('common.enterPassword')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p className="font-medium mb-1">🎯 {t('employee.demoMode')}</p>
            <p className="text-xs text-blue-600">
              {autoSubmitCountdown > 0
                ? `${t('employee.autoSubmitting')} ${autoSubmitCountdown}${t('employee.seconds')}...`
                : t('employee.loggingIn')}
            </p>
          </div>

          <Button
            onClick={(e) => handleLogin(e as any)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('common.login')
            )}
          </Button>

          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>{t('employee.demoCredentials')}:</p>
            <p className="font-mono text-xs bg-gray-50 p-2 rounded">
              john.smith@company.com / employee123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}