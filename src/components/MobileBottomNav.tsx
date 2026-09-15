import React from 'react';
import { AppMode, AppTab } from '../types';
import { Building2, UserCircle, Send, LayoutDashboard, Home, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  mode,
  onModeChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f7f4ec]/95 backdrop-blur-md border-t border-[#d9d5c9] px-3 py-2 safe-bottom shadow-lg">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeTab === 'overview'
              ? 'text-[#173d34] bg-[#eee9dc]'
              : 'text-[#68736e]'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('employer-portal');
            onModeChange('employer');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeTab === 'employer-portal'
              ? 'text-[#173d34] bg-[#eee9dc]'
              : 'text-[#68736e]'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5 text-[#b48643]" />
          <span>Employer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('candidate-portal');
            onModeChange('candidate');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeTab === 'candidate-portal'
              ? 'text-[#173d34] bg-[#eee9dc]'
              : 'text-[#68736e]'
          }`}
        >
          <UserCircle className="w-4 h-4 mb-0.5" />
          <span>Candidate</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange('guarantee')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeTab === 'guarantee'
              ? 'text-[#173d34] bg-[#eee9dc]'
              : 'text-[#68736e]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mb-0.5 text-emerald-700" />
          <span>Guarantee</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('overview');
            const el = document.getElementById('start');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#173d34] text-white px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-xs active:scale-95"
        >
          <span>{mode === 'employer' ? 'Hire' : 'Apply'}</span>
          <Send className="w-2.5 h-2.5 text-[#d9b77d]" />
        </button>
      </div>
    </div>
  );
};
