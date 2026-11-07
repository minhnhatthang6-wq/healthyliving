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
  ChatMessage
} from '../types';

export const initialUser: UserAccount = {
  id: 'usr_001',
  name: 'Minh Nhật',
  email: 'minhnhatthang6@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  title: 'Apex Life Architect',
  bio: 'Tối ưu hóa từng ngày, làm chủ tương lai và nâng cấp bản thân 1% mỗi ngày.',
  phone: '+84 912 345 678',
  createdAt: '2026-01-15',
  preferences: {
    language: 'vi',
    soundEnabled: true,
    notifications: true,
    twoFactorEnabled: false
  }
};

export const initialBodyProfile: BodyProfile = {
  height: 175,
  currentWeight: 68.5,
  targetWeight: 65.0,
  age: 24,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'lose_fat',
  dailyRoutine: {
    wakeTime: '06:00',
    bedTime: '23:00',
    workType: 'Làm việc trí não / Văn phòng',
    exerciseFrequencyDays: 4
  },
  allergies: ['Hải sản có vỏ', 'Đậu phộng sống'],
  dietaryPreferences: ['Eat Clean', 'Ít tinh bột xấu', 'Ưu tiên Protein cao', 'Uống nhiều nước'],
  history: [
    { id: 'bh_1', date: '2026-08-01', weight: 72.0, height: 175, waistCm: 84, notes: 'Bắt đầu hành trình tái cấu trúc hình thể' },
    { id: 'bh_2', date: '2026-09-01', weight: 70.8, height: 175, waistCm: 82, notes: 'Tập trung bơi lội và kiểm soát calo' },
    { id: 'bh_3', date: '2026-10-01', weight: 69.5, height: 175, waistCm: 80, notes: 'Tăng cường tập kháng lực (Resistance)' },
    { id: 'bh_4', date: '2026-11-01', weight: 68.5, height: 175, waistCm: 78.5, notes: 'Cơ bắp săn chắc, tinh thần sảng khoái' }
  ]
};

