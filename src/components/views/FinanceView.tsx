import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Trash2,
  PiggyBank,
  TrendingUp,
  Shield,
  CreditCard,
  Laptop,
  Plane,
  Sparkles
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { playSound } from '../../utils/audio';
import { TransactionType } from '../../types';

export const FinanceView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    language
  } = useLifeOS();

  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddSavingModal, setShowAddSavingModal] = useState(false);

  // Transaction form states
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txAmount, setTxAmount] = useState<number>(100000);
  const [txCategory, setTxCategory] = useState('Ăn uống');
  const [txDesc, setTxDesc] = useState('');
  const [txMethod, setTxMethod] = useState('Ví điện tử');

  // Savings form states
  const [savingTitle, setSavingTitle] = useState('');
  const [savingTarget, setSavingTarget] = useState<number>(20000000);
  const [savingInitial, setSavingInitial] = useState<number>(5000000);
  const [savingCategory, setSavingCategory] = useState('Dự phòng khẩn cấp');
  const [savingDate, setSavingDate] = useState('2026-12-31');

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Category breakdown for expenses
  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmount <= 0) return;
    addTransaction({
      type: txType,
      amount: Number(txAmount),
      category: txCategory,
      description: txDesc || txCategory,
      paymentMethod: txMethod
    });
    setShowAddTxModal(false);
    setTxDesc('');
  };

  const handleCreateSaving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingTitle.trim() || savingTarget <= 0) return;
    addSavingsGoal({
      title: savingTitle.trim(),
      targetAmount: Number(savingTarget),
      currentAmount: Number(savingInitial),
      targetDate: savingDate,
      category: savingCategory
    });
    setShowAddSavingModal(false);
    setSavingTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e141f] border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Wallet className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {language === 'vi' ? 'Quản lý Tài chính Cá nhân (Smart Finance)' : 'Smart Wealth Architecture'}
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {language === 'vi'
                ? 'Làm chủ dòng tiền, tối ưu hóa tỷ lệ tích lũy và xây dựng các mục tiêu tự do tài chính dài hạn.'
                : 'Cashflow mastery, automated expense categorisation, surplus velocity, and milestone savings vaults.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => { playSound('click'); setShowAddTxModal(true); }}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'vi' ? 'Ghi chép giao dịch' : 'Add Transaction'}</span>
            </button>

            <button
              type="button"
              onClick={() => { playSound('click'); setShowAddSavingModal(true); }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition cursor-pointer"
            >
              {language === 'vi' ? 'Tạo quỹ tiết kiệm' : 'Create Vault'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Surplus / Balance */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <span className="text-xs font-medium text-slate-400">
            {language === 'vi' ? 'Dòng tiền thặng dư' : 'Net Cashflow'}
          </span>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className={`text-2xl font-display font-extrabold font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {balance.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-400">₫</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">
            {language === 'vi' ? 'Thu nhập trừ chi tiêu chu kỳ' : 'Cycle surplus balance'}
          </span>
        </div>

        {/* Total Income */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Tổng thu nhập' : 'Total Income'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-display font-extrabold text-white font-mono">
              {totalIncome.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-400">₫</span>
          </div>
          <span className="text-[10px] text-emerald-400 mt-2 block font-mono">
            +100% Inflow
          </span>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Tổng chi tiêu' : 'Total Expenses'}
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-display font-extrabold text-white font-mono">
              {totalExpense.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-400">₫</span>
          </div>
          <span className="text-[10px] text-rose-400 mt-2 block font-mono">
            {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}% của thu nhập
          </span>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-2xl bg-[#0e121a] border border-slate-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {language === 'vi' ? 'Tỷ lệ tiết kiệm' : 'Savings Rate'}
            </span>
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-display font-extrabold text-emerald-400 font-mono">
              {savingsRate}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-mono">
            Mục tiêu chuẩn: {'>'} 30%
          </span>
        </div>

      </div>

      {/* Savings Goals / Vaults */}
      <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <span>{language === 'vi' ? 'Quỹ Mục tiêu Tiết kiệm (Savings Vaults)' : 'Savings Vaults'}</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400">
            {savingsGoals.length} {language === 'vi' ? 'Mục tiêu' : 'Vaults'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savingsGoals.map((sg) => {
            const percent = sg.targetAmount > 0 ? Math.min(100, Math.round((sg.currentAmount / sg.targetAmount) * 100)) : 0;
            return (
              <div
                key={sg.id}
                className="p-5 rounded-2xl bg-[#121622] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                      {sg.category}
                    </span>
                    <span className="text-xs font-bold font-mono text-white">
                      {percent}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{sg.title}</h3>

                  <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-baseline text-xs font-mono mt-2">
                    <span className="text-emerald-400 font-bold">
                      {sg.currentAmount.toLocaleString('vi-VN')} ₫
                    </span>
                    <span className="text-slate-500">
                      / {sg.targetAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Hạn: {sg.targetDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => { playSound('complete'); updateSavingsGoal(sg.id, 1000000); }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold active:scale-95"
                  >
                    +1,000,000 ₫
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History & Categorization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown (1 col) */}
        <div className="p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{language === 'vi' ? 'Phân bổ Chi tiêu' : 'Expense Allocation'}</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(expenseByCategory).map(([cat, amount]) => {
              const ratio = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="font-mono text-slate-400">{amount.toLocaleString('vi-VN')} ₫ ({ratio}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Table (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e121a] border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">
            {language === 'vi' ? 'Nhật ký Giao dịch Gần đây' : 'Recent Transactions'}
          </h3>

          <div className="space-y-2">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-[#121622] border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 truncate mr-2">
                    <div className={`p-2 rounded-xl shrink-0 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">{tx.description}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`text-xs font-bold font-mono ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} ₫
                    </span>
                    <button
                      type="button"
                      aria-label="Delete transaction"
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add Transaction Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Ghi chép giao dịch tài chính' : 'Record Transaction'}</span>
            </h3>

            <form onSubmit={handleCreateTx} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    txType === 'expense' ? 'bg-rose-500 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  {language === 'vi' ? 'Khoản Chi' : 'Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    txType === 'income' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  {language === 'vi' ? 'Khoản Thu' : 'Income'}
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Số tiền (VNĐ)' : 'Amount (VND)'}
                </label>
                <input
                  type="number"
                  step="1000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Phân loại danh mục' : 'Category'}
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Ăn uống">Ăn uống & Cà phê</option>
                    <option value="Học tập & Sách">Học tập & Sách</option>
                    <option value="Thể thao & Sức khỏe">Thể thao & Sức khỏe</option>
                    <option value="Nhà cửa & Hóa đơn">Nhà cửa & Hóa đơn</option>
                    <option value="Di chuyển">Di chuyển / Xăng xe</option>
                    <option value="Giải trí">Giải trí & Giao lưu</option>
                    <option value="Lương & Thưởng">Lương & Thưởng</option>
                    <option value="Freelance & Dự án">Freelance & Dự án</option>
                    <option value="Đầu tư sinh lời">Đầu tư sinh lời</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Phương thức' : 'Payment'}
                  </label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Ví MoMo">Ví MoMo</option>
                    <option value="Chuyển khoản VCB">Chuyển khoản VCB</option>
                    <option value="Thẻ Visa/Master">Thẻ Visa/Master</option>
                    <option value="Tiền mặt">Tiền mặt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Mô tả chi tiết' : 'Description'}
                </label>
                <input
                  type="text"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="vd: Cơm trưa với đồng nghiệp, mua giáo trình..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {language === 'vi' ? 'Lưu giao dịch (+20 XP)' : 'Save (+20 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Savings Goal Modal */}
      {showAddSavingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f121a] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <PiggyBank className="w-5 h-5 text-emerald-400" />
              <span>{language === 'vi' ? 'Tạo Quỹ Tiết kiệm Mới' : 'Create Savings Vault'}</span>
            </h3>

            <form onSubmit={handleCreateSaving} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Tên quỹ mục tiêu' : 'Vault Name'}
                </label>
                <input
                  type="text"
                  value={savingTitle}
                  onChange={(e) => setSavingTitle(e.target.value)}
                  placeholder="vd: Quỹ khẩn cấp 6 tháng, Mua xe..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Mục tiêu (VNĐ)' : 'Target (VND)'}
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={savingTarget}
                    onChange={(e) => setSavingTarget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {language === 'vi' ? 'Đã có sẵn (VNĐ)' : 'Initial (VND)'}
                  </label>
                  <input
                    type="number"
                    step="500000"
                    value={savingInitial}
                    onChange={(e) => setSavingInitial(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi' ? 'Ngày dự kiến hoàn thành' : 'Target Date'}
                </label>
                <input
                  type="date"
                  value={savingDate}
                  onChange={(e) => setSavingDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSavingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {language === 'vi' ? 'Tạo quỹ (+40 XP)' : 'Create (+40 XP)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
