/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppMode, AppTab } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { ProcessSection } from './components/ProcessSection';
import { FeeCalculator } from './components/FeeCalculator';
import { InteractiveForm } from './components/InteractiveForm';
import { EmployerPortal } from './components/EmployerPortal';
import { CandidatePortal } from './components/CandidatePortal';
import { GuaranteeView } from './components/GuaranteeView';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<AppMode>('employer');
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const currentYear = new Date().getFullYear();

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
  };

  const handleTabChange = (newTab: AppTab) => {
    setActiveTab(newTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#15211d] flex flex-col selection:bg-[#b48643] selection:text-white pb-16 md:pb-0">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Header */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="flex-1">
        {/* VIEW 1: EMPLOYER WORKSPACE */}
        {activeTab === 'employer-portal' && (
          <div className="animate-in fade-in duration-200">
            <EmployerPortal />
          </div>
        )}

        {/* VIEW 2: CANDIDATE HUB */}
        {activeTab === 'candidate-portal' && (
          <div className="animate-in fade-in duration-200">
            <CandidatePortal />
          </div>
        )}

        {/* VIEW 3: GUARANTEE & FEES */}
        {activeTab === 'guarantee' && (
          <div className="animate-in fade-in duration-200">
            <GuaranteeView
              onNavigateToHire={() => {
                setActiveTab('overview');
                setMode('employer');
                setTimeout(() => {
                  const el = document.getElementById('start');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          </div>
        )}

        {/* VIEW 4: MAIN OVERVIEW / INTAKE */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in duration-200">
            {/* Hero Section */}
            <section id="top" className="border-b border-[#d9d5c9] hero-pattern">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
                {/* Mobile PWA Install Announcement Banner */}
                <div className="mb-6 sm:mb-8 block sm:hidden">
                  <PWAInstallButton variant="banner" />
                </div>

                <div className="max-w-3xl">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d9d5c9] bg-[#f7f4ec] px-3.5 py-1 text-xs font-medium text-[#68736e] shadow-2xs mb-5">
                    <span className="h-2 w-2 rounded-full bg-[#39735a] animate-pulse"></span>
                    <span>Recruitment, readiness &amp; placement</span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#173d34] leading-[1.08]">
                    The sales talent you need, <em className="italic font-normal">ready to perform.</em>
                  </h1>

                  {/* Body */}
                  <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#68736e] leading-relaxed max-w-2xl">
                    PitchReady recruits, prepares and assesses sales talent before we put them in front of your
                    hiring team. Faster hiring, clearer readiness, and a 45-day 2x replacement promise when a hire does
                    not work out.
                  </p>

                  {/* CTAs — trimmed to one primary + one secondary action */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleTabChange('employer-portal')}
                      className="rounded-full bg-[#173d34] hover:bg-[#0d2a24] text-white px-6 py-3 text-xs sm:text-sm font-semibold transition active:scale-95 shadow-sm inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore Vetted Talent Pool</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#d9b77d]" />
                    </button>

                    <button
                      onClick={() => {
                        handleModeChange('employer');
                        const el = document.getElementById('start');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="rounded-full border border-[#173d34] text-[#173d34] hover:bg-[#173d34] hover:text-white px-5 py-3 text-xs sm:text-sm font-semibold transition active:scale-95 bg-transparent cursor-pointer"
                    >
                      Post Hiring Brief
                    </button>

                    <div className="hidden sm:inline-block">
                      <PWAInstallButton variant="outline" />
                    </div>
                  </div>
                </div>

                {/* Quick Portals Feature Highlight Bar */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  <button
                    onClick={() => handleTabChange('employer-portal')}
                    className="text-left bg-white/80 hover:bg-white border border-[#d9d5c9] p-3.5 rounded-2xl transition shadow-2xs group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#173d34]/10 text-[#173d34] flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4 text-[#b48643]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#173d34]">
                          AI Brief &amp; Competency Calibrator
                        </div>
                        <div className="text-[11px] text-[#68736e]">
                          Configure ideal quota &amp; interview battlecards
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#b48643] group-hover:translate-x-0.5 transition" />
                  </button>

                  <button
                    onClick={() => handleTabChange('candidate-portal')}
                    className="text-left bg-white/80 hover:bg-white border border-[#d9d5c9] p-3.5 rounded-2xl transition shadow-2xs group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#173d34]">
                          Candidate Sales Playbooks
                        </div>
                        <div className="text-[11px] text-[#68736e]">
                          Pattern interrupts &amp; objection scripts
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#173d34] group-hover:translate-x-0.5 transition" />
                  </button>
                </div>

                {/* Stat Grid */}
                <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#d9d5c9] bg-[#d9d5c9] shadow-xs">
                  <div className="bg-[#f7f4ec] p-4.5 sm:p-6">
                    <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#173d34]">
                      ₹8k–₹12k
                    </p>
                    <p className="mt-1 text-xs text-[#68736e]">
                      placement fee by seniority (payable strictly on joining)
                    </p>
                  </div>

                  <div className="bg-[#f7f4ec] p-4.5 sm:p-6">
                    <div className="flex items-center gap-1.5">
                      <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#173d34]">
                        Ready-first
                      </p>
                      <Award className="w-5 h-5 text-[#b48643]" />
                    </div>
                    <p className="mt-1 text-xs text-[#68736e]">
                      trained &amp; verbally assessed before client introduction
                    </p>
                  </div>

                  <div className="bg-[#f7f4ec] p-4.5 sm:p-6">
                    <div className="flex items-center gap-1.5">
                      <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#173d34]">
                        45-day
                      </p>
                      <ShieldCheck className="w-5 h-5 text-[#39735a]" />
                    </div>
                    <p className="mt-1 text-xs text-[#68736e]">
                      guarantee window with up to 2 free replacements
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Problem & Solution Comparison */}
            <section className="border-b border-[#d9d5c9] bg-[#eee9dc]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
                <div className="max-w-2xl mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#b48643]">
                    The Mismatch
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#173d34] mt-1.5 leading-snug">
                    Resumes show history. They don’t show if someone can sell.
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-[#68736e] leading-relaxed">
                    Most sales hiring fails not on paper, but on the phone and across the demo table. Here is how PitchReady fixes the breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left: Traditional Recruitment */}
                  <div className="rounded-2xl border border-[#d9d5c9] bg-[#f7f4ec] p-6 sm:p-8 space-y-4">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                      Traditional Agency
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#173d34]">
                      Mass resume forwarding without verification
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#68736e] pt-2">
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                        <span>Dozens of untested CVs dumped on hiring managers</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                        <span>Zero phone or verbal pitch testing prior to interview</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                        <span>High percentage fees (8.33%–15% of annual CTC) with rigid refund terms</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                        <span>No candidate training or structured readiness coaching</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right: PitchReady */}
                  <div className="rounded-2xl border-2 border-[#173d34] bg-white p-6 sm:p-8 space-y-4 shadow-sm relative">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                      PitchReady Model
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#173d34]">
                      Readiness-first recruitment with verified capability
                    </h3>
                    <ul className="space-y-3 text-xs sm:text-sm text-[#15211d] pt-2">
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Curated shortlist of only candidates who pass live verbal drills</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Assessed on 30s pattern interrupts and real objection responses</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Flat fee of ₹8k–₹12k per hire, strictly payable after joining</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Up to 2 free replacements within 45 days if fit fails</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Section */}
            <section id="process" className="border-b border-[#d9d5c9] bg-[#f7f4ec]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
                <ProcessSection mode={mode} onModeChange={handleModeChange} />
              </div>
            </section>

            {/* Transparent Fees Section */}
            <section id="calculator" className="border-b border-[#d9d5c9] bg-[#eee9dc]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b48643]">
                      Risk-Free Recruitment
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#173d34] leading-snug">
                      Fixed, transparent fees with zero hidden retainers.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#68736e] leading-relaxed">
                      Traditional agencies demand upfront retainer fees or 8.33%–15% of annual compensation. PitchReady charges a simple flat fee per placement, due strictly after candidate joining.
                    </p>
                    <div className="space-y-2.5 pt-2 text-xs text-[#15211d]">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>No upfront cost or database subscription fee</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Up to two free replacements within 45 days if fit fails</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#39735a] shrink-0 mt-0.5" />
                        <span>Pre-screened on live sales phone conversations</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <FeeCalculator />
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Get Started / Interactive Form */}
            <section id="start" className="bg-[#f7f4ec]">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
                <InteractiveForm
                  mode={mode}
                  onModeChange={handleModeChange}
                  onNavigateToPortal={(tab) => handleTabChange(tab)}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0d2a24] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-white/10">
            <div className="space-y-2 max-w-sm">
              <p className="font-serif text-2xl font-semibold text-white tracking-tight">
                PitchReady<span className="text-[#d9b77d]">.</span>
              </p>
              <p className="text-xs text-white/70 leading-relaxed">
                Sales talent, prepared with intent and placed with confidence. Full-stack verified platform with 45-day 2x replacement guarantee.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <p className="font-semibold text-[#d9b77d] uppercase tracking-wider mb-2 text-[10px]">
                  Portals
                </p>
                <ul className="space-y-1.5 text-white/70">
                  <li>
                    <button
                      onClick={() => handleTabChange('employer-portal')}
                      className="hover:text-white"
                    >
                      Employer Workspace
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabChange('candidate-portal')}
                      className="hover:text-white"
                    >
                      Candidate Hub
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleTabChange('guarantee')}
                      className="hover:text-white"
                    >
                      Guarantee &amp; Pricing
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-[#d9b77d] uppercase tracking-wider mb-2 text-[10px]">
                  Coverage
                </p>
                <ul className="space-y-1.5 text-white/70">
                  <li>Kochi</li>
                  <li>Trivandrum</li>
                  <li>Kozhikode</li>
                  <li>Bengaluru</li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="font-semibold text-[#d9b77d] uppercase tracking-wider mb-2 text-[10px]">
                  Progressive Web App
                </p>
                <div className="space-y-2">
                  <PWAInstallButton
                    variant="outline"
                    className="text-white border-white/40 hover:bg-white/10 hover:text-white"
                  />
                  <p className="text-[11px] text-white/50">
                    Works offline with local draft caching
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
            <p>© {currentYear} PitchReady. Recruitment · Training · Assessment</p>
            <p>Placement guarantee backed by practical readiness.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav */}
      <MobileBottomNav
        mode={mode}
        onModeChange={handleModeChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