export const initialMeals: DayMealPlan = {
  dayOfWeek: 1, // Thứ 2
  dateStr: '2026-11-06',
  waterTargetMl: 2600,
  completedMealIds: ['meal_1'],
  meals: [
    {
      id: 'meal_1',
      type: 'breakfast',
      name: 'Bánh mì ngũ cốc trứng ốp la & bơ quả',
      description: '2 lát bánh mì đen nguyên cám, 2 quả trứng gà ta ốp la lòng đào, 1/2 quả bơ sáp cắt lát, kèm sốt tiêu đen.',
      items: [
        { name: 'Bánh mì nguyên cám', amount: '2 lát (70g)', calories: 180, protein: 7, carbs: 32, fat: 2 },
        { name: 'Trứng gà ta', amount: '2 quả (100g)', calories: 155, protein: 13, carbs: 1, fat: 11 },
        { name: 'Bơ sáp chín', amount: '60g', calories: 96, protein: 1, carbs: 5, fat: 9 },
        { name: 'Cà chua bi & rau xà lách', amount: '100g', calories: 25, protein: 1, carbs: 5, fat: 0 }
      ],
      totalCalories: 456,
      protein: 22,
      carbs: 43,
      fat: 22,
      alternatives: ['Có thể thay bánh mì bằng khoai lang luộc 150g', 'Thay bơ sáp bằng 1 thìa dầu ô liu nguyên chất'],
      allergens: ['Gluten (có trong bánh mì thông thường, nên dùng bánh mì đen không gluten nếu nhạy cảm)'],
      recipeNotes: 'Áp chảo trứng với lửa nhỏ để giữ tối đa vi chất Lutein và Choline trong lòng đỏ trứng.'
    },
    {
      id: 'meal_2',
      type: 'lunch',
      name: 'Cơm gạo lứt cá hồi áp chảo sốt teriyaki & canh cải xanh',
      description: '1 chén cơm gạo lứt huyết rồng dẻo thơm, 150g fillet cá hồi Na Uy áp chảo sốt teriyaki thanh đạm, canh cải xanh nấu nấm hương.',
      items: [
        { name: 'Cơm gạo lứt', amount: '1 bát (150g)', calories: 165, protein: 4, carbs: 35, fat: 1 },
        { name: 'Cá hồi fillet áp chảo', amount: '150g', calories: 290, protein: 30, carbs: 0, fat: 18 },
        { name: 'Súp lơ xanh & cà rốt hấp', amount: '150g', calories: 50, protein: 3, carbs: 10, fat: 0 },
        { name: 'Canh cải xanh nấm đông cô', amount: '1 tô (200ml)', calories: 40, protein: 2, carbs: 6, fat: 1 }
      ],
      totalCalories: 545,
      protein: 39,
      carbs: 51,
      fat: 20,
      alternatives: ['Có thể thay cá hồi bằng ức gà nướng mật ong thảo mộc (180g) hoặc cá chẽm hấp gừng'],
      allergens: [],
      recipeNotes: 'Cá hồi áp chảo mỗi mặt 3 phút để da giòn tan, thịt giữ độ mọng nước Omega-3 quý giá.'
    },
    {
      id: 'meal_3',
      type: 'snack',
      name: 'Sữa chua Hy Lạp hạt chia & quả mọng tươi',
      description: '1 hộp sữa chua Hy Lạp không đường (120g), 1 thìa hạt chia ngâm nở, một nắm việt quất và dâu tây tươi.',
      items: [
        { name: 'Sữa chua Hy Lạp', amount: '120g', calories: 110, protein: 12, carbs: 5, fat: 4 },
        { name: 'Hạt chia hữu cơ', amount: '10g', calories: 48, protein: 2, carbs: 4, fat: 3 },
        { name: 'Việt quất & dâu tây', amount: '50g', calories: 35, protein: 0.5, carbs: 8, fat: 0 }
      ],
      totalCalories: 193,
      protein: 14.5,
      carbs: 17,
      fat: 7,
      alternatives: ['Có thể thay bằng 1 quả chuối chín và 15 hạt hạnh nhân sấy'],
      recipeNotes: 'Bữa phụ nạp protein giải phóng chậm giúp duy trì sự tỉnh táo và tập trung làm việc buổi chiều.'
    },
    {
      id: 'meal_4',
      type: 'dinner',
      name: 'Ức gà xào ớt chuông nấm đùi gà & bí đỏ hấp hạt sen',
      description: '180g ức gà áp chảo cắt khối xào cùng ớt chuông ngũ sắc giòn ngọt, nấm đùi gà thơm ngậy, kèm 100g bí đỏ hấp mềm.',
      items: [
        { name: 'Ức gà phi lê', amount: '180g', calories: 230, protein: 42, carbs: 0, fat: 5 },
        { name: 'Ớt chuông đỏ & vàng', amount: '100g', calories: 30, protein: 1, carbs: 6, fat: 0 },
        { name: 'Nấm đùi gà xào tỏi', amount: '100g', calories: 35, protein: 3, carbs: 5, fat: 0.5 },
        { name: 'Bí đỏ hấp hạt sen', amount: '120g', calories: 85, protein: 2, carbs: 18, fat: 0.5 }
      ],
      totalCalories: 380,
      protein: 48,
      carbs: 29,
      fat: 6,
      alternatives: ['Có thể thay ức gà bằng thăn bò áp chảo mềm ngọt'],
      recipeNotes: 'Bữa tối nhẹ nhàng, giàu tryptophan giúp não bộ tổng hợp melatonin để ngủ sâu hơn.'
    }
  ]
};

export const initialGroceries: GroceryItem[] = [
  { id: 'g_1', name: 'Gạo lứt huyết rồng ST25', category: 'pantry', quantity: '2 kg', checked: true, notes: 'Chọn loại hạt mẩy dẻo' },
  { id: 'g_2', name: 'Fillet cá hồi tươi Na Uy', category: 'protein', quantity: '500g', checked: false, notes: 'Mua tại cửa hàng uy tín' },
  { id: 'g_3', name: 'Ức gà tươi CP', category: 'protein', quantity: '1 kg', checked: false },
  { id: 'g_4', name: 'Trứng gà ta thảo mộc', category: 'dairy', quantity: '10 quả', checked: true },
  { id: 'g_5', name: 'Sữa chua Hy Lạp không đường', category: 'dairy', quantity: '4 hộp', checked: false },
  { id: 'g_6', name: 'Bơ sáp Đắk Lắk', category: 'produce', quantity: '1 kg', checked: true },
  { id: 'g_7', name: 'Súp lơ xanh hữu cơ', category: 'produce', quantity: '1 cây', checked: false },
  { id: 'g_8', name: 'Ớt chuông ngũ sắc', category: 'produce', quantity: '3 quả', checked: false },
  { id: 'g_9', name: 'Dầu ô liu Extra Virgin', category: 'pantry', quantity: '1 chai 500ml', checked: true }
];

