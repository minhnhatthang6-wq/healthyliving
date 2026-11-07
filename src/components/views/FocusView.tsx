import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  CheckCircle2,
  Zap,
  Target,
  Flame,
  Coffee
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound, startAmbientSound, stopAmbientSound } from '../../utils/audio';

export const FocusView: React.FC = () => {
  const {
    focusSessions,
    addFocusSession,
    dailyTasks,
    language
  } = useLifeOS();

  // Mode durations in seconds
  const MODES = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'whitenoise' | 'drone'>('off');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(dailyTasks[0]?.id || '');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = dailyTasks.find((t) => t.id === selectedTaskId);

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedTask]);

  // Ambient sound sync
  const handleAmbientChange = (type: 'off' | 'rain' | 'whitenoise' | 'drone') => {
    setAmbientSound(type);
    startAmbientSound(type);
    playSound('click');
  };

  // Switch timer mode
  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode]);
    playSound('click');
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    playSound('click');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode]);
    playSound('click');
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    playSound('bell');

    if (mode === 'pomodoro') {
      addFocusSession({
        durationMinutes: 25,
        mode: 'pomodoro',
        taskTitle: selectedTask?.title || 'General Focus Session',
        xpEarned: 50
      });
    }
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalDuration = MODES[mode];
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const todaySessions = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Timer className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Chế độ Tập trung Cao độ (Focus Mode)' : 'Deep Focus Mode'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Đắm mình vào trạng thái dòng chảy (Flow State) với chu kỳ Pomodoro 25 phút kết hợp âm thanh tự nhiên tổng hợp.'
                : 'Enter uninterrupted flow state with circadian pomodoro cycles, binaural soundscapes, and gamified XP rewards.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl font-mono text-xs">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">
                {language === 'vi' ? 'Số phiên' : 'Sessions'}
              </span>
              <span className="text-base font-bold text-emerald-400">{todaySessions}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-slate-400 block text-[10px] uppercase">
                {language === 'vi' ? 'Tổng phút' : 'Total Mins'}
              </span>
              <span className="text-base font-bold text-white">{totalFocusMinutes}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Focus Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timer Orb Card (2 cols) */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#0a0d14] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Mode Tabs */}
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 z-10">
            <button
              type="button"
              onClick={() => switchMode('pomodoro')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'pomodoro'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'Tập trung 25m' : 'Deep Work (25m)'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'shortBreak'
                  ? 'bg-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'Nghỉ ngắn 5m' : 'Short Break (5m)'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'longBreak'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'Nghỉ dài 15m' : 'Long Break (15m)'}
            </button>
          </div>

          {/* Glowing Circular Timer */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                stroke="#1e293b"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                stroke={mode === 'pomodoro' ? '#10b981' : '#14b8a6'}
                strokeWidth="10"
                strokeDasharray="760"
                strokeDashoffset={760 - (760 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>

            {/* Center Time Display */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-white tracking-tight font-mono">
                {timeFormatted}
              </span>
              <span className="text-xs uppercase font-mono text-emerald-400 mt-2 font-semibold tracking-wider">
                {isRunning ? (language === 'vi' ? '● ĐANG TẬP TRUNG' : '● IN PROGRESS') : (language === 'vi' ? 'TẠM DỪNG' : 'PAUSED')}
              </span>
            </div>
          </div>

          {/* Controls: Play/Pause and Reset */}
          <div className="flex items-center space-x-4 mt-6 z-10">
            <button
              type="button"
              aria-label="Reset Timer"
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-2xl font-display font-bold text-sm flex items-center space-x-2.5 shadow-xl transition active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? (language === 'vi' ? 'Tạm dừng' : 'Pause') : (language === 'vi' ? 'Bắt đầu' : 'Start Focus')}</span>
            </button>
          </div>

          {/* Active Task Link */}
          <div className="mt-8 text-center max-w-md">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {language === 'vi' ? 'Nhiệm vụ đang thực hiện:' : 'Target Task:'}
            </span>
            <p className="text-sm font-semibold text-emerald-300 mt-1 truncate">
              {selectedTask ? selectedTask.title : (language === 'vi' ? 'Phiên tập trung tự do' : 'General Focus')}
            </p>
          </div>
        </div>

        {/* Ambient Noise & Task Selector (Right col) */}
        <div className="space-y-6">
          
          {/* Ambient Soundscape */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Âm thanh nền tập trung (Synth)' : 'Binaural Soundscape'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'vi' ? 'Tạo tiếng ồn trắng và tiếng mưa khử tiếng ồn môi trường:' : 'Audio synthesis generated in browser:'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleAmbientChange('off')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition ${
                  ambientSound === 'off'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <VolumeX className="w-4 h-4" />
                <span>{language === 'vi' ? 'Tắt âm' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAmbientChange('rain')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition ${
                  ambientSound === 'rain'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span>{language === 'vi' ? 'Mưa rơi' : 'Rain'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAmbientChange('whitenoise')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition ${
                  ambientSound === 'whitenoise'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{language === 'vi' ? 'Tiếng ồn trắng' : 'White Noise'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAmbientChange('drone')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition ${
                  ambientSound === 'drone'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>{language === 'vi' ? 'Deep Drone' : 'Deep Drone'}</span>
              </button>
            </div>
          </div>

          {/* Link Focus to Task */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Gắn với nhiệm vụ hôm nay' : 'Focus Target Task'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'vi' ? 'Chọn mục tiêu để theo dõi thời gian cụ thể:' : 'Select an active task to attach:'}
            </p>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 outline-none"
            >
              <option value="">{language === 'vi' ? '-- Không chọn (Phiên tự do) --' : '-- General Focus --'}</option>
              {dailyTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.completed ? '✓ ' : '○ '} {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Focus History Log */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">
              {language === 'vi' ? 'Lịch sử phiên gần đây' : 'Recent Focus Sessions'}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {focusSessions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-[#121622] border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-white truncate">{s.taskTitle || 'Focus Session'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{s.timestamp}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                    +{s.xpEarned} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
