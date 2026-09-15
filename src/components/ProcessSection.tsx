import React, { useState } from 'react';
import { AppMode, ProcessStep } from '../types';
import { ArrowRight, CheckCircle2, Target, Users, CalendarCheck, ShieldCheck } from 'lucide-react';

interface ProcessSectionProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ mode, onModeChange }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const employerSteps: (ProcessStep & { icon: React.ReactNode })[] = [
    {
      num: '01',
      title: 'Define',
      desc: 'Share the role, city, seniority and hiring target. We calibrate expectations around genuine sales capability.',
      icon: <Target className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '02',
      title: 'Shortlist',
      desc: 'We surface trained, assessed candidates who fit your industry and pitch requirements.',
      icon: <Users className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '03',
      title: 'Interview',
      desc: 'You meet the people. We coordinate logistics, feedback loops, and interview debriefs.',
      icon: <CalendarCheck className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '04',
      title: 'Join & Protect',
      desc: 'You hire with confidence. We invoice only after joining, backed by our 2x replacement guarantee.',
      icon: <ShieldCheck className="w-4 h-4 text-[#b48643]" />,
    },
  ];

  const candidateSteps: (ProcessStep & { icon: React.ReactNode })[] = [
    {
      num: '01',
      title: 'Apply',
      desc: 'Tell us where you are, your background, and when you can start. No padded resume needed.',
      icon: <Target className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '02',
      title: 'Prepare',
      desc: 'Build practical sales capability around real job requirements, cold calling, and handling objections.',
      icon: <Users className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '03',
      title: 'Assess',
      desc: 'We evaluate your actual verbal readiness and coachability before recommending you to employers.',
      icon: <CalendarCheck className="w-4 h-4 text-[#b48643]" />,
    },
    {
      num: '04',
      title: 'Get Placed',
      desc: 'Interview with top regional employers actively looking for role-ready sales talent like you.',
      icon: <ShieldCheck className="w-4 h-4 text-[#b48643]" />,
    },
  ];

  const steps = mode === 'employer' ? employerSteps : candidateSteps;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#b48643]">
            The Process
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#173d34] mt-1">
            Simple on the outside. Disciplined underneath.
          </h2>
        </div>

        {/* Mode Toggle in Process */}
        <div className="flex bg-[#eee9dc] p-1 rounded-full border border-[#d9d5c9] shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('employer')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              mode === 'employer'
                ? 'bg-[#173d34] text-white shadow-xs'
                : 'text-[#68736e] hover:text-[#173d34]'
            }`}
          >
            Hiring Workflow
          </button>
          <button
            type="button"
            onClick={() => onModeChange('candidate')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              mode === 'candidate'
                ? 'bg-[#173d34] text-white shadow-xs'
                : 'text-[#68736e] hover:text-[#173d34]'
            }`}
          >
            Candidate Workflow
          </button>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          return (
            <div
              key={step.num}
              onClick={() => setActiveStep(idx)}
              className={`rounded-2xl border p-4.5 sm:p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#173d34] shadow-md ring-1 ring-[#173d34]/20 -translate-y-0.5'
                  : 'bg-[#f7f4ec] border-[#d9d5c9] hover:bg-[#eee9dc]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#173d34]/10 text-[#173d34]">
                  {step.num}
                </span>
                <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                  {step.icon}
                </div>
              </div>

              <h3 className="font-serif text-lg font-medium text-[#173d34]">
                {step.title}
              </h3>

              <p className="mt-1.5 text-xs text-[#68736e] leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