export const initialGoals: Goal[] = [
  {
    id: 'goal_1',
    title: 'Đạt chứng chỉ AWS Solutions Architect & AI Practitioner',
    description: 'Nâng cao năng lực thiết kế kiến trúc đám mây và hệ thống AI phân tán phục vụ lộ trình sự nghiệp công nghệ.',
    category: 'learning',
    priority: 'urgent',
    progressPercentage: 70,
    deadline: '2026-12-15',
    isCompleted: false,
    xpReward: 1200,
    milestones: [
      { id: 'm_1_1', title: 'Hoàn thành khóa học Cloud Architecture trên Coursera', completed: true, dueDate: '2026-10-15' },
      { id: 'm_1_2', title: 'Làm 5 bài thi thử Mock Exam đạt trên 85%', completed: true, dueDate: '2026-11-10' },
      { id: 'm_1_3', title: 'Ôn tập câu hỏi phân tích hệ thống High Availability', completed: false, dueDate: '2026-11-25' },
      { id: 'm_1_4', title: 'Đăng ký lịch thi chính thức và thi đạt chứng chỉ', completed: false, dueDate: '2026-12-15' }
    ],
    reflectionNotes: 'Đã hoàn thành xuất sắc các phần cơ bản, cần tăng tốc luyện practice questions tuần này.'
  },
  {
    id: 'goal_2',
    title: 'Chạy bộ 10km liên tục & hoàn thành Half Marathon 21km',
    description: 'Xây dựng sức bền tim mạch vượt trội, duy trì nhịp tim vùng Zone 2 và rèn luyện ý chí thép.',
    category: 'health',
    priority: 'high',
    progressPercentage: 60,
    deadline: '2026-12-30',
    isCompleted: false,
    xpReward: 950,
    milestones: [
      { id: 'm_2_1', title: 'Chạy 5km liên tục pace dưới 6:15', completed: true, dueDate: '2026-09-30' },
      { id: 'm_2_2', title: 'Chinh phục cự ly 8km không dừng nghỉ', completed: true, dueDate: '2026-10-25' },
      { id: 'm_2_3', title: 'Chạy 10km đường dài vào sáng Chủ nhật', completed: false, dueDate: '2026-11-20' },
      { id: 'm_2_4', title: 'Chạy cự ly bán marathon 21km tại giải chạy mở rộng', completed: false, dueDate: '2026-12-30' }
    ]
  },
  {
    id: 'goal_3',
    title: 'Xây dựng Quỹ khẩn cấp & Tự do tài chính 60,000,000 ₫',
    description: 'Bảo vệ tương lai tài chính, tối thiểu 6 tháng chi phí sinh hoạt thiết yếu trong tài khoản sinh lời an toàn.',
    category: 'finance',
    priority: 'medium',
    progressPercentage: 75,
    deadline: '2026-12-31',
    isCompleted: false,
    xpReward: 800,
    milestones: [
      { id: 'm_3_1', title: 'Tiết kiệm đạt mốc 20 triệu', completed: true },
      { id: 'm_3_2', title: 'Tiết kiệm đạt mốc 40 triệu', completed: true },
      { id: 'm_3_3', title: 'Tiết kiệm đạt mốc 50 triệu', completed: false },
      { id: 'm_3_4', title: 'Cán mốc 60 triệu và phân bổ quỹ khẩn cấp', completed: false }
    ]
  }
];

export const initialDailyTasks: DailyTask[] = [
  {
    id: 't_1',
    title: 'Hoàn thành 2 phiên Pomodoro ôn tập AWS Security & IAM',
    category: 'learning',
    timeEstimate: '50 phút',
    completed: true,
    priority: 'high',
    dueDate: '2026-11-06',
    xpReward: 80
  },
  {
    id: 't_2',
    title: 'Chạy bộ 5km Zone 2 quanh công viên buổi chiều',
    category: 'health',
    timeEstimate: '35 phút',
    completed: true,
    priority: 'high',
    dueDate: '2026-11-06',
    xpReward: 90
  },
  {
    id: 't_3',
    title: 'Đọc 20 trang sách "Atomic Habits - Thay đổi tí hon, hiệu quả bất ngờ"',
    category: 'lifestyle',
    timeEstimate: '30 phút',
    completed: false,
    priority: 'medium',
    dueDate: '2026-11-06',
    xpReward: 60
  },
  {
    id: 't_4',
    title: 'Ghi chép thu chi và phân loại ngân sách tuần đầu tháng',
    category: 'finance',
    timeEstimate: '15 phút',
    completed: true,
    priority: 'medium',
    dueDate: '2026-11-06',
    xpReward: 40
  },
  {
    id: 't_5',
    title: 'Thiền định tĩnh tâm 10 phút trước khi ngủ & viết nhật ký phản tư',
    category: 'discipline',
    timeEstimate: '15 phút',
    completed: false,
    priority: 'low',
    dueDate: '2026-11-06',
    xpReward: 50
  }
];

