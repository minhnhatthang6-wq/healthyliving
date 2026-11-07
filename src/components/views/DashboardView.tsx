import React from 'react';
import {
  Sparkles,
  Zap,
  Droplets,
  Moon,
  Timer,
  CheckCircle2,
  Circle,
  TrendingUp,
  ArrowRight,
  Flame,
  Plus,
  Shield,
  Utensils
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

interface DashboardViewProps {
  onOpenQuickAdd: (defaultType?: 'task' | 'water' | 'expense' | 'workout') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAdd }) => {
  const {
    user,
    language,
    lifeOSIndex,
    levelInfo,
    dailyTasks,
    toggleTask,
    waterIntakeMl,
    waterTargetMl,
    addWater,
    mealPlan,
    sleepLog,
    focusSessions,
    setActiveTab
  } = useLifeOS();

  const completedTasks = dailyTasks.filter((t) => t.completed).length;
  const totalTasks = dailyTasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const totalMealCalories = mealPlan.meals.reduce((acc, m) => acc + m.totalCalories, 0);
  const completedMealCalories = mealPlan.meals
    .filter((m) => mealPlan.completedMealIds.includes(m.id))
    .reduce((acc, m) => acc + m.totalCalories, 0);

  const todayFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner HUD */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#0e131d] to-[#0a151b] border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SYSTEM ONLINE • v2.5</span>
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {language === 'vi' ? 'Chào mừng trở lại,' : 'Welcome back,'}{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                {user?.name || 'Architect'}
              </span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-light">
              {language === 'vi'
                ? '“Làm chủ cuộc sống, nâng cấp bản thân.” Hệ thống đã sẵn sàng đồng hành cùng bạn tối ưu hóa từng khoảnh khắc hôm nay.'
                : '“Design Your Life. Upgrade Yourself.” Your personal life operating system is fully synchronized for peak performance.'}
            </p>

            {/* Quick Action Chips */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => { playSound('click'); addWater(250); }}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition active:scale-95"
              >
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>+250ml {language === 'vi' ? 'Nước' : 'Water'}</span>
              </button>

              <button
                type="button"
                onClick={() => { playSound('click'); setActiveTab('focus'); }}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition active:scale-95"
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'vi' ? 'Bắt đầu Pomodoro 25p' : 'Start 25m Focus'}</span>
              </button>

              <button
                type="button"
                onClick={() => { playSound('click'); onOpenQuickAdd('task'); }}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'vi' ? 'Thêm nhiệm vụ' : 'Add Task'}</span>
              </button>

              <button
                type="button"
                onClick={() => { playSound('click'); setActiveTab('assistant'); }}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'vi' ? 'Hỏi AI Life Assistant' : 'Ask AI Assistant'}</span>
              </button>
            </div>
          </div>

          {/* Life Index Radar Card */}
          <div className="bg-[#0b0e17]/90 border border-emerald-500/30 rounded-2xl p-5 w-full md:w-64 flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              {language === 'vi' ? 'Chỉ số Life OS Index' : 'Life OS Composite Index'}
            </span>
            <div className="relative my-3 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * lifeOSIndex) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-extrabold text-white">{lifeOSIndex}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">/100</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-emerald-400">
              {lifeOSIndex >= 80
                ? language === 'vi' ? 'Đỉnh cao phong độ ⚡' : 'Peak Condition ⚡'
                : language === 'vi' ? 'Ổn định & phát triển' : 'Stable & Growing'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Vital Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Tasks */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Nhiệm vụ hôm nay' : 'Today Tasks'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-display font-bold text-white">
              {completedTasks}/{totalTasks}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              ({taskPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Water */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Nước uống' : 'Hydration'}
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-display font-bold text-white">
              {waterIntakeMl.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / {waterTargetMl.toLocaleString()} ml
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((waterIntakeMl / waterTargetMl) * 100))}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Focus Minutes */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Thời gian tập trung' : 'Deep Work'}
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-display font-bold text-white">
              {todayFocusMinutes}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {language === 'vi' ? 'phút' : 'mins'}
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold ml-auto">
              {focusSessions.length} {language === 'vi' ? 'phiên' : 'sessions'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (todayFocusMinutes / 60) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Sleep Score */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Chất lượng giấc ngủ' : 'Sleep Score'}
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-display font-bold text-white">
              {sleepLog.qualityScore}
            </span>
            <span className="text-xs font-mono text-purple-400 font-semibold">
              / 100
            </span>
            <span className="text-xs font-mono text-slate-400 ml-auto">
              {sleepLog.durationHours}h {language === 'vi' ? 'ngủ' : 'sleep'}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${sleepLog.qualityScore}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Split: Tasks Today + Nutrition & Focus Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Today's Tasks & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Daily Tasks Card */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{language === 'vi' ? 'Nhiệm vụ trọng tâm hôm nay' : 'Priority Tasks Today'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'vi' ? 'Hoàn thành nhiệm vụ để tích lũy XP và nâng cấp kỹ năng' : 'Complete daily tasks to gain XP and rank up'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { playSound('click'); onOpenQuickAdd('task'); }}
                className="flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Thêm mới' : 'Add'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 line-through'
                      : 'bg-[#121622] border-slate-800 hover:border-emerald-500/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <button
                      type="button"
                      aria-label={`Toggle task ${task.title}`}
                      className="text-slate-400 hover:text-emerald-400 transition"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-emerald-400" />
                      )}
                    </button>
                    <div className="truncate">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-mono">
                        {task.timeEstimate && <span>⏱ {task.timeEstimate}</span>}
                        <span className={`px-1.5 py-0.2 rounded uppercase text-[9px] font-bold ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400/90 ml-3 shrink-0">
                    +{task.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Suggested Timeline */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>{language === 'vi' ? 'Lịch trình nhịp sinh học đề xuất' : 'Optimal Circadian Timeline'}</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Auto-Optimized</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800/80">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">08:30 - 11:30</span>
                <p className="text-xs font-bold text-white mt-1">Deep Work Peak</p>
                <p className="text-[11px] text-slate-400 mt-1">Xử lý nhiệm vụ giải thuật & kiến trúc Cloud.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800/80">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">12:00 - 13:30</span>
                <p className="text-xs font-bold text-white mt-1">Nạp Năng Lượng</p>
                <p className="text-[11px] text-slate-400 mt-1">Cơm gạo lứt cá hồi + nghỉ trưa ngắn 20p.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800/80">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">17:00 - 18:00</span>
                <p className="text-xs font-bold text-white mt-1">Vận Động Zone 2</p>
                <p className="text-[11px] text-slate-400 mt-1">Chạy bộ 5km hoặc bơi giải phóng endorphin.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800/80">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">21:30 - 23:00</span>
                <p className="text-xs font-bold text-white mt-1">Tắt Ánh Sáng Xanh</p>
                <p className="text-[11px] text-slate-400 mt-1">Đọc 20 trang sách & thiền thư giãn.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Nutrition Spotlight + AI Assistant Prompt */}
        <div className="space-y-6">
          
          {/* Smart Nutrition Quick Card */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'vi' ? 'Thực đơn hôm nay' : 'Nutrition Plan'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => { playSound('click'); setActiveTab('nutrition'); }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                >
                  <span>{language === 'vi' ? 'Xem chi tiết' : 'Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-medium text-emerald-300">
                    {language === 'vi' ? 'Calo đã nạp:' : 'Calories Intake:'}
                  </span>
                  <span className="text-sm font-bold font-mono text-white">
                    {completedMealCalories} / {totalMealCalories} kcal
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (completedMealCalories / totalMealCalories) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {mealPlan.meals.slice(0, 3).map((meal) => {
                  const isDone = mealPlan.completedMealIds.includes(meal.id);
                  return (
                    <div
                      key={meal.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isDone
                          ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                          : 'bg-[#121622] border-slate-800'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                          {meal.type}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">{meal.name}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        {meal.totalCalories} kcal
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => { playSound('click'); setActiveTab('nutrition'); }}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
              >
                {language === 'vi' ? 'Mở Danh sách Mua sắm (Grocery)' : 'Open Smart Grocery List'}
              </button>
            </div>
          </div>

          {/* AI Life Assistant Quick Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#101923] to-[#0a151b] border border-emerald-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Life Assistant</h3>
                <p className="text-xs text-emerald-400 font-mono">Gemini 2.5 Flash Online</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'vi'
                ? 'Cần gợi ý phân bổ thời gian hôm nay hoặc lời khuyên dinh dưỡng theo chỉ số cơ thể của bạn? Trợ lý AI sẵn sàng phân tích.'
                : 'Need real-time schedule adjustments or nutrition tips based on your biometrics? AI Assistant is ready.'}
            </p>
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('assistant'); }}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
            >
              {language === 'vi' ? 'Trò chuyện với AI Assistant' : 'Chat with Assistant'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
