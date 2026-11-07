export type Language = 'vi' | 'en';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  bio: string;
  phone?: string;
  createdAt: string;
  preferences: {
    language: Language;
    soundEnabled: boolean;
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
}

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type NutritionGoal = 'lose_fat' | 'maintain' | 'gain_muscle' | 'endurance';

export interface BodyMetricEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  height: number; // cm
  bodyFatPercentage?: number;
  waistCm?: number;
  notes?: string;
}

export interface BodyProfile {
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  dailyRoutine: {
    wakeTime: string;
    bedTime: string;
    workType: string;
    exerciseFrequencyDays: number;
  };
  allergies: string[]; // e.g. ['Hải sản', 'Đậu phộng', 'Lactose']
  dietaryPreferences: string[]; // e.g. ['Ít đường', 'Nhiều đạm', 'Eat Clean']
  history: BodyMetricEntry[];
}

export interface NutritionItem {
  name: string;
  amount: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  description: string;
  items: NutritionItem[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives?: string[];
  allergens?: string[];
  recipeNotes?: string;
}

export interface DayMealPlan {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  dateStr: string;
  meals: Meal[];
  waterTargetMl: number;
  completedMealIds: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'produce' | 'protein' | 'dairy' | 'pantry' | 'spices';
  quantity: string;
  checked: boolean;
  notes?: string;
}

export type FocusModeType = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface FocusSession {
  id: string;
  timestamp: string;
  durationMinutes: number;
  mode: FocusModeType;
  taskTitle?: string;
  xpEarned: number;
}

export type GoalCategory = 'learning' | 'career' | 'health' | 'skills' | 'finance' | 'lifestyle' | 'discipline';
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: PriorityLevel;
  progressPercentage: number;
  deadline: string;
  milestones: Milestone[];
  isCompleted: boolean;
  xpReward: number;
  reflectionNotes?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  category: GoalCategory;
  timeEstimate?: string;
  completed: boolean;
  priority: PriorityLevel;
  dueDate: string;
  xpReward: number;
}

export type MoodType = 'ecstatic' | 'energetic' | 'calm' | 'focused' | 'stressed' | 'tired';

export interface WaterLog {
  date: string;
  intakeMl: number;
  targetMl: number;
}

export interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  durationHours: number;
  qualityScore: number; // 1-100
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: string; // Gym, Running, Cycling, Swimming, Yoga, Walking
  durationMinutes: number;
  caloriesBurned: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: MoodType;
  energyLevel: number; // 1-10
  gratitudeNote?: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  icon?: string;
}

export type SkillCategory = 
  | 'knowledge' 
  | 'discipline' 
  | 'creativity' 
  | 'communication' 
  | 'healthy_lifestyle' 
  | 'time_management';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  currentXp: number;
  requiredXp: number;
  unlocked: boolean;
  icon: string;
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}
