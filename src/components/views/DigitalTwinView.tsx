import React from 'react';
import {
  GitBranch,
  Sparkles,
  TrendingUp,
  Shield,
  Activity,
  Zap,
  Flame,
  Brain,
  Droplets,
  Wallet,
  Compass,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

export const DigitalTwinView: React.FC = () => {
  const {
    user,
    lifeOSIndex,
    levelInfo,
    bodyProfile,
    waterIntakeMl,
    waterTargetMl,
    dailyTasks,
    goals,
    sleepLog,
    focusSessions,
    transactions,
    language
  } = useLifeOS();

  // Calculate 6 holistic biometric axes (0 - 100)
  const taskDone = dailyTasks.filter((t) => t.completed).length;
  const intellectScore = 88; // Knowledge & Skills
  const disciplineScore = Math.min(100, Math.round((taskDone / Math.max(1, dailyTasks.length)) * 100));
  const healthScore = sleepLog.qualityScore;
  const nutritionScore = Math.min(100, Math.round((waterIntakeMl / Math.max(1, waterTargetMl)) * 100));
  const focusScore = Math.min(100, Math.round((focusSessions.reduce((a, b) => a + b.durationMinutes, 0) / 60) * 100));
  const financeScore = 84;

  const radarAxes = [
    { labelVi: 'Trí tuệ & Học tập', labelEn: 'Intellect', score: intellectScore, color: '#38bdf8' },
    { labelVi: 'Kỷ luật Thói quen', labelEn: 'Discipline', score: disciplineScore, color: '#10b981' },
    { labelVi: 'Thể chất & Giấc ngủ', labelEn: 'Physical & Sleep', score: healthScore, color: '#a855f7' },
    { labelVi: 'Dinh dưỡng & Nước', labelEn: 'Nutrition', score: nutritionScore, color: '#2dd4bf' },
    { labelVi: 'Tập trung (Deep Work)', labelEn: 'Focus', score: focusScore, color: '#f59e0b' },
    { labelVi: 'Kỷ luật Tài chính', labelEn: 'Wealth & Savings', score: financeScore, color: '#34d399' }
  ];

  // SVG Radar Polygon coordinates
  const size = 260;
  const center = size / 2;
  const radius = 95;

  const points = radarAxes.map((axis, i) => {
    const angle = (Math.PI * 2 / radarAxes.length) * i - Math.PI / 2;
    const r = (axis.score / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-[#0c141c] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <GitBranch className="w-6 h-6 animate-pulse" />
              </span>
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                HOLOGRAPHIC LIFE AVATAR
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {language === 'vi' ? 'Bản sao Số Cá nhân (Digital Twin)' : 'Digital Twin Matrix'}
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Mô phỏng toàn cảnh dữ liệu sinh trắc học, tiến trình phát triển và dự báo tương lai nếu bạn duy trì nhịp sống kỷ luật hiện tại.'
                : 'A high-fidelity digital reflection unifying your biological, intellectual, and financial telemetry into predictive models.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a0d14]/90 border border-cyan-500/40 text-center w-full md:w-64 shadow-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400">
              {language === 'vi' ? 'Điểm tiến hóa tổng hợp' : 'Evolution Index'}
            </span>
            <div className="text-4xl font-display font-extrabold text-white my-1 font-mono">
              <span className="text-emerald-400">{lifeOSIndex}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <p className="text-xs font-semibold text-cyan-300">
              {language === 'vi' ? 'Tiến trình vượt bậc (+14% tuần này)' : 'Accelerated Growth (+14% WoW)'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Split: Radar Hologram + Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Holographic Radar Chart */}
        <div className="p-8 rounded-3xl bg-[#0a0d14] border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Biểu đồ Radar Đa chiều' : 'Hexagonal Telemetry Radar'}</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">6 Key Life Axes</span>
          </div>

          <div className="relative my-4">
            <svg width={size} height={size} className="overflow-visible">
              {/* Background Concentric Rings */}
              {gridCircles.map((factor, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * factor}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray={factor < 1 ? '3 3' : 'none'}
                />
              ))}

              {/* Axis lines */}
              {radarAxes.map((_, i) => {
                const angle = (Math.PI * 2 / radarAxes.length) * i - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radar Area Polygon */}
              <polygon
                points={points}
                fill="rgba(16, 185, 129, 0.25)"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Dots on points */}
              {radarAxes.map((axis, i) => {
                const angle = (Math.PI * 2 / radarAxes.length) * i - Math.PI / 2;
                const r = (axis.score / 100) * radius;
                const cx = center + r * Math.cos(angle);
                const cy = center + r * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#34d399"
                    stroke="#0a0d14"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mt-4">
            {radarAxes.map((axis, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#121622] border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block truncate">
                  {language === 'vi' ? axis.labelVi : axis.labelEn}
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {axis.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Trajectory & AI Projections */}
        <div className="space-y-6">
          
          {/* Predictive Horizon Card */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Dự báo Tiến trình Tương lai (Future Trajectory)' : 'Future Trajectory Projection'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {language === 'vi'
                ? 'Dựa trên thói quen ghi nhận hiện tại, mô hình thuật toán tính toán các mốc bạn sẽ đạt được:'
                : 'Algorithmic forward simulation assuming consistent daily execution:'}
            </p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800 flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs shrink-0">
                  +30d
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sau 30 ngày tiếp theo</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Đạt mốc cân nặng 66.8kg, tích lũy thêm 3,500 XP đạt Level 6, hoàn thành xong toàn bộ mock exam AWS.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800 flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs shrink-0">
                  +90d
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sau 90 ngày (1 Quý)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cán mốc cân nặng lý tưởng 65kg, quỹ khẩn cấp đạt 60,000,000 ₫, chạy 10km liên tục trong 55 phút.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800 flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-xs shrink-0">
                  +365d
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sau 1 năm kiên trì</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Đạt danh hiệu "Apex Life Architect", sở hữu nền tảng thể lực Zone 2 bền bỉ, thu nhập thặng dư tăng 45%.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Evolution Comparison */}
          <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">
              {language === 'vi' ? 'Nhật ký Tiến hóa Tuần (Weekly Evolution)' : 'Weekly Evolution Telemetry'}
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Thời gian tập trung (Deep Work)</span>
                <span className="text-emerald-400 font-bold">+28% so với tuần trước</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Tỷ lệ uống đủ nước</span>
                <span className="text-cyan-400 font-bold">+15% so với tuần trước</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Hoàn thành mục tiêu OKR</span>
                <span className="text-emerald-400 font-bold">3/4 Milestones xong</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Điểm ngủ trung bình</span>
                <span className="text-purple-400 font-bold">89.4 / 100 (+4.2 pts)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
