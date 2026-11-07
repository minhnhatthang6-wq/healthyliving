import React, { useState } from 'react';
import {
  Utensils,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertTriangle,
  Flame,
  Shuffle,
  ShoppingCart,
  Sparkles,
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { Meal } from '../../types';

export const NutritionView: React.FC = () => {
  const {
    mealPlan,
    toggleMealCompleted,
    bodyProfile,
    groceries,
    toggleGroceryItem,
    addGroceryItem,
    removeGroceryItem,
    language
  } = useLifeOS();

  const [selectedDay, setSelectedDay] = useState(1); // 1 = Monday
  const [activeTab, setActiveTab] = useState<'meals' | 'groceries'>('meals');
  const [newGroceryName, setNewGroceryName] = useState('');
  const [newGroceryCategory, setNewGroceryCategory] = useState<'produce' | 'protein' | 'dairy' | 'pantry' | 'spices'>('produce');
  const [newGroceryQty, setNewGroceryQty] = useState('');

  const daysOfWeek = [
    { id: 1, labelVi: 'Thứ 2', labelEn: 'Mon' },
    { id: 2, labelVi: 'Thứ 3', labelEn: 'Tue' },
    { id: 3, labelVi: 'Thứ 4', labelEn: 'Wed' },
    { id: 4, labelVi: 'Thứ 5', labelEn: 'Thu' },
    { id: 5, labelVi: 'Thứ 6', labelEn: 'Fri' },
    { id: 6, labelVi: 'Thứ 7', labelEn: 'Sat' },
    { id: 0, labelVi: 'Chủ nhật', labelEn: 'Sun' }
  ];

  const totalCalories = mealPlan.meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = mealPlan.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = mealPlan.meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = mealPlan.meals.reduce((sum, m) => sum + m.fat, 0);

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    addGroceryItem({
      name: newGroceryName.trim(),
      category: newGroceryCategory,
      quantity: newGroceryQty.trim() || '1 phần',
      checked: false
    });
    setNewGroceryName('');
    setNewGroceryQty('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Utensils className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Trợ lý Dinh dưỡng Thông minh' : 'Smart Nutrition Engine'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Thực đơn khoa học cân bằng dưỡng chất, tự động lưu ý dị ứng và tối ưu hóa năng lượng cho mục tiêu phát triển của bạn.'
                : 'Personalized chef-grade meal planning, allergen awareness, macro breakdown, and automated grocery logistics.'}
            </p>
          </div>

          {/* Tab Selector: Meals vs Groceries */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('meals'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'meals'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'Thực đơn hàng ngày' : 'Daily Meals'}
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setActiveTab('groceries'); }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'groceries'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Danh sách thực phẩm' : 'Grocery List'}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-mono">
                {groceries.filter((g) => !g.checked).length}
              </span>
            </button>
          </div>
        </div>

        {/* Allergen Warning Banner if user has allergies */}
        {bodyProfile.allergies.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center space-x-3 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">
                {language === 'vi' ? 'Bộ lọc an toàn đang kích hoạt:' : 'Allergen Guard Active:'}
              </span>{' '}
              {language === 'vi' ? 'Tự động loại trừ và cảnh báo thành phần chứa' : 'System protects against'}:{' '}
              <span className="font-semibold text-white">{bodyProfile.allergies.join(', ')}</span>.
            </div>
          </div>
        )}
      </div>

      {activeTab === 'meals' ? (
        <>
          {/* Day of Week Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDay === day.id;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => { playSound('click'); setSelectedDay(day.id); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                      : 'bg-[#0e121a] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {language === 'vi' ? day.labelVi : day.labelEn}
                </button>
              );
            })}
          </div>

          {/* Daily Nutrition Totals Summary Card */}
          <div className="p-5 rounded-3xl bg-[#0e121a] border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">
                {language === 'vi' ? 'Tổng Calo ngày' : 'Total Calories'}
              </span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {totalCalories} <span className="text-xs text-slate-400">kcal</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Protein (Đạm)</span>
              <p className="text-xl font-bold font-mono text-white mt-1">
                {totalProtein} <span className="text-xs text-slate-400">g</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Carbs (Tinh bột)</span>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {totalCarbs} <span className="text-xs text-slate-400">g</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Fats (Chất béo)</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                {totalFat} <span className="text-xs text-slate-400">g</span>
              </p>
            </div>
          </div>

          {/* Meals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mealPlan.meals.map((meal) => {
              const isCompleted = mealPlan.completedMealIds.includes(meal.id);
              const mealTypeColor =
                meal.type === 'breakfast'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : meal.type === 'lunch'
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : meal.type === 'snack'
                  ? 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                  : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';

              const mealTypeNameVi =
                meal.type === 'breakfast'
                  ? 'Bữa sáng'
                  : meal.type === 'lunch'
                  ? 'Bữa trưa'
                  : meal.type === 'snack'
                  ? 'Bữa phụ'
                  : 'Bữa tối';

              return (
                <div
                  key={meal.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-900/50 border-emerald-500/30'
                      : 'bg-[#0e121a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Meal Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${mealTypeColor}`}>
                        {language === 'vi' ? mealTypeNameVi : meal.type}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{meal.name}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMealCompleted(meal.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                      <span>{isCompleted ? (language === 'vi' ? 'Đã ăn (+30 XP)' : 'Done') : (language === 'vi' ? 'Check-in ăn' : 'Check-in')}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {meal.description}
                  </p>

                  {/* Nutritional Micro-Badges */}
                  <div className="grid grid-cols-4 gap-2 mb-4 p-2.5 rounded-2xl bg-[#121622] border border-slate-800/80 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Calo</span>
                      <span className="text-xs font-bold text-emerald-400">{meal.totalCalories}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Đạm</span>
                      <span className="text-xs font-bold text-white">{meal.protein}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Carb</span>
                      <span className="text-xs font-bold text-cyan-400">{meal.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Béo</span>
                      <span className="text-xs font-bold text-amber-400">{meal.fat}g</span>
                    </div>
                  </div>

                  {/* Ingredients Breakdown */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide font-mono block">
                      {language === 'vi' ? 'Nguyên liệu chính:' : 'Ingredients:'}
                    </span>
                    {meal.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-300 py-0.5 border-b border-slate-800/40">
                        <span>• {item.name}</span>
                        <span className="font-mono text-slate-400">{item.amount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Alternative Suggestions */}
                  {meal.alternatives && meal.alternatives.length > 0 && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                      <span className="font-semibold text-emerald-400 flex items-center space-x-1 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Gợi ý thay thế nguyên liệu:' : 'Smart Substitution:'}</span>
                      </span>
                      {meal.alternatives.map((alt, i) => (
                        <p key={i}>• {alt}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Smart Grocery Logistics View */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h2 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Danh sách thực phẩm cần chuẩn bị' : 'Smart Grocery Preparation'}</span>
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {language === 'vi'
                ? 'Được tổng hợp tự động từ thực đơn tuần, giúp bạn đi chợ nhanh chóng và chuẩn bị dinh dưỡng chu đáo.'
                : 'Consolidated list of pantry essentials, fresh produce, and high-quality proteins.'}
            </p>

            {/* Add New Grocery Item Form */}
            <form onSubmit={handleAddGrocery} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-[#121622] border border-slate-800">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newGroceryName}
                  onChange={(e) => setNewGroceryName(e.target.value)}
                  placeholder={language === 'vi' ? 'Tên nguyên liệu / thực phẩm...' : 'Item name...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <select
                  value={newGroceryCategory}
                  onChange={(e) => setNewGroceryCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                >
                  <option value="produce">{language === 'vi' ? 'Rau củ & Trái cây' : 'Produce'}</option>
                  <option value="protein">{language === 'vi' ? 'Thịt, Cá, Trứng' : 'Protein'}</option>
                  <option value="dairy">{language === 'vi' ? 'Sữa & Bơ sữa' : 'Dairy'}</option>
                  <option value="pantry">{language === 'vi' ? 'Gạo & Đồ khô' : 'Pantry'}</option>
                  <option value="spices">{language === 'vi' ? 'Gia vị & Dầu ăn' : 'Spices'}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGroceryQty}
                  onChange={(e) => setNewGroceryQty(e.target.value)}
                  placeholder={language === 'vi' ? 'Định lượng (vd: 500g)' : 'Qty (500g)'}
                  className="w-2/3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Grocery Checklist */}
            <div className="space-y-2">
              {groceries.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition ${
                    item.checked
                      ? 'bg-slate-900/30 border-slate-800/80 text-slate-500 line-through'
                      : 'bg-[#121622] border-slate-800 text-slate-200'
                  }`}
                >
                  <div
                    onClick={() => toggleGroceryItem(item.id)}
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <button
                      type="button"
                      aria-label={`Toggle ${item.name}`}
                      className="text-slate-400 hover:text-emerald-400 transition"
                    >
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.notes && <p className="text-[11px] text-slate-400">{item.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeGroceryItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
