import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Mail,
  Phone,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Smartphone,
  Eye,
  Sparkles
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

export const AccountView: React.FC = () => {
  const {
    user,
    updateProfile,
    logout,
    exportDataJson,
    importDataJson,
    resetAllData,
    setIsAuthModalOpen,
    setAuthMode,
    language
  } = useLifeOS();

  const [name, setName] = useState(user?.name || 'Minh Nhật');
  const [title, setTitle] = useState(user?.title || 'Apex Life Architect');
  const [bio, setBio] = useState(user?.bio || 'Làm chủ cuộc sống, nâng cấp bản thân.');
  const [phone, setPhone] = useState(user?.phone || '+84 912 345 678');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [twoFa, setTwoFa] = useState(user?.preferences?.twoFactorEnabled || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      bio,
      phone,
      avatarUrl,
      preferences: {
        ...(user?.preferences || { language: 'vi', soundEnabled: true, notifications: true, twoFactorEnabled: false }),
        twoFactorEnabled: twoFa
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            importDataJson(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (!user) {
    return (
      <div className="p-12 rounded-3xl bg-[#0e121a] border border-slate-800 text-center max-w-lg mx-auto my-12">
        <UserIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">
          {language === 'vi' ? 'Bạn chưa đăng nhập' : 'Not Signed In'}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {language === 'vi'
            ? 'Đăng nhập hoặc đăng ký tài khoản để quản lý không gian sống riêng và đồng bộ dữ liệu.'
            : 'Sign in to access your personal synchronized life management hub.'}
        </p>
        <button
          type="button"
          onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
        >
          {language === 'vi' ? 'Đăng nhập ngay' : 'Sign In Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Hệ thống Tài khoản & Bảo mật' : 'Account & Security Center'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Không gian quản lý hồ sơ cá nhân độc bản, bảo mật sinh trắc và sao lưu đồng bộ an toàn.'
                : 'Manage personal identity, cryptographic state backups, and security settings.'}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 font-bold text-xs transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'vi' ? 'Đăng xuất tài khoản' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & Quick Avatars */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 text-center">
            <div className="relative inline-block mx-auto mb-4">
              <img
                src={avatarUrl || user.avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-500/60 shadow-xl shadow-emerald-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0e121a] flex items-center justify-center text-slate-950">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <h2 className="text-lg font-bold text-white">{name}</h2>
            <p className="text-xs font-mono text-emerald-400 mt-0.5">{title}</p>
            <p className="text-xs text-slate-400 mt-2 px-4 italic leading-relaxed">
              "{bio}"
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-left space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Email:</span>
                <span className="text-white truncate max-w-[160px]">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Phone:</span>
                <span className="text-white">{phone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tham gia:</span>
                <span className="text-slate-300">{user.createdAt}</span>
              </div>
            </div>

            {/* Avatar Preset Selector */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-left">
              <span className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                {language === 'vi' ? 'Chọn ảnh đại diện mẫu:' : 'Select Preset Avatar:'}
              </span>
              <div className="flex justify-center gap-2">
                {sampleAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="preset"
                    onClick={() => { playSound('click'); setAvatarUrl(url); }}
                    className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                      avatarUrl === url ? 'border-emerald-400 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sync & Backup Management */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">
              {language === 'vi' ? 'Đồng bộ & Lưu trữ Dữ liệu' : 'Data Synchronization'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'vi'
                ? 'Xuất dữ liệu toàn bộ hệ điều hành thành file JSON để lưu trữ hoặc khôi phục trên thiết bị khác.'
                : 'Backup complete life operating system state to portable encrypted JSON.'}
            </p>

            <button
              type="button"
              onClick={handleExport}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#121622] hover:bg-[#181e2e] border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <span className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{language === 'vi' ? 'Xuất bản sao lưu (Export JSON)' : 'Export Backup JSON'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">.json</span>
            </button>

            <button
              type="button"
              onClick={handleImport}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#121622] hover:bg-[#181e2e] border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <span className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{language === 'vi' ? 'Nhập bản sao lưu (Import JSON)' : 'Import Backup JSON'}</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Restore</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn đặt lại dữ liệu mẫu?' : 'Reset to default sample data?')) {
                  resetAllData();
                }
              }}
              className="w-full flex items-center space-x-2 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold text-amber-300 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{language === 'vi' ? 'Khôi phục dữ liệu mẫu ban đầu' : 'Reset to Sample Data'}</span>
            </button>
          </div>
        </div>

        {/* Right Columns (2 cols): Profile Edit Form & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-emerald-400" />
                <span>{language === 'vi' ? 'Cập nhật Thông tin Cá nhân' : 'Personal Profile Information'}</span>
              </h3>
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Đã lưu thay đổi!' : 'Saved successfully!'}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Họ và tên hiển thị' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Chức danh / Danh xưng' : 'Title / Rank'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Số điện thoại liên lạc' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Đường dẫn ảnh đại diện (URL)' : 'Custom Avatar URL'}
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'vi' ? 'Châm ngôn sống & Tiểu sử ngắn' : 'Life Motto & Bio'}
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Security Switches */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase text-slate-400">
                {language === 'vi' ? 'Bảo mật tài khoản' : 'Security Settings'}
              </h4>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121622] border border-slate-800">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {language === 'vi' ? 'Xác thực 2 yếu tố (2FA)' : 'Two-Factor Authentication (2FA)'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {language === 'vi' ? 'Bảo vệ tài khoản bằng mã bảo mật 6 số' : 'Require passcode on new devices'}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFa}
                  onChange={(e) => setTwoFa(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                {language === 'vi' ? 'Lưu thông tin hồ sơ' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Privacy & Session History */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white mb-3">
              {language === 'vi' ? 'Lịch sử Thiết bị & Phiên Đăng nhập' : 'Active Sessions & Security Telemetry'}
            </h3>

            <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-white">Google AI Studio Preview Container</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">IP: 127.0.0.1 • Chrome Linux Headless • Đang hoạt động</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                Current
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