export const initialSleepLog: SleepLog = {
  id: 'slp_1',
  date: '2026-11-06',
  bedTime: '23:15',
  wakeTime: '06:45',
  durationHours: 7.5,
  qualityScore: 91,
  notes: 'Ngủ sâu giấc (Deep sleep 2.2h), không thức giấc giữa đêm, thức dậy tỉnh táo không đau mỏi.'
};

export const initialWorkoutLogs: WorkoutLog[] = [
  {
    id: 'w_1',
    date: '2026-11-06',
    type: 'Chạy bộ ngoài trời',
    durationMinutes: 32,
    caloriesBurned: 340,
    intensity: 'moderate',
    notes: 'Quãng đường 5.2km, nhịp tim trung bình 142 bpm (Zone 2 hoàn hảo).'
  },
  {
    id: 'w_2',
    date: '2026-11-05',
    type: 'Gym Kháng lực (Upper Body Push/Pull)',
    durationMinutes: 50,
    caloriesBurned: 410,
    intensity: 'high',
    notes: 'Bench press, Overhead press, Hít xà đơn 4 hiệp.'
  }
];

export const initialMoodLog: MoodLog = {
  id: 'm_1',
  date: '2026-11-06',
  mood: 'energetic',
  energyLevel: 9,
  gratitudeNote: 'Biết ơn vì một ngày làm việc tập trung, sức khỏe dồi dào và đã hoàn thành bài chạy 5km.'
};

export const initialTransactions: Transaction[] = [
  { id: 'tx_1', date: '2026-11-06', type: 'expense', amount: 85000, category: 'Ăn uống', description: 'Bữa trưa cơm gạo lứt cá hồi', paymentMethod: 'Ví MoMo' },
  { id: 'tx_2', date: '2026-11-05', type: 'expense', amount: 350000, category: 'Học tập & Sách', description: 'Sách chuyên sâu Cloud Systems', paymentMethod: 'Thẻ Visa' },
  { id: 'tx_3', date: '2026-11-03', type: 'expense', amount: 120000, category: 'Thể thao & Sức khỏe', description: 'Vé bơi hồ nước mặn 4 mùa', paymentMethod: 'Tiền mặt' },
  { id: 'tx_4', date: '2026-11-01', type: 'income', amount: 26000000, category: 'Lương & Thưởng', description: 'Lương tháng 10 chính thức', paymentMethod: 'Chuyển khoản VCB' },
  { id: 'tx_5', date: '2026-10-28', type: 'income', amount: 6500000, category: 'Freelance & Dự án ngoài', description: 'Dự án tư vấn thiết kế UI/UX', paymentMethod: 'Chuyển khoản' },
  { id: 'tx_6', date: '2026-10-25', type: 'expense', amount: 4500000, category: 'Nhà cửa & Hóa đơn', description: 'Tiền thuê căn hộ studio & điện nước', paymentMethod: 'Chuyển khoản' }
];

export const initialSavingsGoals: SavingsGoal[] = [
  { id: 'sg_1', title: 'Quỹ khẩn cấp 6 tháng', targetAmount: 60000000, currentAmount: 45000000, targetDate: '2026-12-31', category: 'Bảo vệ tài chính', icon: 'Shield' },
  { id: 'sg_2', title: 'MacBook Pro M3 Max Workstation', targetAmount: 52000000, currentAmount: 34000000, targetDate: '2027-03-30', category: 'Thiết bị làm việc', icon: 'Laptop' },
  { id: 'sg_3', title: 'Chuyến du lịch khám phá Kyoto Nhật Bản', targetAmount: 35000000, currentAmount: 18500000, targetDate: '2027-05-15', category: 'Trải nghiệm cuộc sống', icon: 'Plane' }
];

