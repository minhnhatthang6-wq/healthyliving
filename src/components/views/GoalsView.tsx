import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Flag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { Goal, GoalCategory, PriorityLevel } from '../../types';

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    toggleGoalMilestone,
    deleteGoal,
    language
  } = useLifeOS();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('learning');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [milestonesInput, setMilestonesInput] = useState('Nhiệm vụ 1\nNhiệm vụ 2\nNhiệm vụ 3');
  const [xpReward, setXpReward] = useState(800);

  const categories = [
    { id: 'all', labelVi: 'Tất cả', labelEn: 'All' },
    { id: 'learning', labelVi: 'Học tập & Trí tuệ', labelEn: 'Learning' },
    { id: 'career', labelVi: 'Sự nghiệp & Công việc', labelEn: 'Career' },
    { id: 'health', labelVi: 'Sức khỏe & Thể lực', labelEn: 'Health' },
    { id: 'finance', labelVi: 'Tài chính cá nhân', labelEn: 'Finance' },
    { id: 'skills', labelVi: 'Kỹ năng chuyên môn', labelEn: 'Skills' }
  ];

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter((g) => g.category === selectedCategory);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: 'm_' + Date.now() + '_' + idx,
        title: t,
        completed: false
      }));

    addGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      deadline,
      milestones,
      xpReward: Number(xpReward) || 500
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Kiến trúc Mục tiêu (Goal Architect)' : 'Goal Architect'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Phương pháp chia nhỏ mục tiêu lớn theo OKR & SMART, thiết lập lộ trình rõ ràng và biến tầm nhìn thành hành động mỗi ngày.'
                : 'Deconstruct massive life ambitions into actionable milestones with priority routing and timeline accountability.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); setShowAddModal(true); }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'vi' ? 'Kiến tạo mục tiêu mới' : 'Architect New Goal'}</span>
          </button>
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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const completedMilestones = goal.milestones.filter((m) => m.completed).length;
          const totalMilestones = goal.milestones.length;

          const priorityBadge =
            goal.priority === 'urgent'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              : goal.priority === 'high'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={goal.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                goal.isCompleted
                  ? 'bg-[#0b1414] border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#0e121a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${priorityBadge}`}>
                    {goal.priority}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{goal.xpReward} XP
                    </span>
                    <button
                      type="button"
                      aria-label="Delete goal"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {goal.description}
                </p>

                {/* Progress bar */}
                <div className="p-3 rounded-2xl bg-[#121622] border border-slate-800/80 mb-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">
                      {language === 'vi' ? 'Tiến độ hoàn thành:' : 'Progress:'}
                    </span>
                    <span className="font-bold font-mono text-emerald-400">
                      {goal.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
                    <span>{completedMilestones}/{totalMilestones} Milestones</span>
                    <span>Deadline: {goal.deadline}</span>
                  </div>
                </div>

                {/* Sub-milestones checklist */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block">
                    {language === 'vi' ? 'Cột mốc thực thi:' : 'Milestones:'}
                  </span>
                  {goal.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleGoalMilestone(goal.id, m.id)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition ${
                        m.completed
                          ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 line-through'
                          : 'bg-[#141926] border-slate-800 text-slate-300 hover:border-emerald-500/40'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Toggle milestone ${m.title}`}
                        className="text-slate-400 hover:text-emerald-400 transition shrink-0"
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <span className="text-xs truncate">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reflection note if available */}
              {goal.reflectionNotes && (
                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                  "{goal.reflectionNotes}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Thiết lập Mục tiêu Cuộc sống' : 'Architect New Goal'}</span>
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Tiêu đề mục tiêu lớn' : 'Goal Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'vi' ? 'vd: Đạt chứng chỉ quốc tế, Mua nhà, Chạy marathon...' : 'Goal title...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Mô tả & Ý nghĩa mục tiêu' : 'Description & Purpose'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder={language === 'vi' ? 'Lý do mục tiêu này quan trọng đối với bạn...' : 'Why this matters...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Danh mục' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GoalCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="learning">{language === 'vi' ? 'Học tập' : 'Learning'}</option>
                    <option value="career">{language === 'vi' ? 'Sự nghiệp' : 'Career'}</option>
                    <option value="health">{language === 'vi' ? 'Sức khỏe' : 'Health'}</option>
                    <option value="finance">{language === 'vi' ? 'Tài chính' : 'Finance'}</option>
                    <option value="skills">{language === 'vi' ? 'Kỹ năng' : 'Skills'}</option>
                    <option value="lifestyle">{language === 'vi' ? 'Đời sống' : 'Lifestyle'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Mức độ ưu tiên' : 'Priority'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="urgent">{language === 'vi' ? 'Khẩn cấp (Urgent)' : 'Urgent'}</option>
                    <option value="high">{language === 'vi' ? 'Cao (High)' : 'High'}</option>
                    <option value="medium">{language === 'vi' ? 'Trung bình (Medium)' : 'Medium'}</option>
                    <option value="low">{language === 'vi' ? 'Thấp (Low)' : 'Low'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Hạn hoàn thành (Deadline)' : 'Deadline'}
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Thưởng XP khi đạt' : 'XP Reward'}
                  </label>
                  <input
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Các cột mốc nhiệm vụ nhỏ (mỗi dòng 1 việc)' : 'Milestones (one per line)'}
                </label>
                <textarea
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {language === 'vi' ? 'Tạo mục tiêu' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
