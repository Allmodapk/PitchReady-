import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { FeeCalculator } from './FeeCalculator';

interface GuaranteeViewProps {
  onNavigateToHire: () => void;
}

export const GuaranteeView: React.FC<GuaranteeViewProps> = ({ onNavigateToHire }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#173d34] to-[#123129] rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#d9b77d] font-medium mb-3">
            <ShieldCheck className="w-4 h-4 text-[#d9b77d]" />
            Practical Risk Reversal
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-medium tracking-tight">
            The PitchReady 45-Day 2x Replacement Guarantee
          </h1>
          <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed">
            Hiring sales talent should not feel like an unhedged gamble. We back every single placement with our strict 45-day performance window and up to 2 free replacements.
          </p>
        </div>
      </div>

      {/* 3 Pillars of the Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-4">
            45d
          </div>
          <h3 className="font-serif text-lg font-bold text-[#173d34] mb-2">
            45 Calendar Days of Coverage
          </h3>
          <p className="text-xs text-[#525f5a] leading-relaxed">
            Most probation churn occurs in weeks 2 to 5. Our 45-day window covers the critical onboarding and initial outbound ramp-up period.
          </p>
        </div>

        <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#b48643] flex items-center justify-center font-bold mb-4">
            2x
          </div>
          <h3 className="font-serif text-lg font-bold text-[#173d34] mb-2">
            Up to 2 Free Replacements
          </h3>
          <p className="text-xs text-[#525f5a] leading-relaxed">
            If the candidate departs, resigns, or fails to meet reasonable agreed call activity within 45 days, we provide up to two replacement candidates with zero new placement fees.
          </p>
        </div>

        <div className="bg-white border border-[#d9d5c9] p-6 rounded-3xl shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold mb-4">
            ₹0
          </div>
          <h3 className="font-serif text-lg font-bold text-[#173d34] mb-2">
            Zero Upfront Retainer
          </h3>
          <p className="text-xs text-[#525f5a] leading-relaxed">
            You pay nothing to receive candidate shortlists or conduct interviews. The flat placement fee (₹8k–₹12k) is only invoiced once the candidate formally joins.
          </p>
        </div>
      </div>

      {/* Transparent Fee Calculator */}
      <div id="calculator">
        <FeeCalculator />
      </div>

      {/* Contract Terms Checklist */}
      <div className="bg-[#fcfaf6] border border-[#d9d5c9] rounded-3xl p-6 sm:p-8">
        <h2 className="font-serif text-xl font-bold text-[#173d34] mb-4">
          Guarantee Conditions in Plain English
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#525f5a]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Valid on verified joining:</strong> The 45-day timer starts on Day 1 of candidate employment at your firm.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Fast turnaround:</strong> Replacement profiles are provided within 7 business days of written notification.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Fair compensation requirement:</strong> Employer must maintain the agreed salary structure stated during intake.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero hidden clauses:</strong> No percentage of annual CTC, no candidate-side deductions, ever.
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#d9d5c9] flex items-center justify-between">
          <span className="text-xs text-[#68736e]">
            Ready to hire sales talent with guaranteed downside protection?
          </span>
          <button
            onClick={onNavigateToHire}
            className="bg-[#173d34] hover:bg-[#0d2a24] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <span>Start Hiring</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d9b77d]" />
          </button>
        </div>
      </div>
    </div>
  );
};
