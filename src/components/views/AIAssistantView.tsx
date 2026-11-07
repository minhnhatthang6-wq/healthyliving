import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Zap,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Utensils,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';

export const AIAssistantView: React.FC = () => {
  const {
    chatMessages,
    sendUserMessage,
    clearChat,
    user,
    language,
    bodyProfile,
    waterIntakeMl,
    waterTargetMl,
    dailyTasks,
    goals,
    sleepLog
  } = useLifeOS();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input;
    setInput('');
    setLoading(true);
    await sendUserMessage(query);
    setLoading(false);
  };

  const handleSuggestion = async (text: string) => {
    if (loading) return;
    setLoading(true);
    await sendUserMessage(text);
    setLoading(false);
  };

  const quickPrompts = [
    {
      icon: Clock,
      title: language === 'vi' ? 'Xây dựng lịch trình hôm nay' : 'Build Today Schedule',
      prompt: language === 'vi' ? 'Hãy giúp tôi xây dựng kế hoạch làm việc và học tập hiệu quả hôm nay theo phương pháp Time-blocking.' : 'Build me an optimal time-blocking schedule for today.'
    },
    {
      icon: Utensils,
      title: language === 'vi' ? 'Phân tích dinh dưỡng & Calo' : 'Nutrition & Calories Review',
      prompt: language === 'vi' ? 'Hãy phân tích chỉ số cơ thể của tôi và gợi ý thực đơn ăn uống lành mạnh không chứa chất dị ứng.' : 'Analyze my body profile and suggest a healthy meal plan without my allergens.'
    },
    {
      icon: TrendingUp,
      title: language === 'vi' ? 'Đánh giá tiến độ mục tiêu' : 'Evaluate Goals Progress',
      prompt: language === 'vi' ? 'Hãy đánh giá tiến độ các mục tiêu lớn của tôi và chỉ ra điểm cần cải thiện trong tuần này.' : 'Evaluate my active goals and give me actionable steps for this week.'
    },
    {
      icon: Zap,
      title: language === 'vi' ? 'Tối ưu hóa năng lượng' : 'Energy Optimization',
      prompt: language === 'vi' ? 'Làm thế nào để duy trì sự tỉnh táo và hạn chế kiệt sức (burnout) vào buổi chiều?' : 'How do I maintain peak cognitive energy and avoid afternoon slumps?'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                AI Life Assistant
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Active Heuristic + Gemini
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'vi'
                ? 'Được huấn luyện riêng trên hệ thống dữ liệu sinh trắc học, thói quen và mục tiêu của bạn'
                : 'Trained on your personal biometric data, habits, routines, and life architecture'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'vi' ? 'Đặt lại hội thoại' : 'Reset Conversation'}</span>
        </button>
      </div>

      {/* Quick Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((qp, i) => {
          const Icon = qp.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestion(qp.prompt)}
              className="p-3.5 rounded-2xl bg-[#0e121a] hover:bg-[#141b27] border border-slate-800 hover:border-emerald-500/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center space-x-2 text-emerald-400 mb-1.5">
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white">{qp.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{qp.prompt}</p>
            </button>
          );
        })}
      </div>

      {/* Chat Log Container */}
      <div className="rounded-3xl bg-[#0a0d14] border border-slate-800 flex flex-col h-[520px] overflow-hidden shadow-2xl">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 border border-slate-700 text-emerald-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'bg-[#121622] border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 font-mono ${
                        isUser ? 'text-emerald-100 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSuggestion(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 hover:border-emerald-500/40 hover:bg-slate-800/80 transition"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#121622] border border-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 font-mono ml-2">
                  {language === 'vi' ? 'Đang phân tích dữ liệu cuộc sống...' : 'Analyzing life telemetry...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0e121a] border-t border-slate-800">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'vi'
                  ? 'Hỏi bất kỳ điều gì về kế hoạch, dinh dưỡng, mục tiêu hoặc thói quen...'
                  : 'Ask anything about routines, nutrition, goals, or lifestyle...'
              }
              className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
