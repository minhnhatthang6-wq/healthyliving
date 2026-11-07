import React, { useState, useEffect } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { BodyProfileView } from './components/views/BodyProfileView';
import { NutritionView } from './components/views/NutritionView';
import { FocusView } from './components/views/FocusView';
import { GoalsView } from './components/views/GoalsView';
import { HealthView } from './components/views/HealthView';
import { FinanceView } from './components/views/FinanceView';
import { SkillTreeView } from './components/views/SkillTreeView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { AccountView } from './components/views/AccountView';
import { AuthModal } from './components/auth/AuthModal';
import { QuickAddModal } from './components/modals/QuickAddModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useLifeOS();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'task' | 'water' | 'expense' | 'workout'>('task');

  // Handle URL query parameters (e.g. ?autostart=1 or ?tab=nutrition)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, [setActiveTab]);

  const handleOpenQuickAdd = (type: 'task' | 'water' | 'expense' | 'workout' = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onOpenQuickAdd={handleOpenQuickAdd} />;
      case 'assistant':
        return <AIAssistantView />;
      case 'body':
        return <BodyProfileView />;
      case 'nutrition':
        return <NutritionView />;
      case 'focus':
        return <FocusView />;
      case 'goals':
        return <GoalsView />;
      case 'health':
        return <HealthView />;
      case 'finance':
        return <FinanceView />;
      case 'skills':
        return <SkillTreeView />;
      case 'digital_twin':
        return <DigitalTwinView />;
      case 'account':
        return <AccountView />;
      default:
        return <DashboardView onOpenQuickAdd={handleOpenQuickAdd} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col cyber-grid relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        onOpenQuickAdd={() => handleOpenQuickAdd('task')}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

        {/* Viewport Content Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080b]/90 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <p>LIFE OS • DESIGN YOUR LIFE. UPGRADE YOURSELF. • Cuộc sống của bạn, hệ thống của bạn, tương lai do bạn kiến tạo.</p>
      </footer>

      {/* Dialog Modals */}
      <AuthModal />
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultTab={quickAddType}
      />
    </div>
  );
};

export default function App() {
  return (
    <LifeOSProvider>
      <AppContent />
    </LifeOSProvider>
  );
}