export const initialSkillNodes: SkillNode[] = [
  { id: 'sk_1', name: 'Deep Work & Concentration', category: 'discipline', level: 4, currentXp: 850, requiredXp: 1200, unlocked: true, icon: 'Flame', description: 'Khả năng duy trì sự tập trung cao độ liên tục mà không bị xao nhãng bởi mạng xã hội.' },
  { id: 'sk_2', name: 'Cloud Architecture & AI Systems', category: 'knowledge', level: 3, currentXp: 620, requiredXp: 900, unlocked: true, icon: 'Brain', description: 'Am hiểu kiến trúc microservices, LLM prompt engineering và hệ thống phân tán chịu tải cao.' },
  { id: 'sk_3', name: 'Cardio Endurance & Zone 2', category: 'healthy_lifestyle', level: 4, currentXp: 1100, requiredXp: 1500, unlocked: true, icon: 'HeartPulse', description: 'Xây dựng nền tảng trao đổi chất ty thể dồi dào, tối ưu hóa năng lượng suốt cả ngày dài.' },
  { id: 'sk_4', name: 'Precision Nutrition & Fasting', category: 'healthy_lifestyle', level: 3, currentXp: 480, requiredXp: 800, unlocked: true, icon: 'Apple', description: 'Hiểu rõ chỉ số đường huyết Glycemic, phân bổ macro cân bằng và tối ưu tiêu hóa.' },
  { id: 'sk_5', name: 'Time-Blocking & Energy Management', category: 'time_management', level: 4, currentXp: 940, requiredXp: 1300, unlocked: true, icon: 'Clock', description: 'Phân bổ năng lượng theo nhịp sinh học, bảo vệ khung giờ vàng sáng tạo cao nhất.' },
  { id: 'sk_6', name: 'Strategic Wealth & Budgeting', category: 'discipline', level: 3, currentXp: 710, requiredXp: 1000, unlocked: true, icon: 'TrendingUp', description: 'Làm chủ quy tắc 50/30/20, dòng tiền thặng dư và đầu tư tích sản dài hạn.' },
  { id: 'sk_7', name: 'Productive Communication', category: 'communication', level: 2, currentXp: 320, requiredXp: 600, unlocked: true, icon: 'MessageSquare', description: 'Trình bày ý tưởng mạch lạc, lắng nghe thấu cảm và đàm phán giải pháp win-win.' },
  { id: 'sk_8', name: 'Creative Synthesis & Writing', category: 'creativity', level: 3, currentXp: 550, requiredXp: 850, unlocked: true, icon: 'Sparkles', description: 'Kết nối các miền tri thức đa ngành để tạo ra góc nhìn và giải pháp độc đáo.' }
];

export const initialBadges: Badge[] = [
  { id: 'b_1', name: 'Hydration Sentinel', description: 'Đạt 100% mục tiêu uống nước 7 ngày liên tiếp', icon: 'Droplets', unlocked: true, unlockedAt: '2026-11-04', rarity: 'common' },
  { id: 'b_2', name: 'Deep Focus Master', description: 'Hoàn thành hơn 100 phiên Pomodoro tập trung', icon: 'Zap', unlocked: true, unlockedAt: '2026-10-28', rarity: 'rare' },
  { id: 'b_3', name: 'Nutrition Architect', description: 'Tuân thủ thực đơn cân bằng và không vi phạm dị ứng trong 30 ngày', icon: 'Utensils', unlocked: true, unlockedAt: '2026-10-15', rarity: 'epic' },
  { id: 'b_4', name: 'Apex Disciplinarian', description: 'Đạt chuỗi streak 30 ngày hoàn thành toàn bộ mục tiêu chính', icon: 'Crown', unlocked: false, rarity: 'legendary' },
  { id: 'b_5', name: 'Wealth Guardian', description: 'Duy trì tỷ lệ tiết kiệm trên 40% thu nhập trong 3 tháng liên tiếp', icon: 'ShieldCheck', unlocked: true, unlockedAt: '2026-10-31', rarity: 'rare' },
  { id: 'b_6', name: 'Zen Mind', description: 'Đạt điểm chất lượng giấc ngủ trung bình trên 90 điểm trong 2 tuần', icon: 'Moon', unlocked: false, rarity: 'epic' }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    content: 'Xin chào Minh Nhật! Tôi là **AI Life Assistant** của hệ điều hành **LIFE OS**. Tôi đã đồng bộ dữ liệu hôm nay: bạn đã nạp 1,750ml nước, hoàn thành 2/5 nhiệm vụ trọng tâm và ghi nhận giấc ngủ chất lượng 91 điểm. Bạn muốn tối ưu hóa lịch trình, phân tích dinh dưỡng hay cần đề xuất kế hoạch nào ngay bây giờ?',
    timestamp: '08:00',
    suggestions: [
      'Gợi ý cách tối ưu năng lượng buổi chiều',
      'Đánh giá chế độ ăn & Macro hôm nay',
      'Lên kế hoạch tập luyện tuần mới',
      'Phân tích tiến độ mục tiêu AWS Architect'
    ]
  }
];
