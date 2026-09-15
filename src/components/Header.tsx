import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { AppMode, AppTab } from '../types';
import { Menu, X, WifiOff, ShieldCheck, Briefcase, Sparkles, Award } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  activeTab,
  onTabChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 border-b border-[#d9d5c9]/80 bg-[#f7f4ec]/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-1 font-serif text-xl sm:text-2xl font-semibold text-[#173d34] tracking-tight cursor-pointer"
          >
            PitchReady<span className="text-[#b48643]">.</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#68736e]">
            <button
              onClick={() => onTabChange('overview')}
              className={`hover:text-[#173d34] transition py-1 cursor-pointer ${
                activeTab === 'overview' ? 'text-[#173d34] font-semibold border-b-2 border-[#173d34]' : ''
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => {
                onTabChange('employer-portal');
                onModeChange('employer');
              }}
              className={`hover:text-[#173d34] transition py-1 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'employer-portal'
                  ? 'text-[#173d34] font-semibold border-b-2 border-[#173d34]'
                  : ''
              }`}
            >
              <span>Employer Workspace</span>
              <span className="text-[10px] bg-[#d9b77d]/30 text-[#845c22] px-1.5 py-0.5 rounded font-bold">
                AI Powered
              </span>
            </button>

            <button
              onClick={() => {
                onTabChange('candidate-portal');
                onModeChange('candidate');
              }}
              className={`hover:text-[#173d34] transition py-1 cursor-pointer ${
                activeTab === 'candidate-portal'
                  ? 'text-[#173d34] font-semibold border-b-2 border-[#173d34]'
                  : ''
              }`}
            >
              Candidate Hub
            </button>

            <button
              onClick={() => onTabChange('guarantee')}
              className={`hover:text-[#173d34] transition py-1 cursor-pointer ${
                activeTab === 'guarantee'
                  ? 'text-[#173d34] font-semibold border-b-2 border-[#173d34]'
                  : ''
              }`}
            >
              Guarantee &amp; Fees
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isOnline && (
              <span className="hidden xs:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton variant="compact" />

            <button
              onClick={() => {
                onTabChange('overview');
                const el = document.getElementById('start');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center rounded-full bg-[#173d34] hover:bg-[#0d2a24] text-white px-3.5 sm:px-4 py-2 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              Get Started
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#173d34] hover:bg-[#eee9dc] rounded-full transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#d9d5c9] py-3.5 space-y-2 animate-in slide-in-from-top duration-150">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={() => {
                  onTabChange('employer-portal');
                  onModeChange('employer');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border ${
                  activeTab === 'employer-portal'
                    ? 'bg-[#173d34] text-white border-[#173d34]'
                    : 'bg-white text-[#68736e] border-[#d9d5c9]'
                }`}
              >
                Employer Workspace
              </button>
              <button
                type="button"
                onClick={() => {
                  onTabChange('candidate-portal');
                  onModeChange('candidate');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border ${
                  activeTab === 'candidate-portal'
                    ? 'bg-[#173d34] text-white border-[#173d34]'
                    : 'bg-white text-[#68736e] border-[#d9d5c9]'
                }`}
              >
                Candidate Hub
              </button>
            </div>

            <nav className="flex flex-col space-y-1 text-xs font-medium text-[#68736e] pt-1">
              <button
                onClick={() => {
                  onTabChange('overview');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#eee9dc] hover:text-[#173d34]"
              >
                Overview &amp; Registration
              </button>
              <button
                onClick={() => {
                  onTabChange('guarantee');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-[#eee9dc] hover:text-[#173d34]"
              >
                45-Day 2x Replacement Guarantee
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
