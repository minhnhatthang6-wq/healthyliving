import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserAccount,
  BodyProfile,
  DayMealPlan,
  GroceryItem,
  Goal,
  DailyTask,
  WorkoutLog,
  SleepLog,
  MoodLog,
  Transaction,
  SavingsGoal,
  SkillNode,
  Badge,
  ChatMessage,
  FocusSession,
  Language,
  MoodType
} from '../types';
import {
  initialUser,
  initialBodyProfile,
  initialMeals,
  initialGroceries,
  initialGoals,
  initialDailyTasks,
  initialSleepLog,
  initialWorkoutLogs,
  initialMoodLog,
  initialTransactions,
  initialSavingsGoals,
  initialSkillNodes,
  initialBadges,
  initialChatMessages
} from '../data/mockData';
import { calculateLevelFromXp, calculateLifeOSIndex, calculateRecommendedWater } from '../utils/calculations';
import { playSound } from '../utils/audio';

interface LifeOSContextType {
  // Auth & Profile
  user: UserAccount | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<UserAccount>) => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
  resetAllData: () => void;

  // XP & Gamification
  totalXp: number;
  addXp: (amount: number, reason?: string) => void;
  levelInfo: ReturnType<typeof calculateLevelFromXp>;
  lifeOSIndex: number;
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;

  // Body Profile
  bodyProfile: BodyProfile;
  updateBodyProfile: (updates: Partial<BodyProfile>) => void;
  addBodyMeasurement: (weight: number, waistCm?: number, notes?: string) => void;

  // Nutrition
  mealPlan: DayMealPlan;
  toggleMealCompleted: (mealId: string) => void;
  updateMeal: (mealId: string, updates: Partial<typeof initialMeals.meals[0]>) => void;
  groceries: GroceryItem[];
  toggleGroceryItem: (id: string) => void;
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  removeGroceryItem: (id: string) => void;

  // Goals & Tasks
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progressPercentage' | 'isCompleted'>) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (goalId: string) => void;
  dailyTasks: DailyTask[];
  toggleTask: (id: string) => void;
  addTask: (task: Omit<DailyTask, 'id' | 'completed'>) => void;
  deleteTask: (id: string) => void;

  // Health
  waterIntakeMl: number;
  addWater: (amountMl: number) => void;
  setWaterIntake: (amountMl: number) => void;
  waterTargetMl: number;
  sleepLog: SleepLog;
  updateSleepLog: (updates: Partial<SleepLog>) => void;
  workouts: WorkoutLog[];
  addWorkout: (workout: Omit<WorkoutLog, 'id' | 'date'>) => void;
  moodLog: MoodLog;
  updateMood: (mood: MoodType, energyLevel: number, note?: string) => void;

  // Focus Mode
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => void;

  // Finance
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (id: string) => void;
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, amountToAdd: number) => void;

  // Skill Tree
  skillNodes: SkillNode[];
  upgradeSkill: (skillId: string) => void;

  // AI Assistant Chat
  chatMessages: ChatMessage[];
  sendUserMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'life_os_v1_';

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe localStorage helper
  const loadStorage = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStorage = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch {
      // storage quota or private browsing error
    }
  };

  // State initialization
  const [user, setUser] = useState<UserAccount | null>(() => loadStorage('user', initialUser));
  const [language, setLanguageState] = useState<Language>(() => user?.preferences?.language || 'vi');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const [totalXp, setTotalXp] = useState<number>(() => loadStorage('total_xp', 2740));
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(() => loadStorage('body_profile', initialBodyProfile));
  const [mealPlan, setMealPlan] = useState<DayMealPlan>(() => loadStorage('meal_plan', initialMeals));
  const [groceries, setGroceries] = useState<GroceryItem[]>(() => loadStorage('groceries', initialGroceries));
  const [goals, setGoals] = useState<Goal[]>(() => loadStorage('goals', initialGoals));
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => loadStorage('daily_tasks', initialDailyTasks));
  const [waterIntakeMl, setWaterIntakeState] = useState<number>(() => loadStorage('water_today', 1750));
  const [sleepLog, setSleepLog] = useState<SleepLog>(() => loadStorage('sleep_log', initialSleepLog));
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(() => loadStorage('workouts', initialWorkoutLogs));
  const [moodLog, setMoodLog] = useState<MoodLog>(() => loadStorage('mood_log', initialMoodLog));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStorage('transactions', initialTransactions));
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => loadStorage('savings_goals', initialSavingsGoals));
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>(() => loadStorage('skill_nodes', initialSkillNodes));
  const [badges, setBadges] = useState<Badge[]>(() => loadStorage('badges', initialBadges));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => loadStorage('focus_sessions', [
    { id: 'fs_1', timestamp: '2026-11-06 09:30', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'AWS Security Architecture', xpEarned: 50 },
    { id: 'fs_2', timestamp: '2026-11-06 11:00', durationMinutes: 25, mode: 'pomodoro', taskTitle: 'Review Daily Schedule', xpEarned: 50 }
  ]));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadStorage('chat_messages', initialChatMessages));

  // Sync state to localStorage
  useEffect(() => { saveStorage('user', user); }, [user]);
  useEffect(() => { saveStorage('total_xp', totalXp); }, [totalXp]);
  useEffect(() => { saveStorage('body_profile', bodyProfile); }, [bodyProfile]);
  useEffect(() => { saveStorage('meal_plan', mealPlan); }, [mealPlan]);
  useEffect(() => { saveStorage('groceries', groceries); }, [groceries]);
  useEffect(() => { saveStorage('goals', goals); }, [goals]);
  useEffect(() => { saveStorage('daily_tasks', dailyTasks); }, [dailyTasks]);
  useEffect(() => { saveStorage('water_today', waterIntakeMl); }, [waterIntakeMl]);
  useEffect(() => { saveStorage('sleep_log', sleepLog); }, [sleepLog]);
  useEffect(() => { saveStorage('workouts', workouts); }, [workouts]);
  useEffect(() => { saveStorage('mood_log', moodLog); }, [moodLog]);
  useEffect(() => { saveStorage('transactions', transactions); }, [transactions]);
  useEffect(() => { saveStorage('savings_goals', savingsGoals); }, [savingsGoals]);
  useEffect(() => { saveStorage('skill_nodes', skillNodes); }, [skillNodes]);
  useEffect(() => { saveStorage('badges', badges); }, [badges]);
  useEffect(() => { saveStorage('focus_sessions', focusSessions); }, [focusSessions]);
  useEffect(() => { saveStorage('chat_messages', chatMessages); }, [chatMessages]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (user) {
      setUser({ ...user, preferences: { ...user.preferences, language: lang } });
    }
  };

  // XP & Level calculations
  const levelInfo = calculateLevelFromXp(totalXp);
  const waterTargetMl = calculateRecommendedWater(bodyProfile.currentWeight, bodyProfile.activityLevel);

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;
  const tasksRatio = dailyTasks.length > 0 ? completedTasksCount / dailyTasks.length : 1;
  const waterRatio = waterTargetMl > 0 ? Math.min(1, waterIntakeMl / waterTargetMl) : 1;
  const todayFocusMinutes = focusSessions.reduce((acc, cur) => acc + cur.durationMinutes, 0);

  const lifeOSIndex = calculateLifeOSIndex({
    tasksRatio,
    waterRatio,
    sleepScore: sleepLog.qualityScore,
    habitScore: 88,
    financeScore: 82,
    focusMinutes: todayFocusMinutes
  });

  const addXp = (amount: number) => {
    setTotalXp(prev => {
      const next = prev + amount;
      const oldLevel = calculateLevelFromXp(prev).level;
      const newLevel = calculateLevelFromXp(next).level;

      if (newLevel > oldLevel) {
        playSound('levelUp');
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#6ee7b7', '#f8fafc', '#38bdf8']
          });
        } catch {
          // ignore
        }
      } else {
        playSound('complete');
      }
      return next;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        playSound('badge');
        return { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] };
      }
      return b;
    }));
  };

  // Auth Operations
  const login = (email: string): boolean => {
    const newUser: UserAccount = {
      ...initialUser,
      email,
      name: email.split('@')[0] || 'User'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    playSound('complete');
    return true;
  };

  const signup = (name: string, email: string): boolean => {
    const newUser: UserAccount = {
      ...initialUser,
      name,
      email,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    addXp(100); // Starter bonus XP
    playSound('levelUp');
    return true;
  };

  const logout = () => {
    setUser(null);
    playSound('click');
  };

  const updateProfile = (updates: Partial<UserAccount>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    playSound('complete');
  };

  const exportDataJson = () => {
    const backup = {
      user,
      totalXp,
      bodyProfile,
      mealPlan,
      groceries,
      goals,
      dailyTasks,
      waterIntakeMl,
      sleepLog,
      workouts,
      moodLog,
      transactions,
      savingsGoals,
      skillNodes,
      badges,
      focusSessions,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.user) setUser(data.user);
      if (typeof data.totalXp === 'number') setTotalXp(data.totalXp);
      if (data.bodyProfile) setBodyProfile(data.bodyProfile);
      if (data.mealPlan) setMealPlan(data.mealPlan);
      if (data.groceries) setGroceries(data.groceries);
      if (data.goals) setGoals(data.goals);
      if (data.dailyTasks) setDailyTasks(data.dailyTasks);
      if (typeof data.waterIntakeMl === 'number') setWaterIntakeState(data.waterIntakeMl);
      if (data.sleepLog) setSleepLog(data.sleepLog);
      if (data.workouts) setWorkouts(data.workouts);
      if (data.moodLog) setMoodLog(data.moodLog);
      if (data.transactions) setTransactions(data.transactions);
      if (data.savingsGoals) setSavingsGoals(data.savingsGoals);
      if (data.skillNodes) setSkillNodes(data.skillNodes);
      if (data.badges) setBadges(data.badges);
      if (data.focusSessions) setFocusSessions(data.focusSessions);
      playSound('levelUp');
      return true;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    setUser(initialUser);
    setTotalXp(2740);
    setBodyProfile(initialBodyProfile);
    setMealPlan(initialMeals);
    setGroceries(initialGroceries);
    setGoals(initialGoals);
    setDailyTasks(initialDailyTasks);
    setWaterIntakeState(1750);
    setSleepLog(initialSleepLog);
    setWorkouts(initialWorkoutLogs);
    setMoodLog(initialMoodLog);
    setTransactions(initialTransactions);
    setSavingsGoals(initialSavingsGoals);
    setSkillNodes(initialSkillNodes);
    setBadges(initialBadges);
    setChatMessages(initialChatMessages);
    playSound('complete');
  };

  // Body Profile Handlers
  const updateBodyProfile = (updates: Partial<BodyProfile>) => {
    setBodyProfile(prev => ({ ...prev, ...updates }));
    addXp(20);
  };

  const addBodyMeasurement = (weight: number, waistCm?: number, notes?: string) => {
    const newEntry = {
      id: 'bh_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight,
      height: bodyProfile.height,
      waistCm,
      notes
    };
    setBodyProfile(prev => ({
      ...prev,
      currentWeight: weight,
      history: [newEntry, ...prev.history]
    }));
    addXp(50);
  };

  // Nutrition Handlers
  const toggleMealCompleted = (mealId: string) => {
    setMealPlan(prev => {
      const isCompleted = prev.completedMealIds.includes(mealId);
      const nextCompleted = isCompleted
        ? prev.completedMealIds.filter(id => id !== mealId)
        : [...prev.completedMealIds, mealId];
      if (!isCompleted) {
        addXp(30);
      }
      return { ...prev, completedMealIds: nextCompleted };
    });
  };

  const updateMeal = (mealId: string, updates: Partial<typeof initialMeals.meals[0]>) => {
    setMealPlan(prev => ({
      ...prev,
      meals: prev.meals.map(m => m.id === mealId ? { ...m, ...updates } : m)
    }));
    playSound('complete');
  };

  const toggleGroceryItem = (id: string) => {
    setGroceries(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    playSound('click');
  };

  const addGroceryItem = (item: Omit<GroceryItem, 'id'>) => {
    const newItem = { ...item, id: 'g_' + Date.now() };
    setGroceries(prev => [newItem, ...prev]);
    playSound('complete');
  };

  const removeGroceryItem = (id: string) => {
    setGroceries(prev => prev.filter(item => item.id !== id));
    playSound('click');
  };

  // Goal & Task Handlers
  const addGoal = (goal: Omit<Goal, 'id' | 'progressPercentage' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...goal,
      id: 'goal_' + Date.now(),
      progressPercentage: 0,
      isCompleted: false
    };
    setGoals(prev => [newGoal, ...prev]);
    addXp(60);
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      const doneCount = updatedMilestones.filter(m => m.completed).length;
      const progress = updatedMilestones.length > 0 ? Math.round((doneCount / updatedMilestones.length) * 100) : 0;
      const wasCompleted = goal.isCompleted;
      const isNowCompleted = progress === 100;

      if (!wasCompleted && isNowCompleted) {
        addXp(goal.xpReward || 500);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        playSound('complete');
        addXp(25);
      }

      return {
        ...goal,
        milestones: updatedMilestones,
        progressPercentage: progress,
        isCompleted: isNowCompleted
      };
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    playSound('click');
  };

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextState = !task.completed;
        if (nextState) {
          addXp(task.xpReward || 50);
        } else {
          playSound('click');
        }
        return { ...task, completed: nextState };
      }
      return task;
    }));
  };

  const addTask = (task: Omit<DailyTask, 'id' | 'completed'>) => {
    const newTask: DailyTask = {
      ...task,
      id: 't_' + Date.now(),
      completed: false
    };
    setDailyTasks(prev => [newTask, ...prev]);
    playSound('complete');
  };

  const deleteTask = (id: string) => {
    setDailyTasks(prev => prev.filter(t => t.id !== id));
    playSound('click');
  };

  // Water & Health Handlers
  const addWater = (amountMl: number) => {
    setWaterIntakeState(prev => {
      const next = prev + amountMl;
      if (prev < waterTargetMl && next >= waterTargetMl) {
        unlockBadge('b_1');
        addXp(80);
      } else {
        addXp(10);
      }
      return next;
    });
  };

  const setWaterIntake = (amountMl: number) => {
    setWaterIntakeState(Math.max(0, amountMl));
    playSound('click');
  };

  const updateSleepLog = (updates: Partial<SleepLog>) => {
    setSleepLog(prev => ({ ...prev, ...updates }));
    addXp(30);
  };

  const addWorkout = (workout: Omit<WorkoutLog, 'id' | 'date'>) => {
    const newWorkout: WorkoutLog = {
      ...workout,
      id: 'w_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    addXp(75);
  };

  const updateMood = (mood: MoodType, energyLevel: number, note?: string) => {
    const newMoodLog: MoodLog = {
      id: 'm_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood,
      energyLevel,
      gratitudeNote: note
    };
    setMoodLog(newMoodLog);
    addXp(25);
  };

  // Focus Sessions
  const addFocusSession = (session: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newSession: FocusSession = {
      ...session,
      id: 'fs_' + Date.now(),
      timestamp: `${now.toISOString().split('T')[0]} ${timeStr}`
    };
    setFocusSessions(prev => [newSession, ...prev]);
    addXp(session.xpEarned || 50);
  };

  // Finance Handlers
  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [newTx, ...prev]);
    addXp(20);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    playSound('click');
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'sg_' + Date.now()
    };
    setSavingsGoals(prev => [newGoal, ...prev]);
    addXp(40);
  };

  const updateSavingsGoal = (id: string, amountToAdd: number) => {
    setSavingsGoals(prev => prev.map(sg => {
      if (sg.id === id) {
        const nextAmount = Math.max(0, sg.currentAmount + amountToAdd);
        if (sg.currentAmount < sg.targetAmount && nextAmount >= sg.targetAmount) {
          addXp(300);
          confetti();
        } else {
          addXp(20);
        }
        return { ...sg, currentAmount: nextAmount };
      }
      return sg;
    }));
  };

  // Skill Tree Upgrade
  const upgradeSkill = (skillId: string) => {
    setSkillNodes(prev => prev.map(skill => {
      if (skill.id === skillId) {
        playSound('levelUp');
        addXp(150);
        return {
          ...skill,
          level: skill.level + 1,
          currentXp: 0,
          requiredXp: Math.round(skill.requiredXp * 1.35)
        };
      }
      return skill;
    }));
  };

  // AI Assistant Chat Logic
  const sendUserMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    playSound('click');

    // Generate intelligent contextual response
    setTimeout(() => {
      let replyContent = '';
      const lower = content.toLowerCase();

      if (lower.includes('dinh dưỡng') || lower.includes('ăn') || lower.includes('thực đơn') || lower.includes('calo')) {
        replyContent = `Dựa trên hồ sơ cơ thể (${bodyProfile.currentWeight}kg, mục tiêu ${bodyProfile.goal === 'lose_fat' ? 'Giảm mỡ giữ cơ' : 'Cân đối'}), lượng Calo khuyến nghị hôm nay là ~${Math.round(bodyProfile.currentWeight * 30)} kcal với phân bổ 35% Protein, 40% Carb phức hợp và 25% Chất béo tốt. 
        \n✨ **Đề xuất của AI:**\n- Tránh xa thực phẩm chứa dị ứng của bạn: ${bodyProfile.allergies.join(', ') || 'Không có'}.\n- Bữa trưa nay nên ưu tiên cá hồi áp chảo hoặc ức gà nướng ăn cùng gạo lứt và súp lơ xanh.\n- Đừng quên uống đủ ${waterTargetMl}ml nước trong ngày!`;
      } else if (lower.includes('thời gian') || lower.includes('kế hoạch') || lower.includes('lịch trình') || lower.includes('pomodoro')) {
        replyContent = `Để tối ưu hóa hiệu suất ngày hôm nay, tôi đề xuất phương pháp **Time-Blocking theo chu kỳ sinh học 90 phút**:\n\n1. **08:30 - 11:30 (Deep Work Peak):** Dành 2-3 phiên Pomodoro 25m cho nhiệm vụ khó nhất: "${dailyTasks.find(t => !t.completed)?.title || 'Ôn tập kiến trúc chuyên sâu'}".\n2. **14:00 - 16:30:** Xử lý các đầu việc hành chính và giao tiếp.\n3. **17:00 - 18:00:** Chạy bộ nhẹ nhàng hoặc tập thể lực kháng lực.\n4. **21:30 - 22:30:** Đọc sách, tắt thiết bị ánh sáng xanh và ghi nhật ký biết ơn.`;
      } else if (lower.includes('sức khỏe') || lower.includes('chạy') || lower.includes('ngủ') || lower.includes('nước')) {
        replyContent = `Dữ liệu sinh trắc học của bạn hôm nay đang rất tích cực:\n- **Nước uống:** Đã đạt ${waterIntakeMl}/${waterTargetMl}ml (${Math.round((waterIntakeMl / waterTargetMl) * 100)}%).\n- **Chất lượng giấc ngủ:** ${sleepLog.qualityScore}/100 điểm với ${sleepLog.durationHours} tiếng ngủ đêm qua.\n- **Chỉ số Life OS Index:** ${lifeOSIndex}/100 - Bạn đang nằm trong nhóm 5% người dùng có kỷ luật tốt nhất hệ thống!`;
      } else if (lower.includes('tài chính') || lower.includes('tiết kiệm') || lower.includes('chi tiêu')) {
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
        replyContent = `Phân tích dòng tiền của bạn trong chu kỳ hiện tại:\n- Tổng chi tiêu đã ghi nhận: **${totalExpenses.toLocaleString('vi-VN')} ₫**.\n- Các mục tiêu tiết kiệm như "${savingsGoals[0]?.title || 'Quỹ khẩn cấp'}" đang tiến triển đúng lộ trình.\n- **Mẹo tối ưu:** Áp dụng nguyên tắc '24 giờ trì hoãn' trước khi mua sắm các món đồ ngoài danh mục thiết yếu để nâng tỷ lệ tiết kiệm lên trên 50%.`;
      } else {
        replyContent = `Tôi đã ghi nhận câu hỏi của bạn. Với tư cách là Trợ lý LIFE OS, tôi luôn đồng hành để giúp bạn duy trì kỷ luật và nâng cấp bản thân mỗi ngày. Bạn có muốn tôi lập danh sách 3 việc quan trọng nhất bạn cần tập trung hoàn thành ngay lúc này không?`;
      }

      const assistantMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Lập thời gian biểu tối nay',
          'Đề xuất món ăn phụ bổ sung đạm',
          'Kiểm tra tiến độ Skill Tree',
          'Ghi nhận bài tập thể dục vừa xong'
        ]
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      playSound('bell');
    }, 600);
  };

  const clearChat = () => {
    setChatMessages(initialChatMessages);
    playSound('click');
  };

  return (
    <LifeOSContext.Provider
      value={{
        user,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        updateProfile,
        exportDataJson,
        importDataJson,
        resetAllData,

        totalXp,
        addXp,
        levelInfo,
        lifeOSIndex,
        badges,
        unlockBadge,

        bodyProfile,
        updateBodyProfile,
        addBodyMeasurement,

        mealPlan,
        toggleMealCompleted,
        updateMeal,
        groceries,
        toggleGroceryItem,
        addGroceryItem,
        removeGroceryItem,

        goals,
        addGoal,
        toggleGoalMilestone,
        deleteGoal,
        dailyTasks,
        toggleTask,
        addTask,
        deleteTask,

        waterIntakeMl,
        addWater,
        setWaterIntake,
        waterTargetMl,
        sleepLog,
        updateSleepLog,
        workouts,
        addWorkout,
        moodLog,
        updateMood,

        focusSessions,
        addFocusSession,

        transactions,
        addTransaction,
        deleteTransaction,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,

        skillNodes,
        upgradeSkill,

        chatMessages,
        sendUserMessage,
        clearChat
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
