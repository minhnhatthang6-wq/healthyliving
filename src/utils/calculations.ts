import { ActivityLevel, Gender, NutritionGoal } from '../types';

/**
 * Calculates Body Mass Index (BMI) and health category
 */
export function calculateBMI(weightKg: number, heightCm: number) {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      bmi: 0,
      category: 'Unknown',
      categoryVi: 'Chưa xác định',
      healthyWeightRange: { min: 0, max: 0 }
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let category = 'Normal';
  let categoryVi = 'Cân đối, khỏe mạnh';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryVi = 'Thể trạng nhẹ';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    category = 'Normal';
    categoryVi = 'Cân đối & chuẩn mực';
  } else if (bmi >= 25 && bmi < 29.9) {
    category = 'Overweight';
    categoryVi = 'Hơi thừa cân nhẹ';
  } else {
    category = 'Obese';
    categoryVi = 'Cần chú trọng vận động';
  }

  // Healthy weight range (BMI 18.5 - 24.9)
  const minWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    categoryVi,
    healthyWeightRange: { min: minWeight, max: maxWeight }
  };
}

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor formula
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    return Math.round(base + 5);
  } else if (gender === 'female') {
    return Math.round(base - 161);
  } else {
    // Neutral median
    return Math.round(base - 78);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity factor
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) return 0;
  
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const factor = multipliers[activityLevel] || 1.2;
  return Math.round(bmr * factor);
}

/**
 * Calculates Recommended Daily Water Intake (ml)
 */
export function calculateRecommendedWater(weightKg: number, activityLevel: ActivityLevel): number {
  if (weightKg <= 0) return 2000;
  
  // Base 35ml per kg
  let baseMl = weightKg * 35;
  if (activityLevel === 'moderate') baseMl += 300;
  else if (activityLevel === 'active') baseMl += 500;
  else if (activityLevel === 'very_active') baseMl += 800;

  // Round to nearest 50ml
  return Math.round(baseMl / 50) * 50;
}

/**
 * Calculates target calories and macro splits (Protein, Carbs, Fat) based on goal
 */
export function calculateMacros(tdee: number, goal: NutritionGoal): {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  let targetCalories = tdee;

  // Adjust calorie target
  if (goal === 'lose_fat') {
    targetCalories = Math.max(1200, Math.round(tdee * 0.82)); // 18% deficit
  } else if (goal === 'gain_muscle') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
  } else if (goal === 'endurance') {
    targetCalories = Math.round(tdee * 1.05);
  }

  // Protein (4 kcal/g), Carbs (4 kcal/g), Fat (9 kcal/g)
  let proteinRatio = 0.25;
  let fatRatio = 0.25;
  let carbsRatio = 0.50;

  if (goal === 'lose_fat') {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbsRatio = 0.40;
  } else if (goal === 'gain_muscle') {
    proteinRatio = 0.30;
    fatRatio = 0.25;
    carbsRatio = 0.45;
  } else if (goal === 'endurance') {
    proteinRatio = 0.20;
    fatRatio = 0.20;
    carbsRatio = 0.60;
  }

  const proteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const fatGrams = Math.round((targetCalories * fatRatio) / 9);
  const carbsGrams = Math.round((targetCalories * carbsRatio) / 4);

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams
  };
}

/**
 * Calculates Level & Progression from Total XP (Exponential curve)
 */
export function calculateLevelFromXp(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  title: string;
  titleVi: string;
} {
  const safeXp = Math.max(0, totalXp);

  // Level thresholds: L1: 0, L2: 300, L3: 800, L4: 1500, L5: 2500, L6: 3800, L7: 5500, L8: 7500, L9: 10000, L10: 13000
  const thresholds = [
    0, 300, 800, 1500, 2500, 3800, 5500, 7500, 10000, 13000, 17000, 22000, 28000, 35000
  ];

  const titles = [
    { en: 'Novice Pioneer', vi: 'Người khởi đầu' },
    { en: 'Awakened Explorer', vi: 'Người thức tỉnh' },
    { en: 'Discipline Adept', vi: 'Bậc thầy kỷ luật' },
    { en: 'Habit Architect', vi: 'Kiến trúc sư thói quen' },
    { en: 'Focus Specialist', vi: 'Chiến binh tập trung' },
    { en: 'Life Optimizer', vi: 'Người tối ưu cuộc sống' },
    { en: 'System Strategist', vi: 'Nhà chiến lược hệ thống' },
    { en: 'Peak Performer', vi: 'Đỉnh cao phong độ' },
    { en: 'Grandmaster of Self', vi: 'Bậc thầy tự thân' },
    { en: 'Apex Life Architect', vi: 'Kiến trúc sư cuộc sống tối thượng' }
  ];

  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (safeXp >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }

  const levelIdx = level - 1;
  const currentThreshold = thresholds[levelIdx] || 0;
  const nextThreshold = thresholds[levelIdx + 1] || currentThreshold + 5000;
  const span = nextThreshold - currentThreshold;
  const progress = Math.min(100, Math.max(0, Math.round(((safeXp - currentThreshold) / span) * 100)));

  const titleEntry = titles[Math.min(titles.length - 1, levelIdx)] || titles[0];

  return {
    level,
    currentLevelXp: safeXp - currentThreshold,
    nextLevelXp: span,
    progressPercent: progress,
    title: titleEntry.en,
    titleVi: titleEntry.vi
  };
}

/**
 * Calculates Life OS Index (0-100) combining holistic aspects of life
 */
export function calculateLifeOSIndex(data: {
  tasksRatio: number; // 0 to 1
  waterRatio: number; // 0 to 1
  sleepScore: number; // 0 to 100
  habitScore: number; // 0 to 100
  financeScore: number; // 0 to 100
  focusMinutes: number; // target e.g. 50 mins = 100%
}): number {
  const tScore = Math.min(1, Math.max(0, data.tasksRatio)) * 25; // 25 pts
  const wScore = Math.min(1, Math.max(0, data.waterRatio)) * 15; // 15 pts
  const sScore = (Math.min(100, Math.max(0, data.sleepScore)) / 100) * 20; // 20 pts
  const hScore = (Math.min(100, Math.max(0, data.habitScore)) / 100) * 15; // 15 pts
  const fScore = (Math.min(100, Math.max(0, data.financeScore)) / 100) * 15; // 15 pts
  const focusRatio = Math.min(1, Math.max(0, data.focusMinutes / 50));
  const focScore = focusRatio * 10; // 10 pts

  const total = Math.round(tScore + wScore + sScore + hScore + fScore + focScore);
  return Math.min(100, Math.max(0, total));
}
