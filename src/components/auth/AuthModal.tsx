import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  KeyRound,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    signup,
    language
  } = useLifeOS();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(email || 'user@lifeos.app', password);
    } else if (authMode === 'signup') {
      signup(name || 'Architect', email || 'user@lifeos.app', password);
    } else {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setAuthMode('login');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f121a] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => { playSound('click'); setIsAuthModalOpen(false); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 p-0.5 mx-auto mb-3 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0d14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white font-display">
            {authMode === 'login' && (language === 'vi' ? 'Đăng nhập LIFE OS' : 'Sign In to LIFE OS')}
            {authMode === 'signup' && (language === 'vi' ? 'Khởi tạo Tài khoản Cá nhân' : 'Create Your Account')}
            {authMode === 'forgot' && (language === 'vi' ? 'Khôi phục Mật khẩu' : 'Reset Password')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'vi'
              ? 'Làm chủ cuộc sống • Nâng cấp bản thân'
              : 'Design Your Life • Upgrade Yourself'}
          </p>
        </div>

        {resetSent ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-white font-semibold">
              {language === 'vi'
                ? 'Mã xác thực khôi phục đã được gửi về email của bạn!'
                : 'Recovery security link has been dispatched to your email!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Họ và tên của bạn' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Minh Nhật"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">
                    {language === 'vi' ? 'Mật khẩu' : 'Password'}
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer mt-2"
            >
              {authMode === 'login' && (language === 'vi' ? 'Đăng nhập vào Hệ thống' : 'Enter System')}
              {authMode === 'signup' && (language === 'vi' ? 'Tạo tài khoản & Nhận 100 XP' : 'Register & Claim 100 XP')}
              {authMode === 'forgot' && (language === 'vi' ? 'Gửi liên kết khôi phục' : 'Send Recovery Link')}
            </button>
          </form>
        )}

        {/* Bottom Mode Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {authMode === 'login' ? (
            <p>
              {language === 'vi' ? 'Chưa có tài khoản?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                {language === 'vi' ? 'Đăng ký ngay' : 'Sign up'}
              </button>
            </p>
          ) : (
            <p>
              {language === 'vi' ? 'Đã có tài khoản?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                {language === 'vi' ? 'Đăng nhập' : 'Sign in'}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
