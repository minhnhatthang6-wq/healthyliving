import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Activity,
  UtensilsCrossed,
  Timer,
  Compass,
  HeartPulse,
  Wallet,
  Sparkles,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, language, totalXp, levelInfo } = useLifeOS();

  const navigationItems = [
    {
      id: 'dashboard',
      labelVi: 'Bảng điều khiển',
      labelEn: 'Smart Dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'assistant',
      labelVi: 'Trợ lý AI Gemini',
      labelEn: 'AI Life Assistant',
      icon: Bot,
      highlight: true
    },
    {
      id: 'body',
      labelVi: 'Hồ sơ cơ thể',
      labelEn: 'Smart Body Profile',
      icon: Activity
    },
    {
      id: 'nutrition',
      labelVi: 'Trợ lý Dinh dưỡng',
      labelEn: 'Smart Nutrition',
      icon: UtensilsCrossed
    },
    {
      id: 'focus',
      labelVi: 'Chế độ Tập trung',
      labelEn: 'Focus Mode',
      icon: Timer
    },
    {
      id: 'goals',
      labelVi: 'Kiến trúc Mục tiêu',
      labelEn: 'Goal Architect',
      icon: Compass
    },
    {
      id: 'health',
      labelVi: 'Quản lý Sức khỏe',
      labelEn: 'Health Intelligence',
      icon: HeartPulse
    },
    {
      id: 'finance',
      labelVi: 'Tài chính cá nhân',
      labelEn: 'Smart Finance',
      icon: Wallet
    },
    {
      id: 'skills',
      labelVi: 'Cây kỹ năng RPG',
      labelEn: 'Skill Tree',
      icon: Sparkles
    },
    {
      id: 'digital_twin',
      labelVi: 'Bản sao số cá nhân',
      labelEn: 'Digital Twin',
      icon: GitBranch
    },
    {
      id: 'account',
      labelVi: 'Tài khoản & Bảo mật',
      labelEn: 'Account & Security',
      icon: ShieldCheck
    }
  ];

  const handleSelect = (id: string) => {
    playSound('click');
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#0a0d14]/95 md:bg-[#090b10] border-r border-slate-800/80 flex flex-col justify-between py-4 px-3 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-1.5 overflow-y-auto pr-1">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            {language === 'vi' ? 'Hệ thống Module' : 'Core System Modules'}
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/5 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800/50 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">
                    {language === 'vi' ? item.labelVi : item.labelEn}
                  </span>
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Status Widget */}
        <div className="pt-3 border-t border-slate-800/80 px-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="mb-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold uppercase mb-0.5">
                <span>{language === 'vi' ? 'Cấp độ nhân vật' : 'Player Rank'}</span>
                <span className="text-emerald-400">Lv.{levelInfo.level}</span>
              </div>
              <p className="text-xs font-bold text-white truncate font-display">
                {language === 'vi' ? levelInfo.titleVi : levelInfo.title}
              </p>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>XP: {totalXp.toLocaleString()}</span>
              <span>{levelInfo.progressPercent}% to Lv.{levelInfo.level + 1}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
