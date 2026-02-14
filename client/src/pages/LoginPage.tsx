import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  theme: 'light' | 'dark';
  language: 'EN' | 'AR';
  onLoginSuccess?: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ theme, language, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@sbg.org');
  const [password, setPassword] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // إذا كانت البيانات الافتراضية، استخدم mock user
      if (email === 'admin@sbg.org' && password === '1234') {
        const mockUser = {
          id: 'admin-temp',
          email: 'admin@sbg.org',
          user_metadata: {
            name: 'Admin User',
            role: 'admin'
          }
        };
        if (onLoginSuccess) {
          onLoginSuccess(mockUser);
        }
        navigate('/');
        return;
      }

      // محاولة تسجيل الدخول مع Supabase إذا كان متاحاً
      if (supabase) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setError(language === 'AR' ? 'بيانات دخول غير صحيحة' : 'Invalid credentials');
        } else if (data?.user) {
          // تسجيل دخول ناجح مع Supabase
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
          navigate('/');
        }
      } else {
        setError(language === 'AR' ? 'بيانات دخول غير صحيحة' : 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(language === 'AR' ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 max-w-md w-full`}>
        <h1 className={`text-3xl font-bold mb-2 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {language === 'AR' ? 'تسجيل الدخول' : 'Login'}
        </h1>
        <p className={`text-center text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'AR' ? 'أدخل بيانات دخولك' : 'Enter your credentials'}
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'AR' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sbg.org"
              className={`w-full px-4 py-2 rounded-lg border transition ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'AR' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2 rounded-lg border transition ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                  : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-bold text-white transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (language === 'AR' ? 'جاري التحميل...' : 'Loading...') : (language === 'AR' ? 'تسجيل الدخول' : 'Login')}
          </button>
        </form>

        {/* Default Credentials Info */}
        <div className={`mt-6 p-4 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {language === 'AR' ? 'بيانات افتراضية للاختبار:' : 'Default test credentials:'}
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'AR' ? 'البريد: admin@sbg.org' : 'Email: admin@sbg.org'}
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'AR' ? 'كلمة المرور: 1234' : 'Password: 1234'}
          </p>
        </div>

        {/* Divider */}
        <div className={`my-6 flex items-center gap-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>
          <div className="flex-1 h-px bg-current"></div>
          <span className="text-xs">{language === 'AR' ? 'أو' : 'OR'}</span>
          <div className="flex-1 h-px bg-current"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/#/`,
                },
              });
            }
          }}
          className={`w-full py-2 rounded-lg font-medium border transition flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {language === 'AR' ? 'تسجيل الدخول عبر Google' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
