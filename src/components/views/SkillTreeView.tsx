import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Brain,
  HeartPulse,
  Apple,
  Clock,
  TrendingUp,
  MessageSquare,
  Award,
  Crown,
  ShieldCheck,
  Droplets,
  Utensils,
  Moon
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { SkillCategory } from '../../types';

export const SkillTreeView: React.FC = () => {
  const {
    skillNodes,
    upgradeSkill,
    badges,
    totalXp,
    levelInfo,
    language
  } = useLifeOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelVi: 'Toàn bộ Kỹ năng', labelEn: 'All Skills' },
    { id: 'discipline', labelVi: '⚡ Kỷ luật', labelEn: 'Discipline' },
    { id: 'knowledge', labelVi: '🧠 Kiến thức', labelEn: 'Knowledge' },
    { id: 'healthy_lifestyle', labelVi: '🥗 Lối sống lành mạnh', labelEn: 'Healthy Lifestyle' },
    { id: 'time_management', labelVi: '⏳ Quản lý thời gian', labelEn: 'Time Management' },
    { id: 'communication', labelVi: '🗣️ Giao tiếp', labelEn: 'Communication' },
    { id: 'creativity', labelVi: '🎨 Sáng tạo', labelEn: 'Creativity' }
  ];

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Brain': return Brain;
      case 'HeartPulse': return HeartPulse;
      case 'Apple': return Apple;
      case 'Clock': return Clock;
      case 'TrendingUp': return TrendingUp;
      case 'MessageSquare': return MessageSquare;
      default: return Sparkles;
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return Droplets;
      case 'Zap': return Zap;
      case 'Utensils': return Utensils;
      case 'Crown': return Crown;
      case 'ShieldCheck': return ShieldCheck;
      case 'Moon': return Moon;
      default: return Award;
    }
  };

  const filteredSkills = selectedCategory === 'all'
    ? skillNodes
    : skillNodes.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Top RPG Player Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-[#0e141f] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Crown className="w-6 h-6" />
              </span>
              <span className="text-xs uppercase font-mono font-bold text-emerald-400 tracking-wider">
                GAMIFIED TALENT TREE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {language === 'vi' ? 'Cây Kỹ năng & Cấp bậc Nhân vật' : 'Skill Tree & Character Archetype'}
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Mỗi hành động tích cực trong ngày đều biến thành điểm kinh nghiệm (XP) để mở khóa năng lực tư duy, rèn giũa kỷ luật và nâng tầm nội lực.'
                : 'Turn every real-world habit, workout, and deep work block into XP to level up your neuroplastic skill nodes.'}
            </p>
          </div>

          {/* Level Badge Card */}
          <div className="p-5 rounded-2xl bg-[#0a0d14]/90 border border-emerald-500/40 text-center w-full md:w-64 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {language === 'vi' ? 'Cấp bậc hiện tại' : 'Character Level'}
            </span>
            <div className="text-3xl font-display font-extrabold text-white my-1 flex items-center justify-center space-x-1.5">
              <span className="text-emerald-400">Lv.{levelInfo.level}</span>
            </div>
            <p className="text-xs font-semibold text-emerald-300 truncate">
              {language === 'vi' ? levelInfo.titleVi : levelInfo.title}
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 my-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {totalXp.toLocaleString()} Total XP • {levelInfo.progressPercent}% to Next Level
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => { playSound('click'); setSelectedCategory(cat.id); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                  : 'bg-[#0e121a] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? cat.labelVi : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Skill Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSkills.map((skill) => {
          const Icon = getSkillIcon(skill.icon);
          const percent = Math.min(100, Math.round((skill.currentXp / skill.requiredXp) * 100));
          return (
            <div
              key={skill.id}
              className="p-5 rounded-3xl bg-[#0e121a] border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Tier {skill.level}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">{skill.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {skill.description}
                </p>
              </div>

              <div>
                <div className="p-3 rounded-2xl bg-[#121622] border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Tiến trình Node:</span>
                    <span className="text-emerald-400 font-bold">{skill.currentXp}/{skill.requiredXp} XP</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => upgradeSkill(skill.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-bold text-xs border border-slate-700 hover:border-emerald-500 transition active:scale-95 cursor-pointer"
                >
                  {language === 'vi' ? 'Nâng cấp Tier (+150 XP)' : 'Upgrade Tier (+150 XP)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges & Achievements Section */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>{language === 'vi' ? 'Huy hiệu Danh dự & Thành tựu' : 'Honors & Achievements'}</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => {
            const Icon = getBadgeIcon(b.icon);
            const rarityColor =
              b.rarity === 'legendary'
                ? 'border-amber-400/60 bg-amber-500/10 text-amber-300'
                : b.rarity === 'epic'
                ? 'border-purple-400/60 bg-purple-500/10 text-purple-300'
                : b.rarity === 'rare'
                ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 bg-slate-900/60 text-slate-300';

            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition flex items-start space-x-3.5 ${
                  b.unlocked
                    ? 'bg-[#121622] border-emerald-500/30'
                    : 'bg-slate-900/30 border-slate-800/80 opacity-50'
                }`}
              >
                <div className={`p-3 rounded-2xl border ${rarityColor} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-white">{b.name}</h3>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold border border-slate-700">
                      {b.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {b.description}
                  </p>
                  {b.unlocked && b.unlockedAt && (
                    <span className="text-[9px] text-emerald-400 font-mono mt-1.5 block">
                      ✓ Đạt ngày {b.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
