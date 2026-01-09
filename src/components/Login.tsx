import { useState, FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';
import logoLogin from '../logo_login.png';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/api';
import toast from '../utils/toast';

interface LoginProps {
  onLogin: () => void;
  onSwitchToEmployee: () => void;
}

export default function Login({ onLogin, onSwitchToEmployee }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleQuickLogin = async () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setIsLoading(true);

    try {
      // Use real API login with quick login credentials
      const response = await authService.login({
        email: 'admin@example.com',
        password: 'admin123'
      });

      // Clear all previous authentication data
      localStorage.clear();

      // Set new authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('Login successful');
      onLogin();
    } catch (error: any) {
      console.error('Quick login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check API server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      // Clear all previous authentication data
      localStorage.clear();

      // Set new authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={logoLogin} alt="HR System Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t('auth.title')}</CardTitle>
            <CardDescription>{t('auth.subtitle')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleQuickLogin}
                disabled={isLoading}
              >
                Quick Login
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.signingIn')}
                  </>
                ) : (
                  t('auth.signIn')
                )}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onSwitchToEmployee}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              {t('auth.employeeLogin')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}