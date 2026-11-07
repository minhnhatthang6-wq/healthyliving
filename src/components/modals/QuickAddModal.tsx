import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Droplets,
  Wallet,
  Activity,
  Flame,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { GoalCategory, PriorityLevel } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'task' | 'water' | 'expense' | 'workout';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'task'
}) => {
  const {
    addTask,
    addWater,
    addTransaction,
    addWorkout,
    language
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'task' | 'water' | 'expense' | 'workout'>(defaultTab);

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<GoalCategory>('learning');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('high');
  const [taskTime, setTaskTime] = useState('30 phút');

  // Water form
  const [waterAmount, setWaterAmount] = useState(250);

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState(65000);
  const [expenseCategory, setExpenseCategory] = useState('Ăn uống');
  const [expenseDesc, setExpenseDesc] = useState('');

  // Workout form
  const [workoutType, setWorkoutType] = useState('Chạy bộ ngoài trời');
  const [workoutMins, setWorkoutMins] = useState(30);
  const [workoutCalories, setWorkoutCalories] = useState(280);

  if (!isOpen) return null;

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      timeEstimate: taskTime,
      dueDate: new Date().toISOString().split('T')[0],
      xpReward: 60
    });
    setTaskTitle('');
    onClose();
  };

  const handleWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWater(Number(waterAmount));
    onClose();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount <= 0) return;
    addTransaction({
      type: 'expense',
      amount: Number(expenseAmount),
      category: expenseCategory,
      description: expenseDesc || expenseCategory,
      paymentMethod: 'Ví điện tử'
    });
    setExpenseDesc('');
    onClose();
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorkout({
      type: workoutType,
      durationMinutes: Number(workoutMins),
      caloriesBurned: Number(workoutCalories),
      intensity: 'moderate',
      notes: 'Ghi nhận nhanh qua HUD Quick Add'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f121a] border border-emerald-500/30 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => { playSound('click'); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>QUICK TELEMETRY DISPATCH</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            {language === 'vi' ? 'Thêm nhanh dữ liệu' : 'Quick Life Check-in'}
          </h2>

          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 mt-4">
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('task'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeTab === 'task' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Nhiệm vụ' : 'Task'}</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('water'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeTab === 'water' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Nước' : 'Water'}</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('expense'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeTab === 'expense' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Chi tiêu' : 'Expense'}</span>
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('workout'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                activeTab === 'workout' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Tập luyện' : 'Workout'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Task */}
        {activeTab === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'vi' ? 'Tiêu đề nhiệm vụ' : 'Task title'}
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="vd: Hoàn thành 1 bài viết, chạy 3km..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Mức độ ưu tiên' : 'Priority'}
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="urgent">Khẩn cấp</option>
                  <option value="high">Cao</option>
                  <option value="medium">Trung bình</option>
                  <option value="low">Thấp</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Ước lượng thời gian' : 'Time Estimate'}
                </label>
                <input
                  type="text"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  placeholder="30 phút"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md mt-2"
            >
              {language === 'vi' ? 'Tạo nhiệm vụ (+60 XP)' : 'Create Task (+60 XP)'}
            </button>
          </form>
        )}

        {/* Tab 2: Water */}
        {activeTab === 'water' && (
          <form onSubmit={handleWaterSubmit} className="space-y-4 text-center">
            <p className="text-xs text-slate-400">
              {language === 'vi' ? 'Chọn hoặc nhập số lượng nước vừa nạp vào cơ thể:' : 'Log water volume intake:'}
            </p>

            <div className="flex justify-center gap-3">
              {[150, 250, 350, 500].map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => setWaterAmount(ml)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition ${
                    waterAmount === ml
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-cyan-300 hover:bg-slate-800'
                  }`}
                >
                  +{ml}ml
                </button>
              ))}
            </div>

            <div className="my-2">
              <input
                type="number"
                step="50"
                value={waterAmount}
                onChange={(e) => setWaterAmount(Number(e.target.value))}
                className="w-36 bg-slate-900 border border-slate-700 rounded-xl p-2 text-center text-lg font-bold font-mono text-cyan-400 outline-none"
              />
              <span className="text-xs text-slate-400 ml-2">ml</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md mt-2"
            >
              {language === 'vi' ? 'Ghi nhận nước uống (+10 XP)' : 'Log Water (+10 XP)'}
            </button>
          </form>
        )}

        {/* Tab 3: Expense */}
        {activeTab === 'expense' && (
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'vi' ? 'Số tiền (VNĐ)' : 'Amount (VND)'}
              </label>
              <input
                type="number"
                step="1000"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Danh mục' : 'Category'}
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500"
                >
                  <option value="Ăn uống">Ăn uống & Cà phê</option>
                  <option value="Học tập & Sách">Học tập & Sách</option>
                  <option value="Thể thao & Sức khỏe">Thể thao & Sức khỏe</option>
                  <option value="Di chuyển">Di chuyển</option>
                  <option value="Giải trí">Giải trí</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Ghi chú ngắn' : 'Note'}
                </label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="Cà phê sáng..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md mt-2"
            >
              {language === 'vi' ? 'Lưu khoản chi (+20 XP)' : 'Save Expense (+20 XP)'}
            </button>
          </form>
        )}

        {/* Tab 4: Workout */}
        {activeTab === 'workout' && (
          <form onSubmit={handleWorkoutSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'vi' ? 'Loại vận động' : 'Activity Type'}
              </label>
              <input
                type="text"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
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
                  value={workoutMins}
                  onChange={(e) => setWorkoutMins(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Calo tiêu hao' : 'Calories (kcal)'}
                </label>
                <input
                  type="number"
                  value={workoutCalories}
                  onChange={(e) => setWorkoutCalories(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md mt-2"
            >
              {language === 'vi' ? 'Ghi nhận bài tập (+75 XP)' : 'Log Workout (+75 XP)'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
