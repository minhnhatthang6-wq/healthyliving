import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Scale,
  Ruler,
  Flame,
  Droplets,
  AlertTriangle,
  Plus,
  TrendingDown,
  Info,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { calculateBMI, calculateBMR, calculateTDEE, calculateRecommendedWater, calculateMacros } from '../../utils/calculations';
import { playSound } from '../../utils/audio';
import { ActivityLevel, Gender, NutritionGoal } from '../../types';

export const BodyProfileView: React.FC = () => {
  const {
    bodyProfile,
    updateBodyProfile,
    addBodyMeasurement,
    language
  } = useLifeOS();

  const [isEditing, setIsEditing] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // Form states for profile
  const [height, setHeight] = useState(bodyProfile.height);
  const [weight, setWeight] = useState(bodyProfile.currentWeight);
  const [targetWeight, setTargetWeight] = useState(bodyProfile.targetWeight);
  const [age, setAge] = useState(bodyProfile.age);
  const [gender, setGender] = useState<Gender>(bodyProfile.gender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(bodyProfile.activityLevel);
  const [goal, setGoal] = useState<NutritionGoal>(bodyProfile.goal);
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState<string[]>(bodyProfile.allergies);

  // Form state for adding new measurement
  const [newLogWeight, setNewLogWeight] = useState(bodyProfile.currentWeight);
  const [newLogWaist, setNewLogWaist] = useState(78);
  const [newLogNote, setNewLogNote] = useState('');

  // Calculations
  const bmiInfo = calculateBMI(bodyProfile.currentWeight, bodyProfile.height);
  const bmr = calculateBMR(bodyProfile.currentWeight, bodyProfile.height, bodyProfile.age, bodyProfile.gender);
  const tdee = calculateTDEE(bmr, bodyProfile.activityLevel);
  const waterTarget = calculateRecommendedWater(bodyProfile.currentWeight, bodyProfile.activityLevel);
  const macros = calculateMacros(tdee, bodyProfile.goal);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBodyProfile({
      height: Number(height),
      currentWeight: Number(weight),
      targetWeight: Number(targetWeight),
      age: Number(age),
      gender,
      activityLevel,
      goal,
      allergies
    });
    setIsEditing(false);
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (item: string) => {
    setAllergies(allergies.filter((a) => a !== item));
  };

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyMeasurement(Number(newLogWeight), Number(newLogWaist), newLogNote);
    setShowAddLogModal(false);
    setNewLogNote('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Human-Centric Health Philosophy */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Activity className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Hồ sơ Cơ thể Thông minh' : 'Smart Body Profile'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {language === 'vi'
                ? 'Theo dõi sức khỏe và hỗ trợ xây dựng thói quen khoa học cá nhân hóa, không dùng để phán xét ngoại hình hay áp đặt cân nặng lý tưởng.'
                : 'Scientific tracking designed to support sustainable habits and vitality, never for superficial beauty standards.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => { playSound('click'); setShowAddLogModal(true); }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'vi' ? 'Ghi nhận chỉ số mới' : 'Log New Metrics'}</span>
            </button>

            <button
              type="button"
              onClick={() => { playSound('click'); setIsEditing(!isEditing); }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition"
            >
              {isEditing ? (language === 'vi' ? 'Hủy sửa' : 'Cancel') : (language === 'vi' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile')}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form (if editing) */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-[#0e121a] border border-emerald-500/40 space-y-5 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'vi' ? 'Cập nhật thông tin sinh trắc học' : 'Update Biometric Profile'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Chiều cao (cm)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Cân nặng hiện tại (kg)' : 'Current Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Cân nặng mục tiêu (kg)' : 'Target Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Độ tuổi' : 'Age'}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Giới tính' : 'Gender'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
              >
                <option value="male">{language === 'vi' ? 'Nam' : 'Male'}</option>
                <option value="female">{language === 'vi' ? 'Nữ' : 'Female'}</option>
                <option value="other">{language === 'vi' ? 'Khác / Trung tính' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Mức độ vận động' : 'Activity Level'}
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
              >
                <option value="sedentary">{language === 'vi' ? 'Ít vận động (Văn phòng)' : 'Sedentary'}</option>
                <option value="light">{language === 'vi' ? 'Vận động nhẹ (1-2 ngày/tuần)' : 'Lightly Active'}</option>
                <option value="moderate">{language === 'vi' ? 'Vừa phải (3-5 ngày/tuần)' : 'Moderately Active'}</option>
                <option value="active">{language === 'vi' ? 'Năng động (6-7 ngày/tuần)' : 'Very Active'}</option>
                <option value="very_active">{language === 'vi' ? 'Vận động viên / Cường độ cao' : 'Athlete Level'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                {language === 'vi' ? 'Mục tiêu dinh dưỡng' : 'Nutrition Goal'}
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as NutritionGoal)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
              >
                <option value="lose_fat">{language === 'vi' ? 'Giảm mỡ & Săn chắc' : 'Fat Loss'}</option>
                <option value="maintain">{language === 'vi' ? 'Duy trì cân nặng & Sức khỏe' : 'Maintain'}</option>
                <option value="gain_muscle">{language === 'vi' ? 'Tăng cơ & Sức mạnh' : 'Muscle Gain'}</option>
                <option value="endurance">{language === 'vi' ? 'Sức bền & Năng lượng cao' : 'Endurance'}</option>
              </select>
            </div>
          </div>

          {/* Allergies editor */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              {language === 'vi' ? 'Dị ứng thực phẩm / Kiêng khem' : 'Allergies & Dietary Restrictions'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                placeholder={language === 'vi' ? 'Nhập dị ứng (vd: Hải sản, Đậu phộng, Lactose...)' : 'Add allergy...'}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                {language === 'vi' ? 'Thêm' : 'Add'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs"
                >
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(a)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              {language === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* 4 Biometric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* BMI Card */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">BMI</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {bmiInfo.categoryVi}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-extrabold text-white">
              {bmiInfo.bmi}
            </span>
            <span className="text-xs text-slate-400">kg/m²</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {language === 'vi' ? 'Khoảng chuẩn:' : 'Normal range:'}{' '}
            <span className="font-mono text-emerald-300">
              {bmiInfo.healthyWeightRange.min} - {bmiInfo.healthyWeightRange.max} kg
            </span>
          </div>
        </div>

        {/* BMR Card */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">BMR (Mifflin-St Jeor)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-extrabold text-white">
              {bmr.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">kcal/ngày</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {language === 'vi' ? 'Năng lượng chuyển hóa cơ bản tối thiểu.' : 'Basal energy expenditure at rest.'}
          </p>
        </div>

        {/* TDEE Card */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">TDEE (Vận động)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-extrabold text-white">
              {tdee.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">kcal/ngày</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {language === 'vi' ? 'Tổng calo tiêu hao gồm vận động.' : 'Total daily energy consumption.'}
          </p>
        </div>

        {/* Recommended Water */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Nhu cầu nước' : 'Target Water'}
            </span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-display font-extrabold text-white">
              {waterTarget.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">ml/ngày</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {language === 'vi' ? 'Tính theo cân nặng & cường độ tập.' : 'Target based on weight and activity.'}
          </p>
        </div>

      </div>

      {/* Target Macros & Calories Breakdown */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>{language === 'vi' ? 'Mục tiêu dinh dưỡng & Phân bổ Macro đề xuất' : 'Recommended Calorie & Macro Target'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800">
            <span className="text-xs text-slate-400">
              {language === 'vi' ? 'Calo nạp mục tiêu' : 'Target Calories'}
            </span>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {macros.calories.toLocaleString()} <span className="text-xs text-slate-400">kcal</span>
            </p>
            <span className="text-[10px] text-slate-400">
              {bodyProfile.goal === 'lose_fat' ? 'Thâm hụt nhẹ 18% an toàn' : 'Tối ưu duy trì'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Protein (Đạm)</span>
              <span className="text-xs font-mono text-emerald-400">~35%</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {macros.proteinGrams} <span className="text-xs text-slate-400">g</span>
            </p>
            <span className="text-[10px] text-slate-400">Hỗ trợ phục hồi & bảo toàn cơ</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Carbs (Tinh bột tốt)</span>
              <span className="text-xs font-mono text-cyan-400">~40%</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {macros.carbsGrams} <span className="text-xs text-slate-400">g</span>
            </p>
            <span className="text-[10px] text-slate-400">Năng lượng não bộ & sức bền</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Fats (Chất béo tốt)</span>
              <span className="text-xs font-mono text-amber-400">~25%</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {macros.fatGrams} <span className="text-xs text-slate-400">g</span>
            </p>
            <span className="text-[10px] text-slate-400">Cân bằng nội tiết & hấp thụ vitamin</span>
          </div>
        </div>
      </div>

      {/* Progress Chart & Measurement History */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Biểu đồ tiến trình cân nặng & BMI' : 'Weight & BMI Evolution History'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'vi' ? 'Quan sát sự tiến bộ qua từng chu kỳ sinh hoạt' : 'Visual history across observation checkpoints'}
            </p>
          </div>
        </div>

        {/* Interactive SVG Trend Chart */}
        <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800/80 my-4 overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>{language === 'vi' ? 'Tiến trình thực tế' : 'Recorded Progression'}</span>
              <span>Mục tiêu: {bodyProfile.targetWeight} kg</span>
            </div>
            <div className="h-44 w-full flex items-end justify-between pt-6 pb-2 px-4 gap-4 relative">
              {/* Baseline target indicator */}
              <div className="absolute left-0 right-0 border-b border-dashed border-emerald-500/40 text-[10px] text-emerald-400 text-right pr-2" style={{ bottom: '28%' }}>
                Target: {bodyProfile.targetWeight}kg
              </div>

              {bodyProfile.history.slice(-6).reverse().map((item, idx) => {
                const diff = (item.weight - 60) * 8; // normalized height
                return (
                  <div key={item.id || idx} className="flex-1 flex flex-col items-center group relative">
                    <div className="text-[11px] font-mono text-white font-bold mb-1 group-hover:text-emerald-400 transition">
                      {item.weight} kg
                    </div>
                    <div
                      className="w-8 sm:w-12 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:from-emerald-500 group-hover:to-teal-300"
                      style={{ height: `${Math.max(20, Math.min(130, diff))}px` }}
                    />
                    <div className="text-[10px] font-mono text-slate-400 mt-2 whitespace-nowrap">
                      {item.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{language === 'vi' ? 'Ngày ghi nhận' : 'Date'}</th>
                <th className="py-2.5 px-3">{language === 'vi' ? 'Cân nặng' : 'Weight'}</th>
                <th className="py-2.5 px-3">BMI</th>
                <th className="py-2.5 px-3">{language === 'vi' ? 'Vòng eo' : 'Waist'}</th>
                <th className="py-2.5 px-3">{language === 'vi' ? 'Ghi chú sinh hoạt' : 'Notes'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bodyProfile.history.map((entry) => {
                const b = calculateBMI(entry.weight, entry.height);
                return (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-300">{entry.date}</td>
                    <td className="py-2.5 px-3 font-bold text-white font-mono">{entry.weight} kg</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">{b.bmi}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{entry.waistCm ? `${entry.waistCm} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{entry.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Measurement */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Ghi nhận đo lường mới' : 'Log New Measurement'}</span>
            </h3>

            <form onSubmit={handleAddMeasurement} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Cân nặng hôm nay (kg)' : 'Weight today (kg)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newLogWeight}
                  onChange={(e) => setNewLogWeight(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Vòng eo (cm, tùy chọn)' : 'Waist (cm, optional)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newLogWaist}
                  onChange={(e) => setNewLogWaist(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Cảm nhận / Ghi chú' : 'Notes / Reflection'}
                </label>
                <input
                  type="text"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  placeholder={language === 'vi' ? 'vd: Cảm giác cơ thể săn chắc hơn, ngủ ngon...' : 'Notes...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {language === 'vi' ? 'Lưu ghi nhận' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
