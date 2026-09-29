import React, { useState, useEffect } from 'react';
import { User, PlanRecommendation } from '../types';
import { ForvestLogo } from '../components/ForvestLogo';
import { SignInView } from '../components/SignInView';
import { PlansList } from './PlansList';
import { CompareTool } from './CompareTool';
import { ApplicationTracker } from './ApplicationTracker';
import { QuizTool } from './QuizTool';
import { api } from '../services/api';
import { 
  FileText, 
  BarChart3, 
  FileCheck2, 
  HelpCircle, 
  LogOut, 
  Home,
  User as UserIcon
} from 'lucide-react';

interface AppShellProps {
  onBackToMarketing: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ onBackToMarketing }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<'plans' | 'compare' | 'application' | 'quiz'>('plans');
  const [selectedPlanForApplication, setSelectedPlanForApplication] = useState<PlanRecommendation | null>(null);

  // If signed out, show clean dedicated sign-in screen
  if (!currentUser) {
    return (
      <SignInView
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentTab('plans');
        }}
        onBackToHome={onBackToMarketing}
      />
    );
  }

  const handleLogout = () => {
    api.clearSession();
    setCurrentUser(null);
    onBackToMarketing();
  };

  const handlePlanCreated = (newPlan: PlanRecommendation) => {
    setSelectedPlanForApplication(newPlan);
  };

  const handleNavigateToApplication = (plan: PlanRecommendation) => {
    setSelectedPlanForApplication(plan);
    setCurrentTab('application');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans text-[#1C2733]">
      
      {/* 1. Compact App Header (Logo mark + Area Name + User Menu) */}
      <header className="h-[60px] bg-white border-b border-[#E4E0D6] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left: Return to Overview & Area name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMarketing}
            className="flex items-center gap-1.5 text-[#5B6672] hover:text-[#1C2733] text-[13px] font-medium pr-3 border-r border-[#E4E0D6] cursor-pointer"
            title="Return to Public Overview"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <ForvestLogo size={22} />
            <span className="font-serif font-bold text-[18px] text-[#1C2733] tracking-tight">
              Forvest
            </span>
            <span className="text-[#5B6672] text-[13px]">/</span>
            <span className="text-[14px] font-semibold text-[#1C2733]">
              Workspace
            </span>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-semibold text-[#1C2733]">
              {currentUser.name || currentUser.email.split('@')[0]}
            </span>
            <span className="text-[11px] text-[#5B6672]">
              {currentUser.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="text-[13px] text-[#5B6672] hover:text-[#1C2733] px-3 py-1.5 rounded-[4px] border border-[#E4E0D6] hover:bg-[#FAF8F4] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

      </header>

      {/* 2. App Body with Navigation Bar & Main View */}
      <div className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar with One Clear Active State */}
        <aside className="w-full md:w-[240px] shrink-0">
          <nav className="bg-white border border-[#E4E0D6] rounded-[8px] p-2 space-y-1 shadow-xs sticky top-[80px]">
            
            <button
              onClick={() => setCurrentTab('plans')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer text-left ${
                currentTab === 'plans'
                  ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                  : 'text-[#5B6672] hover:text-[#1C2733] hover:bg-[#FAF8F4]/50'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>My Plans</span>
            </button>

            <button
              onClick={() => setCurrentTab('compare')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer text-left ${
                currentTab === 'compare'
                  ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                  : 'text-[#5B6672] hover:text-[#1C2733] hover:bg-[#FAF8F4]/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Plan Comparison</span>
            </button>

            <button
              onClick={() => setCurrentTab('application')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer text-left ${
                currentTab === 'application'
                  ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                  : 'text-[#5B6672] hover:text-[#1C2733] hover:bg-[#FAF8F4]/50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>Switch Application</span>
            </button>

            <button
              onClick={() => setCurrentTab('quiz')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[6px] text-[14px] font-medium transition-colors cursor-pointer text-left ${
                currentTab === 'quiz'
                  ? 'bg-[#FAF8F4] text-[#1B7A54] font-semibold border border-[#E4E0D6]'
                  : 'text-[#5B6672] hover:text-[#1C2733] hover:bg-[#FAF8F4]/50'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Repayment Quiz</span>
            </button>

            <div className="pt-4 mt-2 border-t border-[#E4E0D6] px-3.5 pb-2 text-[12px] text-[#5B6672]">
              <span className="font-semibold text-[#1C2733] block mb-0.5">Notice Deadline</span>
              SAVE exits in progress. Select a plan to avoid automatic Standard enrollment.
            </div>

          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">
          {currentTab === 'plans' && (
            <PlansList
              currentUser={currentUser}
              onNavigateToCompare={() => setCurrentTab('compare')}
              onNavigateToApplication={handleNavigateToApplication}
            />
          )}

          {currentTab === 'compare' && (
            <CompareTool
              onPlanCreated={handlePlanCreated}
              onNavigateToApplication={handleNavigateToApplication}
            />
          )}

          {currentTab === 'application' && (
            <ApplicationTracker
              plan={selectedPlanForApplication}
              currentUser={currentUser}
              onBack={() => setCurrentTab('plans')}
              onStatusUpdated={(updated) => setSelectedPlanForApplication(updated)}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizTool onNavigateToCompare={() => setCurrentTab('compare')} />
          )}
        </main>

      </div>

    </div>
  );
};
