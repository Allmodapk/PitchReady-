import React, { useState } from 'react';
import {
  CheckCircle2,
  PhoneCall,
  Clock,
  BookOpen,
  Award,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const CandidatePortal: React.FC = () => {
  const [activeObjectionTab, setActiveObjectionTab] = useState<'vendor' | 'email' | 'budget'>('vendor');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#173d34] to-[#245b4e] rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#d9b77d] font-medium mb-3">
              <Award className="w-4 h-4 text-[#d9b77d]" />
              Candidate Readiness Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
              Get Trained, Pre-Vetted &amp; Placed in High-Growth Sales Roles
            </h1>
            <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">
              We don't just forward your CV. PitchReady trains you on real-world outbound pitches, objection handling, and discovery calls before connecting you directly with vetted hiring managers.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 px-5 py-3 rounded-2xl text-center shrink-0">
            <div className="text-xs text-white/70">Candidate Placement Fee</div>
            <div className="text-xl font-bold text-[#d9b77d]">100% Free for Job Seekers</div>
            <div className="text-[10px] text-white/60">No training fee, no salary cut</div>
          </div>
        </div>
      </div>

      {/* Pipeline Status Stages */}
      <div className="bg-white border border-[#d9d5c9] rounded-3xl p-6 shadow-xs mb-8">
        <h2 className="font-serif text-lg font-bold text-[#173d34] mb-2">
          Your 5-Stage Placement Pathway
        </h2>
        <p className="text-xs text-[#68736e] mb-6">
          How our readiness-first pipeline works from your initial submission to your signed offer letter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Application Intake',
              desc: 'Review of sales intent, communication fluency, and location availability.',
              status: 'Completed / Active',
            },
            {
              step: '02',
              title: 'Voice Readiness Diagnostic',
              desc: '15-minute phone screening evaluating verbal pace, energy, and diction.',
              status: 'Standard',
            },
            {
              step: '03',
              title: 'Objection Sparring',
              desc: 'Practice session simulating skeptical buyers ("Send me an email", "No budget").',
              status: 'Practical Rubric',
            },
            {
              step: '04',
              title: 'Employer Introduction',
              desc: 'Direct calendar interview with founders and sales heads looking for your role.',
              status: 'Guaranteed Match',
            },
            {
              step: '05',
              title: 'Joining & Support',
              desc: '45-day onboarding check-ins and performance coaching to ensure quota success.',
              status: '45-Day Backed',
            },
          ].map((stage, idx) => (
            <div
              key={idx}
              className="bg-[#fcfaf6] border border-[#d9d5c9] p-4 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-[#b48643]">{stage.step}</span>
                <h3 className="font-serif text-sm font-bold text-[#173d34] mt-1 mb-1">
                  {stage.title}
                </h3>
                <p className="text-[11px] text-[#525f5a] leading-relaxed">{stage.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#e5e1d5] text-[10px] font-semibold text-[#173d34]">
                {stage.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Sales Mastery Syllabus (Non-AI, Practical Training Hub) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: 3-Part Pitch Formula */}
        <div className="bg-white border border-[#d9d5c9] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#b48643]" />
            <h3 className="font-serif text-lg font-bold text-[#173d34]">
              The 3-Step Outbound Pitch Formula
            </h3>
          </div>
          <p className="text-xs text-[#68736e] mb-4">
            Master this framework tested across thousands of successful cold outreach dials in India:
          </p>

          <div className="space-y-3">
            <div className="bg-[#f7f4ec] border border-[#e5e1d5] p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-[#173d34] mb-1">
                1. Permission &amp; Pattern Interrupt (Seconds 1–10)
              </div>
              <p className="text-xs text-[#525f5a] leading-relaxed">
                <em>"Hi [Name], I know I caught you in the middle of your day. Do you have 30 seconds to tell me if this is completely irrelevant to your team?"</em>
              </p>
            </div>

            <div className="bg-[#f7f4ec] border border-[#e5e1d5] p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-[#173d34] mb-1">
                2. The Problem Anchor (Seconds 11–25)
              </div>
              <p className="text-xs text-[#525f5a] leading-relaxed">
                <em>"Most sales leaders in Kerala tell us they waste 3 weeks interviewing candidates who look good on paper but freeze when cold-calling prospects."</em>
              </p>
            </div>

            <div className="bg-[#f7f4ec] border border-[#e5e1d5] p-3.5 rounded-2xl">
              <div className="text-xs font-bold text-[#173d34] mb-1">
                3. The Definitive Next Step (Seconds 26–35)
              </div>
              <p className="text-xs text-[#525f5a] leading-relaxed">
                <em>"I’m not asking you to buy anything right now. Are you open to looking at 2 candidate profiles this Thursday at 11 AM?"</em>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Objection Battlecards */}
        <div className="bg-white border border-[#d9d5c9] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#173d34]" />
            <h3 className="font-serif text-lg font-bold text-[#173d34]">
              Objection Handling Battlecards
            </h3>
          </div>
          <p className="text-xs text-[#68736e] mb-4">
            Select an objection to review the tested script our evaluators look for:
          </p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveObjectionTab('vendor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeObjectionTab === 'vendor'
                  ? 'bg-[#173d34] text-white shadow-xs'
                  : 'bg-[#f7f4ec] text-[#68736e] hover:text-[#173d34]'
              }`}
            >
              "We have a vendor"
            </button>
            <button
              onClick={() => setActiveObjectionTab('email')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeObjectionTab === 'email'
                  ? 'bg-[#173d34] text-white shadow-xs'
                  : 'bg-[#f7f4ec] text-[#68736e] hover:text-[#173d34]'
              }`}
            >
              "Send me an email"
            </button>
            <button
              onClick={() => setActiveObjectionTab('budget')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeObjectionTab === 'budget'
                  ? 'bg-[#173d34] text-white shadow-xs'
                  : 'bg-[#f7f4ec] text-[#68736e] hover:text-[#173d34]'
              }`}
            >
              "No budget"
            </button>
          </div>

          <div className="bg-[#fcfaf6] border border-[#d9d5c9] p-4 rounded-2xl">
            {activeObjectionTab === 'vendor' && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-red-800">
                  ❌ Amateur Response:
                </div>
                <p className="text-xs text-[#68736e] italic">
                  "Oh okay, our pricing is cheaper than them, can I send you a quote anyway?"
                </p>
                <div className="text-xs font-bold text-emerald-800 pt-2">
                  ✅ PitchReady Pro Response:
                </div>
                <p className="text-xs text-[#173d34] font-medium leading-relaxed">
                  "That makes complete sense—most top companies already have a vendor. We don't ask people to switch. Typically, clients keep their existing partner and use us specifically for guaranteed replacement backup when hiring velocity spikes. Would you be opposed to a 10-minute comparison next Tuesday?"
                </p>
              </div>
            )}

            {activeObjectionTab === 'email' && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-red-800">
                  ❌ Amateur Response:
                </div>
                <p className="text-xs text-[#68736e] italic">
                  "Sure, what is your email ID? I'll send our PDF deck right now."
                </p>
                <div className="text-xs font-bold text-emerald-800 pt-2">
                  ✅ PitchReady Pro Response:
                </div>
                <p className="text-xs text-[#173d34] font-medium leading-relaxed">
                  "I'd be glad to send an email. But we have case studies for B2B SaaS, logistics, and field sales. So I don't flood your inbox with irrelevant slides, are you currently looking to expand inbound closers or outbound appointment setters?"
                </p>
              </div>
            )}

            {activeObjectionTab === 'budget' && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-red-800">
                  ❌ Amateur Response:
                </div>
                <p className="text-xs text-[#68736e] italic">
                  "Can we give you a discount or waive the fee?"
                </p>
                <div className="text-xs font-bold text-emerald-800 pt-2">
                  ✅ PitchReady Pro Response:
                </div>
                <p className="text-xs text-[#173d34] font-medium leading-relaxed">
                  "Completely understood. When budgets are tight, the biggest risk is hiring someone on salary who fails to generate pipeline. Our model only bills a flat ₹10k upon verified joining with a 45-day 2x replacement backup. Would it make sense to plan for next month's batch?"
                </p>
              </div>
            )}
          </div>

          {/* Assessment Criteria */}
          <div className="mt-4 pt-4 border-t border-[#d9d5c9]">
            <h4 className="text-xs font-bold text-[#173d34] uppercase tracking-wider mb-2">
              What PitchReady Evaluators Grade On
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f7f4ec] p-2 rounded-lg border border-[#e5e1d5]">
                <span className="font-semibold text-[#173d34] block">Tonality &amp; Energy</span>
                <span className="text-[11px] text-[#68736e]">Confident downward inflection at statement ends</span>
              </div>
              <div className="bg-[#f7f4ec] p-2 rounded-lg border border-[#e5e1d5]">
                <span className="font-semibold text-[#173d34] block">Objection Resilience</span>
                <span className="text-[11px] text-[#68736e]">Validating buyer hesitation without defensiveness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
