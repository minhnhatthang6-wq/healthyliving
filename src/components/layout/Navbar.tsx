import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Globe,
  Plus,
  User as UserIcon,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

interface NavbarProps {
  onOpenQuickAdd: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickAdd,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const {
    user,
    language,
    setLanguage,
    levelInfo,
    lifeOSIndex,
    exportDataJson,
    importDataJson,
    resetAllData,
    logout,
    setIsAuthModalOpen,
    setAuthMode
  } = useLifeOS();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('click');
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
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#08090d]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => playSound('click')}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  LIFE OS
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold">
                  v2.5 Pro
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-tight">
                {language === 'vi' ? 'Làm chủ cuộc sống • Nâng cấp bản thân' : 'Design Your Life • Upgrade Yourself'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Life Index & Level Progress HUD */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Level Progress */}
          <div className="flex items-center space-x-3 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">Lv.{levelInfo.level}</span>
            </div>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-emerald-300 font-mono">
              {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
            </span>
          </div>

          {/* Life OS Index */}
          <div className="flex items-center space-x-2 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="text-[11px] font-medium text-slate-300">Life Index:</span>
            <span className="text-xs font-extrabold text-emerald-400 font-mono">
              {lifeOSIndex}/100
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => { playSound('click'); onOpenQuickAdd(); }}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Thêm nhanh' : 'Quick Add'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            aria-label="Toggle Sound Effects"
            onClick={toggleSound}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800/80 transition"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            aria-label="Toggle Language"
            onClick={() => { playSound('click'); setLanguage(language === 'vi' ? 'en' : 'vi'); }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800/80 transition"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase">{language}</span>
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {user ? (
              <button
                type="button"
                aria-label="User Profile Menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 px-2 py-1.5 rounded-xl hover:bg-slate-800/60 border border-slate-800 transition focus:outline-none"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <span className="hidden md:inline text-xs font-semibold text-slate-200 pr-1 max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Đăng nhập' : 'Sign In'}</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {profileDropdownOpen && user && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f121a] border border-slate-800 shadow-2xl p-2 text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Danh hiệu:</span>
                    <span className="font-semibold text-emerald-400">{user.title}</span>
                  </div>
                </div>

                {/* Data Backup & Cloud Sync */}
                <div className="py-2 border-b border-slate-800/80 space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'vi' ? 'Dữ liệu & Đồng bộ' : 'Data & Cloud Sync'}
                  </div>
                  <button
                    type="button"
                    onClick={() => { handleExport(); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition"
                  >
                    <span className="flex items-center space-x-2">
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'vi' ? 'Sao lưu dữ liệu (Export JSON)' : 'Export Backup JSON'}</span>
                    </span>
                    {copyFeedback && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleImport(); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>{language === 'vi' ? 'Khôi phục từ tệp (Import JSON)' : 'Import Backup JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(language === 'vi' ? 'Khôi phục dữ liệu mẫu ban đầu?' : 'Reset all data to default mock?')) {
                        resetAllData();
                        setProfileDropdownOpen(false);
                      }
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/70 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Khôi phục dữ liệu mẫu' : 'Reset to Sample Data'}</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Đăng xuất tài khoản' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
