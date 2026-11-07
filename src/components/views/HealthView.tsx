import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Moon,
  Flame,
  Smile,
  Plus,
  Activity,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { MoodType } from '../../types';

export const HealthView: React.FC = () => {
  const {
    waterIntakeMl,
    waterTargetMl,
    addWater,
    setWaterIntake,
    sleepLog,
    updateSleepLog,
    workouts,
    addWorkout,
    moodLog,
    updateMood,
    language
  } = useLifeOS();

  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [workoutType, setWorkoutType] = useState('Chạy bộ ngoài trời');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [workoutCalories, setWorkoutCalories] = useState(300);
  const [workoutIntensity, setWorkoutIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Mood selector state
  const [currentMood, setCurrentMood] = useState<MoodType>(moodLog.mood);
  const [energyLevel, setEnergyLevel] = useState<number>(moodLog.energyLevel);
  const [gratitudeNote, setGratitudeNote] = useState<string>(moodLog.gratitudeNote || '');

  // Sleep editor state
  const [isEditingSleep, setIsEditingSleep] = useState(false);
  const [bedTime, setBedTime] = useState(sleepLog.bedTime);
  const [wakeTime, setWakeTime] = useState(sleepLog.wakeTime);
  const [qualityScore, setQualityScore] = useState(sleepLog.qualityScore);

  const waterPercent = waterTargetMl > 0 ? Math.min(100, Math.round((waterIntakeMl / waterTargetMl) * 100)) : 0;

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout({
      type: workoutType,
      durationMinutes: Number(workoutDuration),
      caloriesBurned: Number(workoutCalories),
      intensity: workoutIntensity,
      notes: workoutNotes
    });
    setShowAddWorkout(false);
    setWorkoutNotes('');
  };

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    updateMood(currentMood, energyLevel, gratitudeNote);
    playSound('complete');
  };

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    updateSleepLog({
      bedTime,
      wakeTime,
      qualityScore: Number(qualityScore)
    });
    setIsEditingSleep(false);
  };

  const moodEmojis: Record<MoodType, { label: string; emoji: string; color: string }> = {
    ecstatic: { label: 'Hân hoan / Thăng hoa', emoji: '🤩', color: 'border-amber-400 bg-amber-500/20 text-amber-300' },
    energetic: { label: 'Tràn đầy năng lượng', emoji: '⚡', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' },
    calm: { label: 'Bình yên / Tĩnh tại', emoji: '🌿', color: 'border-teal-400 bg-teal-500/20 text-teal-300' },
    focused: { label: 'Tập trung cao độ', emoji: '🎯', color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300' },
    stressed: { label: 'Căng thẳng / Áp lực', emoji: '🌪️', color: 'border-rose-400 bg-rose-500/20 text-rose-300' },
    tired: { label: 'Mệt mỏi / Cần nghỉ', emoji: '💤', color: 'border-purple-400 bg-purple-500/20 text-purple-300' }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <HeartPulse className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Quản lý Sức khỏe & Thói quen (Health Intelligence)' : 'Health Intelligence'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Hệ thống sinh trắc học đồng bộ hóa thói quen uống nước, giấc ngủ, tập luyện và cảm xúc mỗi ngày.'
                : 'Comprehensive biometric monitoring: smart hydration, deep sleep staging, physical conditioning, and gratitude mindset.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => { playSound('click'); setShowAddWorkout(true); }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'vi' ? 'Ghi nhận buổi tập' : 'Log Workout'}</span>
          </button>
        </div>
      </div>

      {/* 2 Main Columns: Hydration & Sleep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Smart Water Tracker Card */}
        <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <span>{language === 'vi' ? 'Theo dõi Nước uống Thông minh' : 'Smart Hydration'}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {waterPercent}%
              </span>
            </div>

            {/* Visual Hydration Vessel / Cylinder */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-slate-800/80 flex items-center justify-between gap-6 my-2">
              <div className="relative w-20 h-32 rounded-2xl border-2 border-cyan-500/40 bg-slate-950/80 overflow-hidden flex flex-col justify-end p-1">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600 via-teal-400 to-cyan-300 rounded-xl transition-all duration-700 shadow-lg shadow-cyan-500/30"
                  style={{ height: `${waterPercent}%` }}
                />
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">
                  {language === 'vi' ? 'Tiến trình hôm nay' : 'Today Intake'}
                </span>
                <p className="text-3xl font-display font-extrabold text-white">
                  {waterIntakeMl.toLocaleString()} <span className="text-xs text-slate-400 font-mono">ml</span>
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Mục tiêu: {waterTargetMl.toLocaleString()} ml
                </p>
                {waterPercent >= 100 && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ✓ {language === 'vi' ? 'Đã đạt 100% mục tiêu ngày' : 'Goal Accomplished'}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                type="button"
                onClick={() => addWater(150)}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 transition active:scale-95"
              >
                +150ml
              </button>
              <button
                type="button"
                onClick={() => addWater(250)}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition active:scale-95"
              >
                +250ml
              </button>
              <button
                type="button"
                onClick={() => addWater(500)}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition active:scale-95"
              >
                +500ml
              </button>
              <button
                type="button"
                onClick={() => setWaterIntake(0)}
                className="py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 text-xs font-mono text-slate-400 hover:text-rose-400 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Tracker Card */}
        <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Moon className="w-5 h-5 text-purple-400" />
                <span>{language === 'vi' ? 'Lịch & Chất lượng Giấc ngủ' : 'Sleep Intelligence'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingSleep(!isEditingSleep)}
                className="text-xs text-purple-300 hover:text-white font-semibold"
              >
                {isEditingSleep ? (language === 'vi' ? 'Đóng' : 'Close') : (language === 'vi' ? 'Chỉnh sửa' : 'Edit')}
              </button>
            </div>

            {isEditingSleep ? (
              <form onSubmit={handleSaveSleep} className="space-y-3 p-4 rounded-2xl bg-[#0a0d14] border border-slate-800">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {language === 'vi' ? 'Giờ đi ngủ' : 'Bedtime'}
                    </label>
                    <input
                      type="time"
                      value={bedTime}
                      onChange={(e) => setBedTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {language === 'vi' ? 'Giờ thức dậy' : 'Wake time'}
                    </label>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    {language === 'vi' ? 'Điểm chất lượng (1-100)' : 'Quality Score (1-100)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
                >
                  {language === 'vi' ? 'Cập nhật giấc ngủ' : 'Save Sleep Entry'}
                </button>
              </form>
            ) : (
              <div className="p-5 rounded-2xl bg-[#0a0d14] border border-slate-800/80 my-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400">
                      {language === 'vi' ? 'Thời lượng ngủ đêm qua' : 'Sleep Duration'}
                    </span>
                    <p className="text-3xl font-display font-extrabold text-white mt-1">
                      {sleepLog.durationHours} <span className="text-xs text-slate-400 font-mono">tiếng</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono uppercase text-purple-400">
                      {language === 'vi' ? 'Điểm chất lượng' : 'Score'}
                    </span>
                    <p className="text-3xl font-display font-extrabold text-purple-400 font-mono mt-1">
                      {sleepLog.qualityScore}/100
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                  <span>Đi ngủ: {sleepLog.bedTime}</span>
                  <span>Thức dậy: {sleepLog.wakeTime}</span>
                </div>

                {sleepLog.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    "{sleepLog.notes}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mood & Energy Mindset Tracker */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
          <Smile className="w-5 h-5 text-amber-400" />
          <span>{language === 'vi' ? 'Ghi nhận Cảm xúc & Năng lượng tinh thần' : 'Emotional & Energy Radar'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {language === 'vi' ? 'Theo dõi năng lượng tinh thần và duy trì nhật ký biết ơn mỗi ngày.' : 'Daily mindfulness and gratitude reflection.'}
        </p>

        <form onSubmit={handleSaveMood} className="space-y-5">
          {/* Mood chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.keys(moodEmojis) as MoodType[]).map((m) => {
              const info = moodEmojis[m];
              const isSelected = currentMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => { playSound('click'); setCurrentMood(m); }}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? info.color + ' ring-2 ring-emerald-500/50'
                      : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl mb-1">{info.emoji}</span>
                  <span className="text-[11px] font-semibold">{info.label}</span>
                </button>
              );
            })}
          </div>

          {/* Energy Slider */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400">
                {language === 'vi' ? 'Mức năng lượng cơ thể (1-10):' : 'Vital Energy Level (1-10):'}
              </span>
              <span className="font-bold font-mono text-emerald-400 text-base">
                {energyLevel}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Gratitude Diary */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              {language === 'vi' ? 'Nhật ký biết ơn & Phản tư hôm nay' : 'Gratitude & Daily Reflection'}
            </label>
            <textarea
              rows={2}
              value={gratitudeNote}
              onChange={(e) => setGratitudeNote(e.target.value)}
              placeholder={language === 'vi' ? 'Hôm nay bạn biết ơn điều gì? Thành tựu nhỏ nào làm bạn tự hào?' : 'What are you grateful for today?'}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
            >
              {language === 'vi' ? 'Lưu check-in tâm trạng (+25 XP)' : 'Save Check-in (+25 XP)'}
            </button>
          </div>
        </form>
      </div>

      {/* Workouts History Log */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>{language === 'vi' ? 'Lịch sử Hoạt động Thể chất' : 'Workout History'}</span>
        </h3>

        <div className="space-y-2.5">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-[#121622] border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{w.type}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                    {w.intensity}
                  </span>
                </div>
                {w.notes && <p className="text-xs text-slate-400 mt-1">{w.notes}</p>}
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">{w.date}</span>
              </div>

              <div className="text-right font-mono">
                <span className="text-sm font-bold text-amber-400 block">
                  {w.caloriesBurned} kcal
                </span>
                <span className="text-xs text-slate-400">
                  ⏱ {w.durationMinutes} phút
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Ghi nhận buổi tập' : 'Log Workout Session'}</span>
            </h3>

            <form onSubmit={handleCreateWorkout} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Bộ môn tập luyện' : 'Workout Type'}
                </label>
                <input
                  type="text"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  placeholder="vd: Gym Upper body, Chạy bộ, Bơi lội..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Thời lượng (phút)' : 'Duration (mins)'}
                  </label>
                  <input
                    type="number"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Calo đốt cháy' : 'Calories (kcal)'}
                  </label>
                  <input
                    type="number"
                    value={workoutCalories}
                    onChange={(e) => setWorkoutCalories(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Cường độ' : 'Intensity'}
                </label>
                <select
                  value={workoutIntensity}
                  onChange={(e) => setWorkoutIntensity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="low">{language === 'vi' ? 'Nhẹ nhàng (Zone 1)' : 'Low'}</option>
                  <option value="moderate">{language === 'vi' ? 'Vừa phải (Zone 2-3)' : 'Moderate'}</option>
                  <option value="high">{language === 'vi' ? 'Cường độ cao (Zone 4-5 / HIIT)' : 'High Intensity'}</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Ghi chú bài tập' : 'Notes'}
                </label>
                <input
                  type="text"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="Quãng đường, tạ nặng, cảm nhận..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {language === 'vi' ? 'Lưu bài tập (+75 XP)' : 'Save Workout (+75 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
